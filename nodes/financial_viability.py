from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.schema import HumanMessage
from pydantic import BaseModel, Field
from typing import Literal, List
from state.agent_state import AgentState
from models.chat_model import llm_with_tools, chat_model
import os
from config import FINANCIAL_VIABILITY_PROMPT_PATH


class FinancialViabilitySchema(BaseModel):
    """Schema for financial viability analysis"""
    revenue_projections: List[float] = Field(description="Revenue projections for Year 1, 2, 3 in thousands")
    burn_rate: float = Field(description="Monthly burn rate in thousands")
    funding_needed: float = Field(description="Total funding needed in thousands")
    breakeven_month: int = Field(description="Expected breakeven month (1-60)")
    gross_margin: float = Field(description="Gross margin percentage (0-100)")
    cash_runway: int = Field(description="Cash runway in months")
    viability_score: float = Field(description="Financial viability score (0-100)")
    cost_structure: str = Field(description="Analysis of fixed vs variable costs")
    revenue_model: str = Field(description="Revenue generation model description")


parser = PydanticOutputParser(pydantic_object=FinancialViabilitySchema)


def analyze_financial_viability(preferred_mode: Literal["chat_model", "tools"] = "chat_model"):
    def viability_analysis(state: AgentState) -> AgentState:
        """
        Extracts and analyzes financial projections from startup idea.
        """
        if not os.path.exists(FINANCIAL_VIABILITY_PROMPT_PATH):
            raise FileNotFoundError(f"Prompt file not found at {FINANCIAL_VIABILITY_PROMPT_PATH}. Please check the path and try again.")
        
        try:
            template = open(FINANCIAL_VIABILITY_PROMPT_PATH).read()
        except FileNotFoundError:
            raise ValueError(f"Prompt file not found at {FINANCIAL_VIABILITY_PROMPT_PATH}. Please check the path and try again.")
        
        # Create prompt template for financial viability
        prompt_template = PromptTemplate(
            input_variables=["startup_idea", "market_analysis", "competition_analysis", "risk_assessment"],
            template=template,
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )
        
        if preferred_mode == "chat_model":
            chain = prompt_template | chat_model | parser
        else:
            chain = prompt_template | llm_with_tools | parser
        
        try:
            response = chain.invoke({
                "startup_idea": state["startup_idea"],
                "market_analysis": state["market_analysis"],
                "competition_analysis": state["competition_analysis"],
                "risk_assessment": state["risk_assessment"]
            })
            
            # Convert Pydantic model to dict for state
            return {
                "financial_viability": response.dict(),
                "messages": [response.dict()]
            }
        except Exception as e:
            # Fallback: return default structure if parsing fails
            return {
                "financial_viability": {
                    "revenue_projections": [0, 0, 0],
                    "burn_rate": 0,
                    "funding_needed": 0,
                    "breakeven_month": 24,
                    "gross_margin": 50,
                    "cash_runway": 12,
                    "viability_score": 50,
                    "cost_structure": "Unable to analyze cost structure",
                    "revenue_model": "Unable to analyze revenue model"
                },
                "messages": [f"Error analyzing financials: {str(e)}"]
            }
    
    return viability_analysis
