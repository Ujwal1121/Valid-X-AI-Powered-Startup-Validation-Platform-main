// Enhanced Home.js - Modern Minimalist Theme
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle with smooth animation
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      this.classList.toggle("active");

      // Animate hamburger icon smoothly
      const spans = this.querySelectorAll("span");
      if (this.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translateY(10px)";
        spans[1].style.opacity = "0";
        spans[1].style.transform = "translateX(20px)";
        spans[2].style.transform = "rotate(-45deg) translateY(-10px)";
      } else {
        spans[0].style.transform = "";
        spans[1].style.opacity = "";
        spans[1].style.transform = "";
        spans[2].style.transform = "";
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
        const spans = mobileMenuBtn.querySelectorAll("span");
        spans.forEach((span) => {
          span.style.transform = "";
          span.style.opacity = "";
        });
      }
    });
  }

  // Smooth scroll for anchor links with offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const headerOffset = 90;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Close mobile menu if open
          if (navLinks && navLinks.classList.contains("active")) {
            navLinks.classList.remove("active");
            if (mobileMenuBtn) mobileMenuBtn.classList.remove("active");
          }
        }
      }
    });
  });

  // Enhanced Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -80px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0) scale(1)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document
    .querySelectorAll(".feature-card, .step-card")
    .forEach((card, index) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(40px) scale(0.95)";
      card.style.transition = `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${
        index * 0.1
      }s`;
      observer.observe(card);
    });

  // Smooth parallax effect for floating cards
  let ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        const floatingCards = document.querySelectorAll(".floating-card");
        const scrolled = window.pageYOffset;

        floatingCards.forEach((card, index) => {
          const speed = 0.3 + index * 0.08;
          const yPos = -(scrolled * speed * 0.1);
          card.style.transform = `translateY(${yPos}px)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  });

  // Enhanced navbar scroll effect
  const navbar = document.querySelector(".navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.style.boxShadow = "0 4px 24px rgba(6, 182, 212, 0.12)";
      navbar.style.backdropFilter = "blur(20px)";
      navbar.style.background = "rgba(13, 13, 13, 0.95)";
    } else {
      navbar.style.boxShadow = "";
      navbar.style.backdropFilter = "";
      navbar.style.background = "";
    }

    // Hide/show navbar on scroll (only on desktop)
    if (window.innerWidth > 968) {
      if (currentScroll > lastScroll && currentScroll > 500) {
        navbar.style.transform = "translateY(-100%)";
      } else {
        navbar.style.transform = "translateY(0)";
      }
    }

    lastScroll = currentScroll;
  });

  // Smooth stats counter animation
  const stats = document.querySelectorAll(".stat-number");
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;

    const statsSection = document.querySelector(".hero-stats");
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();

    if (rect.top < window.innerHeight - 100 && rect.bottom >= 0) {
      statsAnimated = true;

      stats.forEach((stat, index) => {
        setTimeout(() => {
          const text = stat.textContent;
          const isNumber = /^\d+k?\+?%?$/.test(text.trim());

          if (isNumber) {
            const target = parseInt(text.replace(/[^0-9]/g, ""));
            const suffix = text.includes("k")
              ? "k+"
              : text.includes("%")
              ? "%"
              : text.includes("+")
              ? "+"
              : text.includes("/")
              ? "/7"
              : "";
            let current = 0;
            const increment = target / 60;
            const duration = 2000;
            const stepTime = duration / 60;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                stat.textContent = (suffix === "/7" ? "24" : target) + suffix;
                clearInterval(timer);
              } else {
                stat.textContent = Math.floor(current) + suffix;
              }
            }, stepTime);
          }
        }, index * 150);
      });
    }
  }

  window.addEventListener("scroll", animateStats);
  animateStats(); // Check on load

  // Add button ripple effects
  document
    .querySelectorAll(".btn-primary, .btn-secondary, .btn-primary-nav")
    .forEach((button) => {
      button.addEventListener("click", function (e) {
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
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: ripple-effect 0.6s ease-out;
                pointer-events: none;
            `;

        this.style.position = "relative";
        this.style.overflow = "hidden";
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });

  // Add CSS for ripple animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes ripple-effect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);
});
