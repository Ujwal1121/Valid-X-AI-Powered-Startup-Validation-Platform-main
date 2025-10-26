// Enhanced Authentication - Modern Minimalist Theme with MySQL Backend
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("errorMessage");

  // Modern color palette
  const colors = {
    accent: "#06B6D4",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  };

  // Enhanced password visibility toggle with smooth animation
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
      const showIcon = this.querySelector(".show-icon");
      const hideIcon = this.querySelector(".hide-icon");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        showIcon.classList.add("hidden");
        hideIcon.classList.remove("hidden");

        // Smooth icon transition
        this.style.transform = "scale(1.15) rotate(10deg)";
        setTimeout(() => {
          this.style.transform = "scale(1) rotate(0deg)";
        }, 200);
      } else {
        passwordInput.type = "password";
        showIcon.classList.remove("hidden");
        hideIcon.classList.add("hidden");

        // Smooth icon transition
        this.style.transform = "scale(1.15) rotate(-10deg)";
        setTimeout(() => {
          this.style.transform = "scale(1) rotate(0deg)";
        }, 200);
      }
    });
  }

  // Enhanced password strength checker for signup
  if (signupForm) {
    const signupPassword = signupForm.querySelector("#password");
    const strengthFill = document.getElementById("strengthFill");
    const strengthText = document.getElementById("strengthText");
    const confirmPassword = document.getElementById("confirmPassword");

    if (signupPassword && strengthFill && strengthText) {
      signupPassword.addEventListener("input", function () {
        const password = this.value;
        const strength = calculatePasswordStrength(password);

        // Remove all strength classes
        strengthFill.classList.remove("weak", "medium", "strong");

        if (password.length === 0) {
          strengthFill.style.width = "0%";
          strengthText.textContent = "Password strength";
          strengthText.style.color = "";
        } else if (strength < 40) {
          strengthFill.classList.add("weak");
          strengthText.textContent = "Weak password";
          strengthText.style.color = colors.danger;
        } else if (strength < 70) {
          strengthFill.classList.add("medium");
          strengthText.textContent = "Medium password";
          strengthText.style.color = colors.warning;
        } else {
          strengthFill.classList.add("strong");
          strengthText.textContent = "Strong password";
          strengthText.style.color = colors.success;
        }
      });
    }

    // Enhanced confirm password validation with visual feedback
    if (confirmPassword && signupPassword) {
      confirmPassword.addEventListener("input", function () {
        const matchIcon = this.parentElement.querySelector(".input-icon");

        if (this.value && this.value !== signupPassword.value) {
          this.setCustomValidity("Passwords do not match");
          this.style.borderColor = colors.danger;
          this.style.boxShadow = `0 0 0 4px rgba(239, 68, 68, 0.1)`;
          if (matchIcon) matchIcon.textContent = "❌";
        } else if (this.value && this.value === signupPassword.value) {
          this.setCustomValidity("");
          this.style.borderColor = colors.success;
          this.style.boxShadow = `0 0 0 4px rgba(16, 185, 129, 0.1)`;
          if (matchIcon) matchIcon.textContent = "✅";
        } else {
          this.setCustomValidity("");
          this.style.borderColor = "";
          this.style.boxShadow = "";
          if (matchIcon) matchIcon.textContent = "✅";
        }
      });

      // Also validate when password changes
      signupPassword.addEventListener("input", function () {
        if (confirmPassword.value) {
          confirmPassword.dispatchEvent(new Event("input"));
        }
      });
    }
  }

  // Calculate password strength
  function calculatePasswordStrength(password) {
    let strength = 0;

    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;

    return Math.min(strength, 100);
  }

  // Enhanced error message with auto-dismiss and animation
  function showError(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.classList.remove("hidden", "success-message");
      errorMessage.classList.add("error-message");
      errorMessage.style.animation =
        "slideInDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)";

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        errorMessage.style.animation =
          "slideOutUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
        setTimeout(() => {
          errorMessage.classList.add("hidden");
        }, 400);
      }, 5000);
    }
  }

  // Enhanced success message with confetti-like effect
  function showSuccess(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.classList.remove("hidden", "error-message");
      errorMessage.classList.add("success-message");
      errorMessage.style.animation =
        "slideInDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)";

      // Add subtle pulse animation
      setTimeout(() => {
        errorMessage.style.animation = "pulse 0.5s ease-in-out";
      }, 400);
    }
  }

  // ========== UPDATED: Handle login form submission with MySQL backend ==========
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = this.querySelector("#email").value.trim();
      const password = this.querySelector("#password").value;
      const loginBtn = document.getElementById("loginBtn");
      const btnText = loginBtn.querySelector(".btn-text");
      const btnLoader = loginBtn.querySelector(".btn-loader");

      // Validate email format
      if (!isValidEmail(email)) {
        showError("Please enter a valid email address");
        return;
      }

      // Show loading state with smooth transition
      loginBtn.disabled = true;
      loginBtn.style.transform = "scale(0.98)";
      btnText.classList.add("hidden");
      btnLoader.classList.remove("hidden");

      try {
        // ✅ CHANGED: Use /api/login endpoint
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showSuccess("Login successful! Redirecting...");
          loginBtn.style.transform = "scale(1.05)";

          // Add success animation to button
          loginBtn.style.background = `linear-gradient(135deg, ${colors.success} 0%, #059669 100%)`;

          setTimeout(() => {
            window.location.href = "/analysis";
          }, 1200);
        } else {
          showError(
            data.message || "Invalid email or password. Please try again."
          );
          resetButton(loginBtn, btnText, btnLoader);

          // Shake animation on error
          loginBtn.style.animation = "shake 0.5s ease-in-out";
          setTimeout(() => {
            loginBtn.style.animation = "";
          }, 500);
        }
      } catch (error) {
        console.error("Login error:", error);
        showError("Network error. Please check your connection and try again.");
        resetButton(loginBtn, btnText, btnLoader);
      }
    });
  }

  // ========== UPDATED: Handle signup form submission with MySQL backend ==========
  if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = this.querySelector("#name").value.trim();
      const email = this.querySelector("#email").value.trim();
      const password = this.querySelector("#password").value;
      const confirmPassword = this.querySelector("#confirmPassword").value;
      const terms = this.querySelector("#terms").checked;
      const signupBtn = document.getElementById("signupBtn");
      const btnText = signupBtn.querySelector(".btn-text");
      const btnLoader = signupBtn.querySelector(".btn-loader");

      // Enhanced validation
      if (name.length < 2) {
        showError("Please enter your full name (at least 2 characters)");
        return;
      }

      if (!isValidEmail(email)) {
        showError("Please enter a valid email address");
        return;
      }

      if (password.length < 6) {
        showError("Password must be at least 6 characters long");
        return;
      }

      if (password !== confirmPassword) {
        showError("Passwords do not match!");
        return;
      }

      if (!terms) {
        showError("Please accept the Terms & Conditions to continue");

        // Highlight terms checkbox
        const termsCheckbox = this.querySelector("#terms");
        termsCheckbox.parentElement.style.animation = "shake 0.5s ease-in-out";
        setTimeout(() => {
          termsCheckbox.parentElement.style.animation = "";
        }, 500);
        return;
      }

      // Show loading state with smooth transition
      signupBtn.disabled = true;
      signupBtn.style.transform = "scale(0.98)";
      btnText.classList.add("hidden");
      btnLoader.classList.remove("hidden");

      try {
        // ✅ CHANGED: Use /api/signup endpoint
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showSuccess("Account created successfully! Redirecting...");
          signupBtn.style.transform = "scale(1.05)";

          // Add success animation to button
          signupBtn.style.background = `linear-gradient(135deg, ${colors.success} 0%, #059669 100%)`;

          setTimeout(() => {
            window.location.href = "/analysis";
          }, 1200);
        } else {
          showError(data.message || "Signup failed. Please try again.");
          resetButton(signupBtn, btnText, btnLoader);

          // Shake animation on error
          signupBtn.style.animation = "shake 0.5s ease-in-out";
          setTimeout(() => {
            signupBtn.style.animation = "";
          }, 500);
        }
      } catch (error) {
        console.error("Signup error:", error);
        showError("Network error. Please check your connection and try again.");
        resetButton(signupBtn, btnText, btnLoader);
      }
    });
  }

  // Helper function to reset button state
  function resetButton(btn, btnText, btnLoader) {
    btn.disabled = false;
    btn.style.transform = "scale(1)";
    btnText.classList.remove("hidden");
    btnLoader.classList.add("hidden");
  }

  // Email validation helper
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Enhanced form input animations with ripple effect
  const formInputs = document.querySelectorAll(".form-group input");
  formInputs.forEach((input) => {
    // Focus animation
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "scale(1.02)";
      this.parentElement.style.transition =
        "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

      // Add glow effect
      this.style.boxShadow = `0 0 0 4px rgba(6, 182, 212, 0.1)`;
    });

    // Blur animation
    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "scale(1)";

      if (!this.value) {
        this.style.boxShadow = "";
      }
    });

    // Input validation on blur
    input.addEventListener("blur", function () {
      if (this.hasAttribute("required") && !this.value.trim()) {
        this.style.borderColor = colors.danger;
        this.style.animation = "shake 0.3s ease-in-out";
        setTimeout(() => {
          this.style.animation = "";
        }, 300);
      }
    });

    // Clear error state on input
    input.addEventListener("input", function () {
      if (this.style.borderColor === colors.danger) {
        this.style.borderColor = "";
      }
    });
  });

  // Add ripple effect to social buttons
  const socialButtons = document.querySelectorAll(".social-btn");
  socialButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: rgba(6, 182, 212, 0.5);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 0;
      `;

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add CSS animations dynamically
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }

    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    @keyframes slideOutUp {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(-20px);
      }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
  `;
  document.head.appendChild(style);

  // Show welcome message on page load
  setTimeout(() => {
    const authHeader = document.querySelector(".auth-header h1");
    if (authHeader) {
      authHeader.style.animation = "pulse 0.6s ease-in-out";
    }
  }, 500);
});
