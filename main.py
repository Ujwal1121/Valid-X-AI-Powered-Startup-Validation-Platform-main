# main.py - FastAPI Backend with Extended Investor Analysis

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Annotated
from graphs.workflow import build_graph
import traceback
import logging
import asyncio

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# Build graph at startup
logger.info("🔨 Building workflow graph...")
try:
    graph = build_graph()
    logger.info("✅ Graph built successfully")
except Exception as e:
    logger.error(f"❌ Error building graph: {e}")
    logger.error(traceback.format_exc())
    raise

# Pydantic model for request body
class StartupIdea(BaseModel):
    startup_idea: Annotated[str, Field(..., description="Startup idea to validate")]

@app.get("/")
def read_root():
    return {"message": "Welcome to the Valid-X API"}

@app.post("/validate")
async def research(idea: StartupIdea):
    logger.info(f"🔍 Validation request received: {idea.startup_idea[:100]}...")
    
    try:
        logger.info("⚙️ Invoking graph...")
        
        # Add timeout protection (5 minutes)
        result = await asyncio.wait_for(
            graph.ainvoke(
                {
                    "startup_idea": idea.startup_idea,
                    "market_analysis": None,
                    "competition_analysis": None,
                    "risk_assessment": None,
                    "advisor_recommendations": None,
                    "advice": None,
                    # ========== NEW FIELDS ==========
                    "competitor_intelligence": None,
                    "financial_viability": None,
                    "investor_decision": None,
                    "investor_confidence": None,
                    "investor_reasoning": None,
                    "investor_strengths": None,
                    "investor_concerns": None,
                    "suggested_investment": None,
                    "expected_return": None,
                    "messages": []
                }
            ),
            timeout=300
        )
        
        logger.info("✅ Graph execution completed")
        
        return JSONResponse(
            status_code=200, 
            content={
                # Existing fields
                "startup_idea": result["startup_idea"],
                "market_analysis": result["market_analysis"],
                "competition_analysis": result["competition_analysis"],
                "risk_assessment": result["risk_assessment"],
                "advisor_recommendations": result["advisor_recommendations"],
                "advice": result["advice"],
                
                # ========== NEW: INVESTOR DECISION DATA ==========
                "competitor_intelligence": result.get("competitor_intelligence", {}),
                "financial_viability": result.get("financial_viability", {}),
                "investor_decision": result.get("investor_decision", "HOLD"),
                "investor_confidence": result.get("investor_confidence", 50),
                "investor_reasoning": result.get("investor_reasoning", ""),
                "investor_strengths": result.get("investor_strengths", ""),
                "investor_concerns": result.get("investor_concerns", ""),
                "suggested_investment": result.get("suggested_investment", 0),
                "expected_return": result.get("expected_return", "")
            }
        )
        
    except asyncio.TimeoutError:
        logger.error("❌ TIMEOUT: Graph execution exceeded 5 minutes")
        raise HTTPException(
            status_code=504,
            detail="Analysis timeout: Request took too long (>5 minutes). Try a shorter idea."
        )
        
    except Exception as e:
        logger.error(f"❌ ERROR IN VALIDATION: {str(e)}")
        logger.error(f"❌ ERROR TYPE: {type(e).__name__}")
        logger.error(f"❌ FULL TRACEBACK:\n{traceback.format_exc()}")
        
        raise HTTPException(
            status_code=400,
            detail={
                "error": str(e),
                "error_type": type(e).__name__,
                "traceback": traceback.format_exc()
            }
        )
