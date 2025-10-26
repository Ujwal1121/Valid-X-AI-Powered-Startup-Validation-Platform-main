# graphs/workflow.py

from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition
import os
from langchain_core.messages import ToolMessage
from state.agent_state import AgentState

# Existing imports
from nodes.market_analyst import analyze_market
from nodes.competitor_analysis import analyze_competition
from nodes.risk_assessor import assess_risk
from nodes.advisor import advisor

# ========== NEW IMPORTS ==========
from nodes.competitor_intelligence import analyze_competitor_intelligence
from nodes.financial_viability import analyze_financial_viability
from nodes.investor_decision import make_investor_decision

from tools.web_search_tool import web_search
from config import REPORTS_PATH, GRAPH_VISUALIZATION_PATH, ANALYSIS_LIST


def router(state: AgentState):
    """Handles the routing logic after the tools node"""
    for analysis in ANALYSIS_LIST:
        if state.get(str(analysis)) is None:
            # if tool is failed
            if isinstance(state["messages"][-1], ToolMessage) and state["messages"][-1].content == "tool_failed":
                if analysis == "market_analysis":
                    return_node = "analyze_market_fallback"
                elif analysis == "competition_analysis":
                    return_node = "analyze_competition_fallback"
                elif analysis == "risk_assessment":
                    return_node = "assess_risk_fallback"
                elif analysis == "competitor_intelligence":
                    return_node = "competitor_intelligence_fallback"
                elif analysis == "financial_viability":
                    return_node = "financial_viability_fallback"
                break
            else:
                if isinstance(state["messages"][-1], ToolMessage):
                    state[analysis] = state["messages"][-1].content
                
                if analysis == "market_analysis":
                    return_node = "analyze_competition"
                elif analysis == "competition_analysis":
                    return_node = "assess_risk"
                elif analysis == "risk_assessment":
                    return_node = "competitor_intelligence"  # NEW FLOW
                elif analysis == "competitor_intelligence":
                    return_node = "financial_viability"       # NEW FLOW
                elif analysis == "financial_viability":
                    return_node = "advisor"
                break
    return return_node


def build_graph():
    try:
        graph_builder = StateGraph(AgentState)
        
        # ========== EXISTING NODES ==========
        graph_builder.add_node("analyze_market", analyze_market(preferred_mode="tools"))
        graph_builder.add_node("analyze_competition", analyze_competition(preferred_mode="tools"))
        graph_builder.add_node("assess_risk", assess_risk(preferred_mode="tools"))
        
        # Fallback nodes (chat_model only)
        graph_builder.add_node("analyze_market_fallback", analyze_market(preferred_mode="chat_model"))
        graph_builder.add_node("analyze_competition_fallback", analyze_competition(preferred_mode="chat_model"))
        graph_builder.add_node("assess_risk_fallback", assess_risk(preferred_mode="chat_model"))
        
        # ========== NEW NODES ==========
        graph_builder.add_node("competitor_intelligence", analyze_competitor_intelligence(preferred_mode="chat_model"))
        graph_builder.add_node("competitor_intelligence_fallback", analyze_competitor_intelligence(preferred_mode="chat_model"))
        
        graph_builder.add_node("financial_viability", analyze_financial_viability(preferred_mode="chat_model"))
        graph_builder.add_node("financial_viability_fallback", analyze_financial_viability(preferred_mode="chat_model"))
        
        graph_builder.add_node("advisor", advisor)
        graph_builder.add_node("investor_decision", make_investor_decision)  # NEW: Final decision node
        
        graph_builder.add_node("tools", ToolNode(tools=[web_search]))
        
        # ========== WORKFLOW EDGES ==========
        graph_builder.set_entry_point("analyze_market")
        
        # Existing flow
        graph_builder.add_conditional_edges("analyze_market", tools_condition, {"tools": "tools", "__end__": "analyze_competition"})
        graph_builder.add_conditional_edges("analyze_competition", tools_condition, {"tools": "tools", "__end__": "assess_risk"})
        graph_builder.add_conditional_edges("assess_risk", tools_condition, {"tools": "tools", "__end__": "competitor_intelligence"})  # NEW
        
        # NEW: Flow through investor analysis
        graph_builder.add_edge("competitor_intelligence", "financial_viability")
        graph_builder.add_edge("financial_viability", "advisor")
        graph_builder.add_edge("advisor", "investor_decision")  # NEW: Final decision
        
        # Conditional edges for tools
        graph_builder.add_conditional_edges("tools", router)
        
        # Fallback flows
        graph_builder.add_edge("analyze_market_fallback", "analyze_competition")
        graph_builder.add_edge("analyze_competition_fallback", "assess_risk")
        graph_builder.add_edge("assess_risk_fallback", "competitor_intelligence")  # NEW
        graph_builder.add_edge("competitor_intelligence_fallback", "financial_viability")  # NEW
        graph_builder.add_edge("financial_viability_fallback", "advisor")  # NEW
        
        # End node
        graph_builder.add_edge("investor_decision", END)
        
        graph = graph_builder.compile()
        
        return graph
    except Exception as e:
        print(f"Error in building graph: {e}")
        return None
