from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import Literal, Annotated
from state.agent_state import AgentState
from models.chat_model import chat_model
import os
from config import INVESTOR_DECISION_PROMPT_PATH


class InvestorDecisionSchema(BaseModel):
    """Schema for final investor decision"""
    decision: Annotated[Literal["INVEST", "HOLD", "NOT INVEST"], Field(description="Final investment recommendation based on comprehensive analysis")]
    confidence: int = Field(description="Confidence level in decision (0-100)", ge=0, le=100)
    reasoning: str = Field(description="Detailed reasoning for the investment decision")
    key_strengths: str = Field(description="Top 3 strengths of this opportunity")
    key_concerns: str = Field(description="Top 3 concerns or risks")
    suggested_investment: float = Field(description="Suggested investment amount in thousands (if INVEST/HOLD)")
    expected_return: str = Field(description="Expected return timeline and multiplier")


parser = PydanticOutputParser(pydantic_object=InvestorDecisionSchema)


def make_investor_decision(state: AgentState) -> AgentState:
    """
    Makes final investment decision based on all analysis.
    Synthesizes market, competition, risk, competitor intelligence, and financial data.
    """
    if not os.path.exists(INVESTOR_DECISION_PROMPT_PATH):
        raise ValueError(f"Prompt file not found at {INVESTOR_DECISION_PROMPT_PATH}. Please check the path and try again.")
    
    try:
        template = open(INVESTOR_DECISION_PROMPT_PATH).read()
        
        # Create prompt template for investor decision
        prompt_template = PromptTemplate(
            input_variables=[
                "startup_idea",
                "market_analysis",
                "competition_analysis",
                "risk_assessment",
                "competitor_intelligence",
                "financial_viability",
                "advisor_recommendations",
                "advice"
            ],
            template=template,
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )
        
        chain = prompt_template | chat_model | parser
        
        response = chain.invoke({
            "startup_idea": state["startup_idea"],
            "market_analysis": state["market_analysis"],
            "competition_analysis": state["competition_analysis"],
            "risk_assessment": state["risk_assessment"],
            "competitor_intelligence": str(state.get("competitor_intelligence", {})),
            "financial_viability": str(state.get("financial_viability", {})),
            "advisor_recommendations": state["advisor_recommendations"],
            "advice": state["advice"]
        })
        
        return {
            "investor_decision": response.decision,
            "investor_confidence": response.confidence,
            "investor_reasoning": response.reasoning,
            "investor_strengths": response.key_strengths,
            "investor_concerns": response.key_concerns,
            "suggested_investment": response.suggested_investment,
            "expected_return": response.expected_return
        }
        
    except Exception as e:
        # Fallback: make conservative decision
        return {
            "investor_decision": "HOLD",
            "investor_confidence": 50,
            "investor_reasoning": f"Unable to complete full analysis: {str(e)}",
            "investor_strengths": "Insufficient data",
            "investor_concerns": "Analysis incomplete",
            "suggested_investment": 0,
            "expected_return": "Unknown"
        }
