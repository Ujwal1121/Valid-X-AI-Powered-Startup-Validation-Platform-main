from typing import TypedDict, List, Optional
from pydantic import Field
from langchain_core.messages import BaseMessage

# #State model for the agent
# class AgentState(TypedDict):
#     startup_idea: str
#     market_analysis: Optional[str]
#     competition_analysis: Optional[str]
#     risk_assessment: Optional[str]
#     advisor_recommendations: Optional[str]
#     advice: Optional[str]
#     messages: List[BaseMessage]

# state/agent_state.py

from typing import TypedDict, Annotated, List

class AgentState(TypedDict):
    """
    State shared across all agents in the workflow.
    """
    # Core inputs and outputs
    startup_idea: str
    
    # Existing analysis outputs
    market_analysis: str
    competition_analysis: str
    risk_assessment: str
    advisor_recommendations: str
    advice: str
    
    # ========== NEW: INVESTOR DECISION FIELDS ==========
    competitor_intelligence: dict  # Competitor data with metrics
    financial_viability: dict      # Revenue/cost projections
    investor_decision: str         # INVEST / HOLD / NOT INVEST
    investor_confidence: int       # 0-100 confidence score
    investor_reasoning: str        # Detailed reasoning
    investor_strengths: str        # Key strengths
    investor_concerns: str         # Key concerns
    suggested_investment: float    # Suggested investment amount
    expected_return: str           # Expected ROI timeline
    
    # Messages for tool calls
    messages: List
