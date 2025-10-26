# 🚀 Valid-X - AI-Powered Startup Validation Platform

**Valid-X** is an intelligent startup validation platform that uses AI-powered multi-agent analysis to evaluate startup ideas and provide investor-grade recommendations. Built with LangChain, LangGraph, and FastAPI, it analyzes market opportunities, competitive landscapes, risks, and financial viability.

---

## ✨ **Features**

### **🎯 Core Functionality**

- **7 AI Agent Analysis System** - Market, Competition, Risk, Intelligence, Financial, Strategic, Investor agents
- **Startup Eligibility Validation** - Automatically filters established businesses from startups
- **Investor-Grade Reports** - Comprehensive analysis with INVEST/HOLD/NOT INVEST decisions
- **Interactive Visualizations** - 7+ charts including market analysis, competition, risk radar, and financial projections
- **PDF Export** - Download complete validation reports
- **Dark/Light Theme** - Modern, minimalist UI with theme toggle

### **🤖 AI-Powered Analysis**

- Market opportunity assessment (TAM/SAM/SOM)
- Competitive landscape analysis
- Risk assessment across 5 categories
- Competitor intelligence with structured data
- Financial viability scoring
- Strategic recommendations
- Investment decision with confidence scoring

### **🎨 Modern UI/UX**

- Real-time analysis progress tracker
- Animated charts with Chart.js
- Responsive design for all devices
- Smooth animations and transitions
- Accordion-style detailed reports

---

## 📁 **Project Structure**

valid-x/
├── main.py # FastAPI backend entry point
├── app.py # Flask frontend server
├── requirements.txt # Python dependencies
├── README.md # This file
│
├── config.py # Configuration (API keys, model settings)
├── .env # Environment variables (API keys)
│
├── models/
│ └── chat_model.py # LLM initialization (HuggingFace)
│
├── nodes/ # AI Agent implementations
│ ├── market_analyst.py # Agent 1: Market analysis
│ ├── competitor_analysis.py # Agent 2: Competition analysis
│ ├── risk_assessor.py # Agent 3: Risk assessment
│ ├── competitor_intelligence.py # Agent 4: Structured competitor data
│ ├── financial_viability.py # Agent 5: Financial metrics
│ ├── advisor.py # Agent 6: Strategic recommendations
│ ├── investor_decision.py # Agent 7: Investment decision
│ └── startup_validator.py # Pre-validation filter
│
├── graphs/
│ └── workflow.py # LangGraph workflow orchestration
│
├── state/
│ └── agent_state.py # Shared state management
│
├── tools/
│ └── web_search_tool.py # DuckDuckGo web search integration
│
├── prompts/ # LLM prompt templates
│ ├── market_analyst.txt
│ ├── competitor_analyst_prompt.txt
│ ├── risk_assessor.txt
│ ├── competitor_intelligence.txt
│ ├── financial_viability.txt
│ ├── advisor.txt
│ └── investor_decision.txt
│
├── templates/ # HTML templates (Flask)
│ ├── analysis.html
│ ├── index.html
│ ├── login.html
│ └── signup.html
│
└── static/ # Frontend assets
├── css/
│ ├── styles.css
│ └── theme.css
├── js/
│ ├── analysis.js
│ └── theme.js
└── images/

text

---

## 🚀 **Installation**

### **Prerequisites**

- Python 3.10+
- MySQL Server (for user authentication)
- HuggingFace API Key
- Git

### **Step 1: Clone Repository**

git clone https://github.com/your-username/valid-x.git
cd valid-x

text

### **Step 2: Create Virtual Environment**

python -m venv venv

Windows
venv\Scripts\activate

macOS/Linux
source venv/bin/activate

text

### **Step 3: Install Dependencies**

pip install -r requirements.txt

text

### **Step 4: Configure Environment Variables**

Create a `.env` file in the root directory:

HuggingFace API
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

MySQL Database
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=validx_db

Flask Secret Key
FLASK_SECRET_KEY=your-secret-key-here

Server Ports
FLASK_PORT=5000
FASTAPI_PORT=8000

text

### **Step 5: Setup Database**

Create MySQL database and tables:

CREATE DATABASE validx_db;
USE validx_db;

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

text

### **Step 6: Get HuggingFace API Key**

