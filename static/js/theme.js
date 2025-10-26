// Enhanced Theme Management - Modern Minimalist
(function () {
  "use strict";

  const THEME_KEY = "Valid-X-theme";
  const TRANSITION_DURATION = 400; // milliseconds

  // Get saved theme or detect system preference
  function getInitialTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "dark"; // Default to dark (Modern Minimalist)
  }

  // Set theme with smooth transition
  function setTheme(theme, animate = true) {
    const html = document.documentElement;
    const body = document.body;

    if (animate) {
      // Add smooth transition class
      html.style.transition =
        "background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      body.style.transition =
        "background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1)";

      // Add fade animation
      body.style.opacity = "0.95";

      setTimeout(() => {
        html.setAttribute("data-theme", theme);
        localStorage.setItem(THEME_KEY, theme);

        // Dispatch custom event for other components
        window.dispatchEvent(
          new CustomEvent("themeChanged", { detail: { theme } })
        );

        // Restore opacity
        body.style.opacity = "1";
      }, 50);

      // Remove transition after animation
      setTimeout(() => {
        html.style.transition = "";
        body.style.transition = "";
      }, TRANSITION_DURATION);
    } else {
      // Instant theme change (for initial load)
      html.setAttribute("data-theme", theme);
      localStorage.setItem(THEME_KEY, theme);
    }
  }

  // Initialize theme on page load (instant, no animation)
  const initialTheme = getInitialTheme();
  setTheme(initialTheme, false);

  // Handle theme toggle button clicks
  document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");

    if (themeToggle) {
      // Add smooth hover effect
      themeToggle.addEventListener("mouseenter", function () {
        this.style.transform = "scale(1.1)";
      });

      themeToggle.addEventListener("mouseleave", function () {
        this.style.transform = "scale(1)";
      });

      // Handle click with enhanced animation
      themeToggle.addEventListener("click", function (e) {
        e.preventDefault();

        const currentTheme =
          document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";

        // Add rotation and scale animation
        this.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        this.style.transform = "rotate(360deg) scale(1.2)";

        // Haptic feedback (if supported)
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }

        setTimeout(() => {
          setTheme(newTheme, true);
          this.style.transform = "scale(1)";
        }, 300);

        // Reset animation
        setTimeout(() => {
          this.style.transition = "";
        }, 600);
      });

      // Add keyboard shortcut (Ctrl/Cmd + K)
      document.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
          e.preventDefault();
          themeToggle.click();
        }
      });
    }

    // Animate theme toggle button on load
    if (themeToggle) {
      themeToggle.style.opacity = "0";
      themeToggle.style.transform = "scale(0.8)";

      setTimeout(() => {
        themeToggle.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        themeToggle.style.opacity = "1";
        themeToggle.style.transform = "scale(1)";
      }, 500);
    }
  });

  // Listen for system theme changes
  if (window.matchMedia) {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    darkModeQuery.addEventListener("change", (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? "dark" : "light", true);

        // Show notification
        showThemeNotification(e.matches ? "dark" : "light");
      }
    });
  }

  // Show theme change notification (optional)
  function showThemeNotification(theme) {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 30px;
      padding: 12px 20px;
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 2px solid var(--accent-color);
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      z-index: 9999;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    `;

    const icon = theme === "dark" ? "🌙" : "☀️";
    const text = theme === "dark" ? "Dark Mode" : "Light Mode";
    notification.textContent = `${icon} ${text} Activated`;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.opacity = "1";
      notification.style.transform = "translateY(0)";
    }, 10);

    // Animate out and remove
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(20px)";

      setTimeout(() => {
        notification.remove();
      }, 400);
    }, 2000);
  }

  // Add smooth page transition on theme change
  window.addEventListener("themeChanged", function (e) {
    // Smooth transition for all elements
    const elements = document.querySelectorAll("*");
    elements.forEach((el) => {
      if (el.style.transition === "") {
        el.style.transition =
          "background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease";

        setTimeout(() => {
          el.style.transition = "";
        }, TRANSITION_DURATION);
      }
    });
  });

  // Expose theme functions globally
  window.VettIQTheme = {
    get: () => document.documentElement.getAttribute("data-theme"),
    set: (theme) => setTheme(theme, true),
    toggle: () => {
      const current = document.documentElement.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark", true);
    },
  };

  // Add CSS for smooth transitions
  const style = document.createElement("style");
  style.textContent = `
    /* Smooth theme transition */
    html[data-theme] {
      transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
                  color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Reduce motion for accessibility */
    @media (prefers-reduced-motion: reduce) {
      html[data-theme],
      body,
      * {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
      }
    }
  `;
  document.head.appendChild(style);

  // Log theme initialization (development only)
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    console.log(
      `%c🎨 Valid-X Theme Initialized: ${initialTheme.toUpperCase()} MODE`,
      "color: #06B6D4; font-size: 14px; font-weight: bold;"
    );
    console.log(
      "%c💡 Tip: Press Ctrl+K (or Cmd+K) to toggle theme",
      "color: #10B981; font-size: 12px;"
    );
  }
})();
