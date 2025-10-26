# config.py

import os

# ========== EXISTING CONFIGURATION ==========

# URL
BASE_URL = "http://localhost:8000/"

# AI Model Configuration
REPO_ID = "openai/gpt-oss-120b"
TEMPERATURE = 0.7
MAX_NEW_TOKENS = 512

# Prompts paths - EXISTING
ADVISOR_PROMPT_PATH = os.path.join("prompts", "advisor.txt")
MARKET_ANALYST_PROMPT_PATH = os.path.join("prompts", "market_analyst.txt")
COMPETITOR_ANALYSIS_PROMPT_PATH = os.path.join("prompts", "competitor_analyst_prompt.txt")
RISK_ASSESSOR_PROMPT_PATH = os.path.join("prompts", "risk_assessor.txt")

# ========== NEW: INVESTOR DECISION PROMPTS ==========
COMPETITOR_INTELLIGENCE_PROMPT_PATH = os.path.join("prompts", "competitor_intelligence.txt")
FINANCIAL_VIABILITY_PROMPT_PATH = os.path.join("prompts", "financial_viability.txt")
INVESTOR_DECISION_PROMPT_PATH = os.path.join("prompts", "investor_decision.txt")

# Graph
REPORTS_PATH = "reports"
GRAPH_VISUALIZATION_PATH = os.path.join(REPORTS_PATH, "validX_graph.png")

# Updated Analysis List
ANALYSIS_LIST = [
    "market_analysis",
    "competition_analysis",
    "risk_assessment",
    "competitor_intelligence",  # NEW
    "financial_viability"       # NEW
]

# ========== DATABASE CONFIGURATION ==========

class Config:
    """Database and Authentication Configuration for Valid-X"""
    
    # Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # MySQL Database Configuration
    MYSQL_HOST = 'localhost'
    MYSQL_PORT = 3306
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = 'password'
    MYSQL_DATABASE = 'validex_db'
    
    # Session Configuration
    SESSION_TYPE = 'filesystem'
    PERMANENT_SESSION_LIFETIME = 3600