1. Go to [HuggingFace](https://huggingface.co/)
2. Create account (free)
3. Go to Settings → Access Tokens
4. Create new token with "Read" permissions
5. Copy token to `.env` file

---

## ▶️ **Running the Application**

### **Option 1: Run Both Servers Separately (Recommended)**

**Terminal 1 - FastAPI Backend:**
uvicorn main:app --reload --port 8000

text

**Terminal 2 - Flask Frontend:**
python app.py

text

### **Option 2: Production Mode**

FastAPI (production)
uvicorn main:app --host 0.0.0.0 --port 8000

Flask (production)
gunicorn -w 4 -b 0.0.0.0:5000 app:app

text

### **Access Application**

- **Frontend:** http://localhost:5000
- **Analysis Page:** http://localhost:5000/analysis
- **FastAPI Docs:** http://localhost:8000/docs

---

## 📖 **Usage**

### **1. Create Account**

- Navigate to http://localhost:5000
- Click "Sign Up"
- Enter username, email, password

### **2. Validate Startup Idea**

- Login to your account
- Go to Analysis page
- Enter startup description (50+ characters)
- Click "Analyze Idea"

### **3. Review Results**

- View 7-agent analysis
- Check interactive charts
- Read investor decision
- Download PDF report

### **Example Input:**

AI-powered customer support platform for e-commerce businesses.
Founded 18 months ago, raised $2M seed round from Y Combinator.
Team of 8 people. Currently serving 50 SMB clients with $300K ARR.
Targeting $2M revenue by Year 3. Competitors include Zendesk and
Intercom, but we focus specifically on Shopify merchants with
AI-driven ticket routing. Monthly burn rate is $80K. Looking to
raise $5M Series A.

text

---

## 🧪 **Testing**

### **Test Startup Validation Filter**

**Should PASS (Valid Startups):**
Early-stage SaaS
curl -X POST http://localhost:8000/validate
-H "Content-Type: application/json"
-d '{"startup_idea": "AI-powered customer support platform. Founded 18 months ago, raised $2M seed."}'

text

**Should REJECT (Not Startups):**
Established business
curl -X POST http://localhost:8000/validate
-H "Content-Type: application/json"
-d '{"startup_idea": "Regional restaurant chain. 15 years old. $60M revenue. 1,200 employees."}'

text

### **Run Tests**

pytest tests/

text

---

## 🎨 **Customization**

### **Change LLM Model**

Edit `config.py`:
REPO_ID = "mistralai/Mixtral-8x7B-Instruct-v0.1" # Change model
TEMPERATURE = 0.7
MAX_NEW_TOKENS = 1024

text

### **Modify Agent Prompts**

Edit prompt files in `prompts/` directory:

- `market_analyst.txt`
- `competitor_analyst_prompt.txt`
- `risk_assessor.txt`
- etc.

### **Adjust UI Theme**

Edit `static/css/theme.css`:
:root {
--accent: #06B6D4; /_ Change accent color _/
--success: #10B981;
--danger: #EF4444;
}

text

---

## 🔧 **Troubleshooting**

### **Error: "Failed to load resource: 400 Bad Request"**

**Solution:** Hard refresh browser with `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### **Error: "Cannot connect to MySQL"**

**Solution:** Check MySQL is running and credentials in `.env` are correct:
Windows
net start MySQL80

macOS
brew services start mysql

Linux
sudo systemctl start mysql

text

### **Error: "HuggingFace API rate limit exceeded"**

**Solution:** Wait 1 hour or upgrade to Pro account ($9/month for unlimited usage)

### **Analysis Takes Too Long (>5 minutes)**

**Solution:** Use a shorter startup description (under 500 characters) or upgrade HuggingFace plan

---

## 📊 **Tech Stack**

### **Backend**

- **FastAPI** - High-performance async API framework
- **LangChain** - LLM orchestration framework
- **LangGraph** - Multi-agent workflow management
- **Pydantic** - Data validation
- **MySQL** - User authentication database

### **Frontend**

- **Flask** - Web framework
- **Chart.js** - Interactive data visualization
- **jsPDF** - PDF report generation
- **Vanilla JavaScript** - No heavy frameworks

### **AI/ML**

- **HuggingFace Inference API** - LLM hosting (gpt-oss-120b)
- **DuckDuckGo Search** - Real-time market data
- **Pydantic Output Parser** - Structured data extraction

---

## 🚦 **Startup Eligibility Criteria**

Valid-X validates **startups** (Pre-seed to Series D) and rejects **established businesses**.

### **Startup Indicators (PASS):**

- ✅ 0-10 years old
- ✅ $0-$50M annual revenue
- ✅ 1-500 employees
- ✅ Seed to Series D funding
- ✅ High growth (>20% YoY)

### **Established Business Indicators (REJECT):**

- ❌ >10 years old
- ❌ >$50M revenue
- ❌ >500 employees
- ❌ Publicly traded (IPO)
- ❌ Market leader/dominant

---

## 📈 **Performance**

- **Analysis Time:** 60-180 seconds (7 agents + web search)
- **Validation Time:** 3-10 seconds (pre-filter)
- **Concurrent Users:** Supports 10+ simultaneous analyses
- **Database:** MySQL with connection pooling

---

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 🙏 **Acknowledgments**

- **LangChain** - For excellent LLM orchestration framework
- **HuggingFace** - For open-source LLM hosting
- **Chart.js** - For beautiful data visualization
- **FastAPI** - For modern async API framework

---

## 🔮 **Roadmap**

### **v1.1 (Coming Soon)**

- [ ] Support for multiple LLM providers (OpenAI, Anthropic, Cohere)
- [ ] Real-time collaboration features
- [ ] Export to PowerPoint/Google Slides
- [ ] Email report delivery

### **v1.2**

- [ ] Comparative analysis (multiple startups)
- [ ] Historical analysis tracking
- [ ] API endpoints for third-party integrations
- [ ] Mobile app (iOS/Android)

### **v2.0**

- [ ] AI-powered pitch deck generator
- [ ] Investor matching algorithm
- [ ] Market trend predictions
- [ ] Integration with CRM systems (HubSpot, Salesforce)

---

**Built with ❤️ by the Valid-X Team**
# Valid-X-AI-Powered-Startup-Validation-Platform-main
