from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.schema import HumanMessage
from pydantic import BaseModel, Field
from typing import Literal, List
from state.agent_state import AgentState
from models.chat_model import llm_with_tools, chat_model
import os
from config import COMPETITOR_INTELLIGENCE_PROMPT_PATH


class CompetitorData(BaseModel):
    """Schema for individual competitor data"""
    name: str = Field(description="Competitor name")
    market_share: float = Field(description="Market share percentage (0-100)")
    funding: float = Field(description="Funding raised in millions")
    growth_rate: float = Field(description="Annual growth rate percentage")
    brand_visibility: float = Field(description="Brand visibility score (0-100)")


class CompetitorIntelligenceSchema(BaseModel):
    """Schema for competitor intelligence analysis"""
    competitors: List[CompetitorData] = Field(description="List of competitors with their metrics")
    competitive_position: str = Field(description="Startup's position: Strong/Moderate/Weak")
    market_concentration: str = Field(description="Market type: Fragmented/Moderate/Concentrated")
    competitive_advantage: str = Field(description="Key differentiators vs competitors")


parser = PydanticOutputParser(pydantic_object=CompetitorIntelligenceSchema)


def analyze_competitor_intelligence(preferred_mode: Literal["chat_model", "tools"] = "chat_model"):
    def intelligence_analysis(state: AgentState) -> AgentState:
        """
        Analyzes competitive landscape and extracts competitor metrics from startup idea.
        """
        if not os.path.exists(COMPETITOR_INTELLIGENCE_PROMPT_PATH):
            raise FileNotFoundError(f"Prompt file not found at {COMPETITOR_INTELLIGENCE_PROMPT_PATH}. Please check the path and try again.")
        
        try:
            template = open(COMPETITOR_INTELLIGENCE_PROMPT_PATH).read()
        except FileNotFoundError:
            raise ValueError(f"Prompt file not found at {COMPETITOR_INTELLIGENCE_PROMPT_PATH}. Please check the path and try again.")
        
        # Create prompt template for competitor intelligence
        prompt_template = PromptTemplate(
            input_variables=["startup_idea", "market_analysis", "competition_analysis"],
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
                "competition_analysis": state["competition_analysis"]
            })
            
            # Convert Pydantic model to dict for state
            return {
                "competitor_intelligence": response.dict(),
                "messages": [response.dict()]
            }
        except Exception as e:
            # Fallback: return empty structure if parsing fails
            return {
                "competitor_intelligence": {
                    "competitors": [],
                    "competitive_position": "Unknown",
                    "market_concentration": "Unknown",
                    "competitive_advantage": "Unable to analyze competitive landscape"
                },
                "messages": [f"Error analyzing competitors: {str(e)}"]
            }
    
    return intelligence_analysis
