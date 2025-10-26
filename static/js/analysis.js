// Enhanced Analysis.js - Modern Minimalist Theme with Investor Decision Features
document.addEventListener("DOMContentLoaded", function () {
  const validateBtn = document.getElementById("validateBtn");
  const startupIdeaInput = document.getElementById("startupIdea");
  const inputSection = document.getElementById("inputSection");
  const loadingSection = document.getElementById("loadingSection");
  const resultsSection = document.getElementById("resultsSection");
  const errorSection = document.getElementById("errorSection");
  const newAnalysisBtn = document.getElementById("newAnalysisBtn");
  const retryBtn = document.getElementById("retryBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const charCount = document.getElementById("charCount");

  // Chart instances
  let marketChart = null;
  let competitionChart = null;
  let riskChart = null;
  let scoreChart = null;

  // NEW: Investor decision chart instances
  let competitorRadarChart = null;
  let revenueLineChart = null;
  let costRevenueBarChart = null;

  // Modern Minimalist Color Palette
  const colors = {
    accent: "#06B6D4",
    accentHover: "#0891B2",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
    textPrimary: getComputedStyle(document.documentElement).getPropertyValue(
      "--text-primary"
    ),
    textSecondary: getComputedStyle(document.documentElement).getPropertyValue(
      "--text-secondary"
    ),
  };

  // Character counter with smooth animations
  if (startupIdeaInput && charCount) {
    startupIdeaInput.addEventListener("input", function () {
      const count = this.value.length;
      charCount.textContent = count;
      charCount.style.transition = "color 0.3s ease";

      if (count > 1500) {
        charCount.style.color = colors.danger;
        this.value = this.value.substring(0, 1500);
      } else if (count > 1400) {
        charCount.style.color = colors.warning;
      } else {
        charCount.style.color = "";
      }
    });

    startupIdeaInput.addEventListener("focus", function () {
      this.style.transform = "scale(1.01)";
      this.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    });

    startupIdeaInput.addEventListener("blur", function () {
      this.style.transform = "scale(1)";
    });
  }

  // Validate button click with ripple effect
  if (validateBtn) {
    validateBtn.addEventListener("click", async function (e) {
      const idea = startupIdeaInput.value.trim();

      if (!idea) {
        showCustomAlert("Please enter your startup idea", "warning");
        startupIdeaInput.focus();
        return;
      }

      if (idea.length < 50) {
        showCustomAlert(
          "Please provide more details (at least 50 characters)",
          "warning"
        );
        startupIdeaInput.focus();
        return;
      }

      createRipple(e, this);
      await validateIdea(idea);
    });
  }

  // Custom alert with smooth animations
  function showCustomAlert(message, type = "info") {
    const alertDiv = document.createElement("div");
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 20px 30px;
      background: ${type === "warning" ? colors.warning : colors.accent};
      color: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 10000;
      animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 600;
    `;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
      alertDiv.style.animation =
        "slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      setTimeout(() => alertDiv.remove(), 400);
    }, 3000);
  }

  // Ripple effect for buttons
  function createRipple(event, element) {
    const ripple = document.createElement("span");
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;

    element.style.position = "relative";
    element.style.overflow = "hidden";
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  // Format text into paragraphs function
  function formatTextIntoParagraphs(text) {
    const cleaned = text
      .replace(/[^\x00-\x7F]/g, " ")
      .replace(/#{1,6}\s*/g, "")
      .replace(/\*\*|__/g, "")
      .replace(/\*|_/g, "")
      .replace(/\|/g, " ")
      .replace(/[-]{2,}/g, " ")
      .replace(/[+]/g, " ")
      .replace(/\[|\]/g, "")
      .replace(/\{|\}/g, "")
      .replace(/[-_]{3,}/g, " ")
      .replace(/^\s*[-*+]\s*/gm, "")
      .replace(/::/g, ":")
      .replace(/;;/g, ";")
      .replace(/\s+/g, " ")
      .trim();

    const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
    const paragraphs = [];
    let currentParagraph = [];

    sentences.forEach((sentence, index) => {
      currentParagraph.push(sentence.trim());

      if (currentParagraph.length >= 3 || index === sentences.length - 1) {
        if (currentParagraph.length > 0) {
          paragraphs.push(currentParagraph.join(" "));
        }
        currentParagraph = [];
      }
    });

    return paragraphs.map((p) => `<p>${p}</p>`).join("");
  }

  // Validate startup idea with 5-MINUTE TIMEOUT
  async function validateIdea(idea) {
    inputSection.classList.add("hidden");
    loadingSection.classList.remove("hidden");
    resultsSection.classList.add("hidden");
    errorSection.classList.add("hidden");

    const steps = ["step1", "step2", "step3", "step4"];
    let currentStep = 0;

    const stepInterval = setInterval(() => {
      if (currentStep > 0) {
        const prevStep = document.getElementById(steps[currentStep - 1]);
        prevStep.classList.remove("active");
        prevStep.style.transform = "translateX(-10px)";
      }
      if (currentStep < steps.length) {
        const currentStepEl = document.getElementById(steps[currentStep]);
        currentStepEl.classList.add("active");
        currentStepEl.style.transform = "translateX(0) scale(1.02)";
        currentStep++;
      }
    }, 5000);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

      console.log("🚀 Sending validation request...");
      const startTime = Date.now();

      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startup_idea: idea }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      clearInterval(stepInterval);

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`✅ Response received in ${elapsed} seconds`);

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Analysis complete!");
        displayResults(data);
      } else {
        console.error("❌ Server returned error:", data.error);
        displayError(data.error || "An error occurred during validation");
      }
    } catch (error) {
      clearInterval(stepInterval);

      const elapsed = Date.now() - (window.startTime || Date.now());
      const elapsedSec = (elapsed / 1000).toFixed(2);

      console.error("❌ Request failed:", error);

      if (error.name === "AbortError") {
        displayError(
          `Request timeout after ${elapsedSec} seconds.\n\n` +
            `The AI analysis is taking too long. Try:\n` +
            `1. Use a shorter startup idea\n` +
            `2. Check your internet connection\n` +
            `3. Wait a few minutes and try again`
        );
      } else if (error.message.includes("Failed to fetch")) {
        displayError(
          "Cannot connect to server.\n\n" +
            "Make sure Flask is running on http://localhost:5000"
        );
      } else {
        displayError(
          `Network error: ${error.message}\n\n` +
            `Please check your internet connection.`
        );
      }
    }
  }

  // Display results with enhanced animations
  function displayResults(data) {
    loadingSection.classList.add("hidden");
    resultsSection.classList.remove("hidden");

    const decisionBanner = document.getElementById("decisionBanner");
    const recommendation = data.advisor_recommendations || "";

    decisionBanner.textContent = `Decision: ${recommendation}`;
    decisionBanner.classList.remove("go", "no-go", "conditional");

    const recLower = recommendation.toLowerCase();
    if (recLower.includes("go")) {
      if (recLower.includes("conditional")) {
        decisionBanner.classList.add("conditional");
      } else if (recLower.includes("no-go") || recLower.includes("no go")) {
        decisionBanner.classList.add("no-go");
      } else {
        decisionBanner.classList.add("go");
      }
    } else {
      decisionBanner.classList.add("conditional");
    }

    document.getElementById("ideaContent").textContent =
      data.startup_idea || "No idea provided";
    document.getElementById("adviceContent").textContent =
      data.advice || "No advice available";

    // Format accordion content into proper paragraphs
    document.getElementById("fullMarketAnalysis").innerHTML =
      formatTextIntoParagraphs(
        data.market_analysis || "No market analysis available"
      );
    document.getElementById("fullCompetitionAnalysis").innerHTML =
      formatTextIntoParagraphs(
        data.competition_analysis || "No competition analysis available"
      );
    document.getElementById("fullRiskAssessment").innerHTML =
      formatTextIntoParagraphs(
        data.risk_assessment || "No risk assessment available"
      );

    const marketData = analyzeMarketText(data.market_analysis);
    const competitionData = analyzeCompetitionText(data.competition_analysis);
    const riskData = analyzeRiskText(data.risk_assessment);

    createMarketChart(marketData);
    createCompetitionChart(competitionData);
    createRiskChart(riskData);
    createScoreChart(marketData, competitionData, riskData);
    populateInsights(marketData, competitionData, riskData);

    // NEW: Display investor decision data
    displayInvestorDecision(data);

    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });

    const cards = resultsSection.querySelectorAll(".chart-card, .result-card");
    cards.forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(40px) scale(0.95)";

      setTimeout(() => {
        card.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        card.style.opacity = "1";
        card.style.transform = "translateY(0) scale(1)";
      }, index * 150);
    });
  }

  // Analyze market text
  function analyzeMarketText(text) {
    const positive = [
      "opportunity",
      "growth",
      "potential",
      "demand",
      "large",
      "increasing",
      "strong",
    ];
    const neutral = ["moderate", "stable", "average", "existing"];
    const negative = [
      "limited",
      "small",
      "declining",
      "saturated",
      "challenging",
    ];

    let positiveCount = 0,
      neutralCount = 0,
      negativeCount = 0;
    const lowerText = text.toLowerCase();

    positive.forEach((word) => {
      if (lowerText.includes(word)) positiveCount++;
    });
    neutral.forEach((word) => {
      if (lowerText.includes(word)) neutralCount++;
    });
    negative.forEach((word) => {
      if (lowerText.includes(word)) negativeCount++;
    });

    const total = positiveCount + neutralCount + negativeCount || 1;

    return {
      opportunity: Math.round((positiveCount / total) * 100),
      stability: Math.round((neutralCount / total) * 100),
      challenges: Math.round((negativeCount / total) * 100),
      score: Math.round(
        ((positiveCount * 2 + neutralCount - negativeCount) / total) * 50 + 50
      ),
    };
  }

  // Analyze competition text
  function analyzeCompetitionText(text) {
    const competitorsCount = (
      text.match(/competitor|rival|company|player/gi) || []
    ).length;
    const strengthWords = (
      text.match(/strong|dominant|leader|established/gi) || []
    ).length;
    const weaknessWords = (text.match(/weak|gap|opportunity|niche/gi) || [])
      .length;

    return {
      intensity: Math.min(competitorsCount * 15, 100),
      strength: Math.min(strengthWords * 20, 100),
      opportunities: Math.min(weaknessWords * 25, 100),
      score: Math.max(100 - competitorsCount * 10, 20),
    };
  }

  // Analyze risk text
  function analyzeRiskText(text) {
    const categories = {
      market: ["market risk", "demand", "customer", "adoption"],
      technical: ["technical", "technology", "development", "infrastructure"],
      financial: ["financial", "funding", "cost", "revenue", "budget"],
      operational: ["operational", "execution", "team", "resources"],
      regulatory: ["regulatory", "compliance", "legal", "regulation"],
    };

    const lowerText = text.toLowerCase();
    const risks = {};

    Object.keys(categories).forEach((category) => {
      let count = 0;
      categories[category].forEach((word) => {
        if (lowerText.includes(word)) count++;
      });
      risks[category] = Math.min(count * 20, 80);
    });

    const avgRisk =
      Object.values(risks).reduce((a, b) => a + b, 0) /
      Object.keys(risks).length;

    return {
      ...risks,
      overall: Math.round(avgRisk),
      score: Math.round(100 - avgRisk),
    };
  }

  // Create market chart
  function createMarketChart(data) {
    const ctx = document.getElementById("marketChart");
    if (!ctx) return;
    if (marketChart) marketChart.destroy();

    marketChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Market Opportunity", "Market Stability", "Market Challenges"],
        datasets: [
          {
            data: [data.opportunity, data.stability, data.challenges],
            backgroundColor: [
              "rgba(16, 185, 129, 0.85)",
              "rgba(6, 182, 212, 0.85)",
              "rgba(239, 68, 68, 0.85)",
            ],
            borderColor: [
              "rgba(16, 185, 129, 1)",
              "rgba(6, 182, 212, 1)",
              "rgba(239, 68, 68, 1)",
            ],
            borderWidth: 3,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: "easeInOutCubic",
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: colors.textPrimary,
              padding: 18,
              font: { size: 13, weight: "600" },
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context) => context.label + ": " + context.parsed + "%",
            },
          },
        },
      },
    });
  }

  // Create competition chart
  function createCompetitionChart(data) {
    const ctx = document.getElementById("competitionChart");
    if (!ctx) return;
    if (competitionChart) competitionChart.destroy();

    competitionChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Competition Intensity",
          "Competitor Strength",
          "Market Opportunities",
        ],
        datasets: [
          {
            label: "Percentage",
            data: [data.intensity, data.strength, data.opportunities],
            backgroundColor: [
              "rgba(6, 182, 212, 0.85)",
              "rgba(8, 145, 178, 0.85)",
              "rgba(16, 185, 129, 0.85)",
            ],
            borderColor: [
              "rgba(6, 182, 212, 1)",
              "rgba(8, 145, 178, 1)",
              "rgba(16, 185, 129, 1)",
            ],
            borderWidth: 3,
            borderRadius: 8,
            barThickness: 60,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1500, easing: "easeInOutQuart" },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: colors.textSecondary,
              font: { size: 12, weight: "500" },
            },
            grid: { color: "rgba(128, 128, 128, 0.08)", drawBorder: false },
          },
          x: {
            ticks: {
              color: colors.textSecondary,
              font: { size: 12, weight: "500" },
            },
            grid: { display: false },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            padding: 12,
            cornerRadius: 8,
            callbacks: { label: (context) => context.parsed.y + "%" },
          },
        },
      },
    });
  }

  // Create risk chart
  function createRiskChart(data) {
    const ctx = document.getElementById("riskChart");
    if (!ctx) return;
    if (riskChart) riskChart.destroy();

    riskChart = new Chart(ctx, {
      type: "radar",
      data: {
        labels: [
          "Market Risk",
          "Technical Risk",
          "Financial Risk",
          "Operational Risk",
          "Regulatory Risk",
        ],
        datasets: [
          {
            label: "Risk Level",
            data: [
              data.market,
              data.technical,
              data.financial,
              data.operational,
              data.regulatory,
            ],
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 3,
            pointBackgroundColor: "rgba(239, 68, 68, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1500, easing: "easeInOutCubic" },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: colors.textSecondary,
              backdropColor: "transparent",
              font: { size: 11 },
            },
            grid: { color: "rgba(128, 128, 128, 0.15)" },
            pointLabels: {
              color: colors.textPrimary,
              font: { size: 12, weight: "600" },
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context) => "Risk: " + context.parsed.r + "%",
            },
          },
        },
      },
    });
  }

  // Create score chart
  function createScoreChart(marketData, competitionData, riskData) {
    const ctx = document.getElementById("scoreChart");
    if (!ctx) return;
    if (scoreChart) scoreChart.destroy();

    const overallScore = Math.round(
      (marketData.score + competitionData.score + riskData.score) / 3
    );

    scoreChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [overallScore, 100 - overallScore],
            backgroundColor: [
              overallScore >= 70
                ? "rgba(16, 185, 129, 0.9)"
                : overallScore >= 40
                ? "rgba(245, 158, 11, 0.9)"
                : "rgba(239, 68, 68, 0.9)",
              "rgba(128, 128, 128, 0.08)",
            ],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        animation: {
          animateRotate: true,
          duration: 2000,
          easing: "easeInOutQuart",
        },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      },
      plugins: [
        {
          id: "centerText",
          afterDatasetDraw: function (chart) {
            const ctx = chart.ctx;
            ctx.save();
            const centerX =
              chart.chartArea.left +
              (chart.chartArea.right - chart.chartArea.left) / 2;
            const centerY =
              chart.chartArea.top +
              (chart.chartArea.bottom - chart.chartArea.top) / 2;

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "bold 54px sans-serif";
            ctx.fillStyle = colors.textPrimary;
            ctx.fillText(overallScore, centerX, centerY - 10);

            ctx.font = "600 16px sans-serif";
            ctx.fillStyle = colors.textSecondary;
            ctx.fillText("Viability Score", centerX, centerY + 35);
            ctx.restore();
          },
        },
      ],
    });

    animateValue("marketScore", 0, marketData.score, 1500);
    animateValue("competitionScore", 0, competitionData.score, 1500);
    animateValue("riskScore", 0, riskData.score, 1500);
  }

  // Animate number counting
  function animateValue(elementId, start, end, duration, isPercentage = true) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        element.textContent = Math.round(end) + (isPercentage ? "%" : "");
        clearInterval(timer);
      } else {
        element.textContent = Math.round(current) + (isPercentage ? "%" : "");
      }
    }, 16);
  }

  // Populate insights
  function populateInsights(marketData, competitionData, riskData) {
    const marketList = document.getElementById("marketInsightsList");
    marketList.innerHTML = "";
    if (marketData.opportunity > 50)
      addInsight(marketList, "Strong market opportunity identified");
    if (marketData.challenges > 40)
      addInsight(marketList, "Significant market challenges present");
    if (marketData.score >= 70)
      addInsight(marketList, "Favorable market conditions overall");

    const competitionList = document.getElementById("competitionInsightsList");
    competitionList.innerHTML = "";
    if (competitionData.intensity > 60)
      addInsight(competitionList, "High competition intensity detected");
    if (competitionData.opportunities > 50)
      addInsight(competitionList, "Market gaps and opportunities available");
    if (competitionData.score >= 60)
      addInsight(competitionList, "Competitive positioning is favorable");

    const riskList = document.getElementById("riskInsightsList");
    riskList.innerHTML = "";
    if (riskData.market > 50)
      addInsight(riskList, "Market adoption risk requires attention");
    if (riskData.financial > 50)
      addInsight(riskList, "Financial risks need mitigation planning");
    if (riskData.overall < 40)
      addInsight(riskList, "Overall risk level is manageable");
  }

  // Add insight with animation
  function addInsight(list, text) {
    const li = document.createElement("li");
    li.textContent = text;
    li.style.opacity = "0";
    li.style.transform = "translateX(-20px)";
    list.appendChild(li);

    setTimeout(() => {
      li.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      li.style.opacity = "1";
      li.style.transform = "translateX(0)";
    }, 50);
  }

  // ========== NEW: INVESTOR DECISION FUNCTIONS ==========

  // Display investor decision banner and data
  function displayInvestorDecision(data) {
    const investorDecision = data.investor_decision || "HOLD";
    const confidence = data.investor_confidence || 50;
    const reasoning =
      data.investor_reasoning || "Insufficient data for complete analysis";
    const competitorIntel = data.competitor_intelligence || {};
    const financialViability = data.financial_viability || {};

    // Update decision banner
    const banner = document.getElementById("investorDecisionBanner");
    if (banner) {
      banner.textContent = investorDecision;
      banner.className = "investor-decision-banner";

      if (investorDecision === "INVEST") {
        banner.classList.add("invest");
      } else if (investorDecision === "NOT INVEST") {
        banner.classList.add("not-invest");
      } else {
        banner.classList.add("hold");
      }
    }

    // Update confidence display
    const confidenceText = document.getElementById("investorConfidence");
    const confidenceFill = document.getElementById("confidenceFill");

    if (confidenceText) {
      animateValue("investorConfidence", 0, confidence, 1500, false);
    }

    if (confidenceFill) {
      setTimeout(() => {
        confidenceFill.style.width = confidence + "%";
      }, 200);
    }

    // Update reasoning
    const reasoningElement = document.getElementById("investorReasoning");
    if (reasoningElement) {
      reasoningElement.innerHTML = formatTextIntoParagraphs(reasoning);
    }

    // Render charts and data
    renderCompetitorIntelligence(competitorIntel);
    renderFinancialViability(financialViability);
  }

  // Render competitor intelligence data and chart
  function renderCompetitorIntelligence(data) {
    const canvas = document.getElementById("competitorRadarChart");
    const dataElement = document.getElementById("competitorIntelligenceData");

    if (!canvas || !dataElement) return;

    const competitors = data.competitors || [];

    if (competitors.length === 0) {
      dataElement.innerHTML = "<p>No competitor data available</p>";
      return;
    }

    if (competitorRadarChart) competitorRadarChart.destroy();

    const labels = competitors.map((c) => c.name || "Unknown");
    const marketShareData = competitors.map((c) => c.market_share || 0);
    const fundingData = competitors.map((c) => (c.funding || 0) / 10);
    const growthData = competitors.map((c) => c.growth_rate || 0);
    const visibilityData = competitors.map((c) => c.brand_visibility || 0);

    competitorRadarChart = new Chart(canvas, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Market Share %",
            data: marketShareData,
            backgroundColor: "rgba(6, 182, 212, 0.2)",
            borderColor: "rgba(6, 182, 212, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(6, 182, 212, 1)",
            pointBorderColor: "#fff",
            pointRadius: 4,
          },
          {
            label: "Brand Visibility",
            data: visibilityData,
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(16, 185, 129, 1)",
            pointBorderColor: "#fff",
            pointRadius: 4,
          },
          {
            label: "Growth Rate %",
            data: growthData,
            backgroundColor: "rgba(245, 158, 11, 0.2)",
            borderColor: "rgba(245, 158, 11, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(245, 158, 11, 1)",
            pointBorderColor: "#fff",
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1500, easing: "easeInOutCubic" },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: colors.textSecondary,
              backdropColor: "transparent",
              font: { size: 11 },
            },
            grid: { color: "rgba(128, 128, 128, 0.15)" },
            pointLabels: {
              color: colors.textPrimary,
              font: { size: 12, weight: "600" },
            },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: colors.textPrimary,
              padding: 15,
              font: { size: 12, weight: "600" },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            padding: 12,
            cornerRadius: 8,
          },
        },
      },
    });

    let detailsHTML = "<h4>Competitive Landscape Analysis:</h4><ul>";
    competitors.forEach((comp) => {
      detailsHTML += `<li><strong>${comp.name || "Unknown"}:</strong> ${
        comp.market_share || 0
      }% market share, $${comp.funding || 0}M funding, ${
        comp.growth_rate || 0
      }% growth</li>`;
    });
    detailsHTML += "</ul>";

    detailsHTML += `<p><strong>Position:</strong> ${
      data.competitive_position || "Unknown"
    }</p>`;
    detailsHTML += `<p><strong>Market Structure:</strong> ${
      data.market_concentration || "Unknown"
    }</p>`;
    detailsHTML += `<p><strong>Key Advantage:</strong> ${
      data.competitive_advantage || "Not identified"
    }</p>`;

    dataElement.innerHTML = detailsHTML;
  }

  // Render financial viability data and charts
  function renderFinancialViability(data) {
    const lineCanvas = document.getElementById("revenueLineChart");
    const barCanvas = document.getElementById("costRevenueBarChart");
    const dataElement = document.getElementById("financialViabilityData");

    if (!lineCanvas || !barCanvas || !dataElement) return;

    const revProjections = data.revenue_projections || [0, 0, 0];
    const burnRate = data.burn_rate || 0;
    const fundingNeeded = data.funding_needed || 0;
    const breakeven = data.breakeven_month || 24;
    const viabilityScore = data.viability_score || 50;

    if (revenueLineChart) revenueLineChart.destroy();
    if (costRevenueBarChart) costRevenueBarChart.destroy();

    // Revenue projection line chart
    revenueLineChart = new Chart(lineCanvas, {
      type: "line",
      data: {
        labels: ["Year 1", "Year 2", "Year 3"],
        datasets: [
          {
            label: "Revenue Projection ($K)",
            data: revProjections,
            borderColor: "rgba(16, 185, 129, 1)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointBackgroundColor: "rgba(16, 185, 129, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1500, easing: "easeInOutQuart" },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: colors.textSecondary,
              font: { size: 12, weight: "500" },
              callback: (value) => "$" + value + "K",
            },
            grid: { color: "rgba(128, 128, 128, 0.08)" },
          },
          x: {
            ticks: {
              color: colors.textSecondary,
              font: { size: 12, weight: "500" },
            },
            grid: { display: false },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: colors.textPrimary,
              font: { size: 12, weight: "600" },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context) =>
                context.dataset.label + ": $" + context.parsed.y + "K",
            },
          },
        },
      },
    });

    // Cost vs Revenue stacked bar chart
    const years = ["Year 1", "Year 2", "Year 3"];
    const costs = revProjections.map((rev) => rev * 0.6);

    costRevenueBarChart = new Chart(barCanvas, {
      type: "bar",
      data: {
        labels: years,
        datasets: [
          {
            label: "Revenue ($K)",
            data: revProjections,
            backgroundColor: "rgba(16, 185, 129, 0.85)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 2,
            borderRadius: 6,
          },
          {
            label: "Estimated Costs ($K)",
            data: costs,
            backgroundColor: "rgba(239, 68, 68, 0.85)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 2,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1500, easing: "easeInOutQuart" },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: colors.textSecondary,
              font: { size: 12, weight: "500" },
              callback: (value) => "$" + value + "K",
            },
            grid: { color: "rgba(128, 128, 128, 0.08)" },
          },
          x: {
            ticks: {
              color: colors.textSecondary,
              font: { size: 12, weight: "500" },
            },
            grid: { display: false },
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: colors.textPrimary,
              font: { size: 12, weight: "600" },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context) =>
                context.dataset.label + ": $" + context.parsed.y + "K",
            },
          },
        },
      },
    });

    let detailsHTML = "<h4>Financial Metrics:</h4>";
    detailsHTML += `<p><strong>Funding Needed:</strong> $${fundingNeeded}K</p>`;
    detailsHTML += `<p><strong>Monthly Burn Rate:</strong> $${burnRate}K</p>`;
    detailsHTML += `<p><strong>Breakeven Timeline:</strong> ${breakeven} months</p>`;
    detailsHTML += `<p><strong>Gross Margin:</strong> ${
      data.gross_margin || 0
    }%</p>`;
    detailsHTML += `<p><strong>Cash Runway:</strong> ${
      data.cash_runway || 0
    } months</p>`;
    detailsHTML += `<p><strong>Viability Score:</strong> ${viabilityScore}/100</p>`;

    if (data.cost_structure) {
      detailsHTML += `<p><strong>Cost Structure:</strong> ${data.cost_structure}</p>`;
    }

    if (data.revenue_model) {
      detailsHTML += `<p><strong>Revenue Model:</strong> ${data.revenue_model}</p>`;
    }

    dataElement.innerHTML = detailsHTML;
  }

  // Display error
  function displayError(message) {
    loadingSection.classList.add("hidden");
    errorSection.classList.remove("hidden");
    document.getElementById("errorMessage").textContent = message;
    errorSection.scrollIntoView({ behavior: "smooth" });
  }

  // New analysis button
  if (newAnalysisBtn) {
    newAnalysisBtn.addEventListener("click", function () {
      resultsSection.classList.add("hidden");
      inputSection.classList.remove("hidden");
      startupIdeaInput.value = "";
      charCount.textContent = "0";
      startupIdeaInput.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (marketChart) marketChart.destroy();
      if (competitionChart) competitionChart.destroy();
      if (riskChart) riskChart.destroy();
      if (scoreChart) scoreChart.destroy();
      if (competitorRadarChart) competitorRadarChart.destroy();
      if (revenueLineChart) revenueLineChart.destroy();
      if (costRevenueBarChart) costRevenueBarChart.destroy();
    });
  }

  // Retry button
  if (retryBtn) {
    retryBtn.addEventListener("click", function () {
      errorSection.classList.add("hidden");
      inputSection.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // PDF Download (existing code - unchanged)
  if (downloadBtn) {
    downloadBtn.addEventListener("click", async function () {
      try {
        const originalHTML = this.innerHTML;
        this.disabled = true;
        this.innerHTML =
          '<span style="margin-right: 8px;">⏳</span> Generating PDF...';
        this.style.opacity = "0.7";

        if (typeof window.jspdf === "undefined") {
          throw new Error("jsPDF library not loaded. Please refresh the page.");
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF("p", "mm", "a4");

        let yPosition = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - 2 * margin;
        const maxY = pageHeight - 20;

        function cleanText(text) {
          return text
            .replace(/[^\x00-\x7F]/g, " ")
            .replace(/#{1,6}\s*/g, "")
            .replace(/\*\*|__/g, "")
            .replace(/\*|_/g, "")
            .replace(/\|/g, " ")
            .replace(/[-]{2,}/g, " ")
            .replace(/[+]/g, " ")
            .replace(/\[|\]/g, "")
            .replace(/\{|\}/g, "")
            .replace(/[-_]{3,}/g, " ")
            .replace(/^\s*[-*+]\s*/gm, "")
            .replace(/::/g, ":")
            .replace(/;;/g, ";")
            .replace(/\s+/g, " ")
            .trim();
        }

        function checkNewPage(requiredHeight = 20) {
          if (yPosition + requiredHeight > maxY) {
            doc.addPage();
            yPosition = 20;
            return true;
          }
          return false;
        }

        function addSectionHeader(title) {
          checkNewPage(20);
          doc.setFillColor(6, 182, 212);
          doc.rect(margin, yPosition, contentWidth, 10, "F");
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(13);
          doc.setFont("helvetica", "bold");
          doc.text(title, margin + 3, yPosition + 7);
          yPosition += 15;
        }

        function addParagraphs(text, fontSize = 9) {
          doc.setFontSize(fontSize);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);

          const cleaned = cleanText(text);
          const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];

          let currentParagraph = "";
          let sentenceCount = 0;

          sentences.forEach((sentence, index) => {
            const cleanSentence = sentence.trim().replace(/\s+/g, " ");
            currentParagraph += cleanSentence + " ";
            sentenceCount++;

            if (sentenceCount >= 3 || index === sentences.length - 1) {
              const paragraphText = currentParagraph.trim();

              if (paragraphText.length > 0) {
                const paragraphLines = doc.splitTextToSize(
                  paragraphText,
                  contentWidth - 4
                );
                const lineHeight = fontSize * 0.45;

                paragraphLines.forEach((line) => {
                  checkNewPage(lineHeight + 2);
                  doc.text(line, margin + 2, yPosition);
                  yPosition += lineHeight;
                });

                yPosition += 5;
              }

              currentParagraph = "";
              sentenceCount = 0;
            }
          });

          yPosition += 2;
        }

        function addChart(canvasId, chartWidth = 85, chartHeight = 55) {
          const canvas = document.getElementById(canvasId);
          if (!canvas) return false;

          try {
            checkNewPage(chartHeight + 5);
            const imgData = canvas.toDataURL("image/png", 1.0);
            const chartX = (pageWidth - chartWidth) / 2;
            doc.addImage(
              imgData,
              "PNG",
              chartX,
              yPosition,
              chartWidth,
              chartHeight
            );
            yPosition += chartHeight + 10;
            return true;
          } catch (e) {
            console.log("Chart error:", e);
            return false;
          }
        }

        doc.setFillColor(6, 182, 212);
        doc.rect(0, 0, pageWidth, 45, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.text("Valid-X", pageWidth / 2, 22, { align: "center" });

        doc.setFontSize(13);
        doc.setFont("helvetica", "normal");
        doc.text("Startup Validation Report", pageWidth / 2, 35, {
          align: "center",
        });

        yPosition = 60;

        doc.setDrawColor(6, 182, 212);
        doc.setLineWidth(0.5);
        doc.roundedRect(margin, yPosition, contentWidth, 28, 2, 2);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        yPosition += 8;

        const dateStr = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        doc.text("Generated: " + dateStr, margin + 3, yPosition);
        yPosition += 7;

        const recommendation = cleanText(
          document.getElementById("decisionBanner")?.textContent || "N/A"
        );
        doc.setFont("helvetica", "bold");
        doc.text(recommendation, margin + 3, yPosition);
        yPosition += 7;

        doc.setFont("helvetica", "normal");
        doc.text(
          "Analysis: Comprehensive Startup Validation",
          margin + 3,
          yPosition
        );

        doc.addPage();
        yPosition = 20;

        addSectionHeader("1. STARTUP IDEA");

        const idea =
          document.getElementById("ideaContent")?.textContent ||
          "No idea provided";
        addParagraphs(idea, 9);

        yPosition += 3;

        checkNewPage(18);
        doc.setFillColor(6, 182, 212);
        doc.roundedRect(margin, yPosition, contentWidth, 14, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(recommendation, pageWidth / 2, yPosition + 9, {
          align: "center",
        });

        yPosition += 22;

        addSectionHeader("2. STRATEGIC ADVICE");

        const advice =
          document.getElementById("adviceContent")?.textContent ||
          "No advice available";
        addParagraphs(advice, 9);

        doc.addPage();
        yPosition = 20;

        addSectionHeader("3. MARKET ANALYSIS");

        addChart("marketChart", 85, 55);

        checkNewPage(20);

        const marketAnalysis =
          document.getElementById("fullMarketAnalysis")?.textContent ||
          "No market analysis available";
        addParagraphs(marketAnalysis, 8.5);

        doc.addPage();
        yPosition = 20;

        addSectionHeader("4. COMPETITION ANALYSIS");

        addChart("competitionChart", 85, 55);

        checkNewPage(20);

        const competitionAnalysis =
          document.getElementById("fullCompetitionAnalysis")?.textContent ||
          "No competition analysis available";
        addParagraphs(competitionAnalysis, 8.5);

        doc.addPage();
        yPosition = 20;

        addSectionHeader("5. RISK ASSESSMENT");

        addChart("riskChart", 85, 55);

        checkNewPage(20);

        const riskAssessment =
          document.getElementById("fullRiskAssessment")?.textContent ||
          "No risk assessment available";
        addParagraphs(riskAssessment, 8.5);

        doc.addPage();
        yPosition = 20;

        addSectionHeader("6. OVERALL VIABILITY SCORE");

        addChart("scoreChart", 75, 48);

        checkNewPage(45);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("Score Breakdown", margin, yPosition);
        yPosition += 8;

        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPosition, contentWidth, 8, "F");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Category", margin + 3, yPosition + 5.5);
        doc.text("Score", margin + contentWidth - 18, yPosition + 5.5);
        yPosition += 8;

        doc.setFont("helvetica", "normal");
        const scores = [
          {
            label: "Market Analysis",
            value: document.getElementById("marketScore")?.textContent || "N/A",
          },
          {
            label: "Competition Analysis",
            value:
              document.getElementById("competitionScore")?.textContent || "N/A",
          },
          {
            label: "Risk Assessment",
            value: document.getElementById("riskScore")?.textContent || "N/A",
          },
        ];

        scores.forEach((score, index) => {
          if (index % 2 === 0) {
            doc.setFillColor(250, 250, 250);
            doc.rect(margin, yPosition, contentWidth, 7, "F");
          }
          doc.text(score.label, margin + 3, yPosition + 4.8);
          doc.text(score.value, margin + contentWidth - 18, yPosition + 4.8);
          yPosition += 7;
        });

        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);

          const footerY = pageHeight - 12;
          doc.setDrawColor(6, 182, 212);
          doc.setLineWidth(0.2);
          doc.line(margin, footerY, pageWidth - margin, footerY);

          doc.setFontSize(7);
          doc.setTextColor(120, 120, 120);
          doc.setFont("helvetica", "italic");
          doc.text(
            "Generated by Valid-X - AI-Powered Startup Validation",
            pageWidth / 2,
            footerY + 4,
            { align: "center" }
          );
          doc.text(
            "Page " + i + " of " + pageCount,
            pageWidth / 2,
            footerY + 7.5,
            { align: "center" }
          );
        }

        const filename = "Valid-X-Report-" + Date.now() + ".pdf";
        doc.save(filename);

        showCustomAlert("PDF report generated successfully!", "info");

        this.disabled = false;
        this.innerHTML = originalHTML;
        this.style.opacity = "1";
      } catch (error) {
        console.error("PDF error:", error);
        showCustomAlert("Failed to generate PDF: " + error.message, "warning");

        this.disabled = false;
        this.innerHTML =
          '<span style="margin-right: 8px;">📥</span> Download Report';
        this.style.opacity = "1";
      }
    });
  }
});

// Toggle accordion
function toggleAccordion(button) {
  const item = button.parentElement;
  const content = item.querySelector(".accordion-content");

  button.classList.toggle("active");
  content.classList.toggle("active");

  if (content.classList.contains("active")) {
    content.style.maxHeight = content.scrollHeight + "px";
  } else {
    content.style.maxHeight = "0px";
  }
}

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
