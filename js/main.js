/**
 * DIAH — main application logic
 * Vanilla JS, no dependencies. Relies on `translations` (translations.js),
 * `projectsData` (projects.js) and `newsData` (news.js) being loaded first.
 */
(function () {
  "use strict";

  const state = {
    lang: "pt",
    openModals: 0
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const AKITEM_GRADIENT = "linear-gradient(135deg,#3452FF,#6C3CE9)";

  /**
   * Concept illustration for AkiTem+: a user location pinging nearby
   * businesses with real-time availability. Hand-drawn in the same
   * line-art language as the hero network graphic — not a screenshot,
   * since the app has no real UI to show yet.
   */
  function akitemVisualSVG() {
    return `
      <svg class="pv-map" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle class="pv-radius" cx="230" cy="235" r="150" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 9"/>
        <g class="pv-links" stroke="currentColor" stroke-width="1.1" fill="none">
          <line x1="230" y1="235" x2="440" y2="130"/>
          <line x1="230" y1="235" x2="510" y2="245"/>
          <line x1="230" y1="235" x2="405" y2="355"/>
        </g>
        <g transform="translate(230,235)">
          <circle class="pv-ring" r="28" fill="none" stroke="currentColor" stroke-width="1.2"/>
          <circle r="9" fill="currentColor"/>
        </g>
        <g class="pv-pins" fill="currentColor">
          <circle cx="440" cy="130" r="5"/>
          <circle cx="510" cy="245" r="5"/>
          <circle cx="405" cy="355" r="5"/>
        </g>
        <g class="pv-dots">
          <circle cx="452" cy="118" r="4.5"/>
          <circle cx="522" cy="233" r="4.5"/>
          <circle cx="417" cy="343" r="4.5"/>
        </g>
      </svg>`;
  }
  const NEWS_GRADIENTS = [
    "linear-gradient(135deg,#3452FF,#6C3CE9)",
    "linear-gradient(135deg,#0EA5E9,#3452FF)",
    "linear-gradient(135deg,#7C3AED,#D946EF)",
    "linear-gradient(135deg,#0F172A,#3452FF)",
    "linear-gradient(135deg,#1E293B,#7C3AED)",
    "linear-gradient(135deg,#059669,#0EA5E9)"
  ];
  const LOCALE_MAP = { pt: "pt-PT", en: "en-GB", fr: "fr-FR" };

  /* ---------------------------------------------------------------- i18n */

  function t(key) {
    const dict = translations[state.lang] || translations.pt;
    return dict[key] || translations.pt[key] || key;
  }

  function applyTranslations() {
    document.documentElement.lang = state.lang;
    document.title = t("meta.title");

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t("meta.description"));

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.getAttribute("data-i18n-attr").split(";").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.lang === state.lang);
    });

    updateWorkshopsToggleLabel();
  }

  function setLang(lang) {
    if (!translations[lang] || lang === state.lang) return;
    state.lang = lang;
    localStorage.setItem("diah-lang", lang);
    applyTranslations();
    renderProjects();
    renderNews();
  }

  function initLang() {
    const saved = localStorage.getItem("diah-lang");
    state.lang = saved && translations[saved] ? saved : "pt";

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });

    applyTranslations();
  }

  /* --------------------------------------------------------------- theme */

  function getCurrentTheme() {
    const explicit = document.documentElement.getAttribute("data-theme");
    if (explicit) return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function initTheme() {
    const saved = localStorage.getItem("diah-theme");
    if (saved === "light" || saved === "dark") {
      document.documentElement.setAttribute("data-theme", saved);
    }

    const toggle = document.getElementById("themeToggle");
    toggle.addEventListener("click", () => {
      const next = getCurrentTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("diah-theme", next);
    });
  }

  /* -------------------------------------------------------------- header */

  function initHeader() {
    const header = document.getElementById("siteHeader");
    let lastY = window.scrollY;

    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        header.classList.toggle("is-scrolled", y > 10);

        if (y > lastY && y > window.innerHeight * 0.6) {
          header.classList.add("is-hidden");
        } else {
          header.classList.remove("is-hidden");
        }
        lastY = y;

        updateProgressBar();
        updateBackToTop();
      },
      { passive: true }
    );
  }

  function updateProgressBar() {
    const bar = document.getElementById("progressBar");
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = pct + "%";
  }

  /* ----------------------------------------------------------- mobile nav */

  function initMobileNav() {
    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("mobileNav");
    const backdrop = document.getElementById("mobileNavBackdrop");

    function close() {
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    function open() {
      toggle.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      nav.classList.add("is-open");
      backdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    toggle.addEventListener("click", () => {
      toggle.classList.contains("is-open") ? close() : open();
    });
    backdrop.addEventListener("click", close);
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ------------------------------------------------------------- reveal */

  function initReveal() {
    // `reveal` is only added here, by JS that actually ran — the CSS rules that
    // hide these elements target `.reveal`, so with no JS (or a script error)
    // everything just stays at its normal, fully visible layout.
    const marked = document.querySelectorAll("[data-reveal]");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      return;
    }
    marked.forEach((el) => el.classList.add("reveal"));

    const heroEls = [];
    const otherEls = [];
    marked.forEach((el) => (el.closest(".hero") ? heroEls : otherEls).push(el));

    // Hero content is always in view on load — animate it in immediately
    // instead of waiting on an observer callback.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroEls.forEach((el) => el.classList.add("is-visible"));
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    otherEls.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------ counters */

  function initCounters() {
    const nums = document.querySelectorAll(".stat-num[data-count]");
    if (!nums.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      nums.forEach((el) => (el.textContent = el.dataset.count));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );
    nums.forEach((el) => observer.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* -------------------------------------------------------------- cursor */

  function initCursor() {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const dot = document.getElementById("cursorDot");
    dot.classList.add("is-active");

    document.addEventListener(
      "mousemove",
      (e) => {
        dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      },
      { passive: true }
    );

    const hoverSelector = "a, button, .project-card, .news-card, .workshop-card, input, select, textarea";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverSelector)) dot.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverSelector)) dot.classList.remove("is-hover");
    });
  }

  /* ---------------------------------------------------------- back-to-top */

  function updateBackToTop() {
    document.getElementById("backToTop").classList.toggle("is-visible", window.scrollY > 700);
  }

  function initBackToTop() {
    document.getElementById("backToTop").addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* -------------------------------------------------------------- modals */

  function openModal(modal) {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    state.openModals++;
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    state.openModals = Math.max(0, state.openModals - 1);
    if (state.openModals === 0) document.body.style.overflow = "";
  }

  function closeAllModals() {
    document.querySelectorAll(".modal.is-open").forEach(closeModal);
  }

  function initModals() {
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-close-modal]")) {
        const modal = e.target.closest(".modal");
        if (modal) closeModal(modal);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllModals();
    });
  }

  /* ------------------------------------------------------------ projects */

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function projectCardHTML(p) {
    return `
      <article class="project-card reveal is-visible" data-id="${p.id}">
        <div class="project-cover is-wide" style="--cover-gradient:${AKITEM_GRADIENT}">
          <div class="project-cover-grid"></div>
          ${akitemVisualSVG()}
          <span class="project-cover-cat">${escapeHTML(t("projects.filter." + p.category))}</span>
        </div>
        <div class="project-body">
          <h3>${escapeHTML(p.title)}</h3>
          <p>${escapeHTML(p.description)}</p>
          <div class="project-meta">
            <span class="project-status"><i></i>${escapeHTML(t("projects.status"))}</span>
            <span class="project-view">${escapeHTML(t("projects.view"))} &rarr;</span>
          </div>
        </div>
      </article>`;
  }

  function renderProjects() {
    const grid = document.getElementById("projectsGrid");
    const list = projectsData[state.lang] || projectsData.pt;
    grid.innerHTML = list.map(projectCardHTML).join("");
  }

  function stepsHTML(steps) {
    return steps.map((s, i) => `
      <div class="mc-step">
        <span class="mc-step-num">${String(i + 1).padStart(2, "0")}</span>
        <h5>${escapeHTML(s.title)}</h5>
        <p>${escapeHTML(s.text)}</p>
      </div>`).join("");
  }

  function modulesHTML(modules) {
    return modules.map((m) => `
      <div class="mc-module">
        <h5>${escapeHTML(m.title)}</h5>
        <p>${escapeHTML(m.text)}</p>
      </div>`).join("");
  }

  function listHTML(items) {
    return `<ul class="mc-results">${items.map((i) => `<li>${escapeHTML(i)}</li>`).join("")}</ul>`;
  }

  function openProjectModal(id) {
    const project = (projectsData[state.lang] || projectsData.pt).find((p) => p.id === id);
    if (!project) return;

    document.getElementById("projectModalBody").innerHTML = `
      <div class="mc-cover" style="--cover-gradient:${AKITEM_GRADIENT}">
        <div class="project-cover-grid"></div>
        ${akitemVisualSVG()}
      </div>
      <span class="mc-tag">${escapeHTML(t("projects.filter." + project.category))}</span>
      <h3 class="mc-title">${escapeHTML(project.title)}</h3>
      <p class="mc-tagline">${escapeHTML(project.tagline)}</p>
      <span class="mc-badge"><i></i>${escapeHTML(t("projects.status"))}</span>
      <p class="mc-lede">${escapeHTML(project.lede)}</p>

      <div class="mc-section">
        <h4>${escapeHTML(t("projects.problem"))}</h4>
        <p>${escapeHTML(project.problem)}</p>
      </div>
      <div class="mc-section">
        <h4>${escapeHTML(t("projects.solution"))}</h4>
        <p>${escapeHTML(project.solution)}</p>
      </div>
      <div class="mc-section">
        <h4>${escapeHTML(t("projects.howItWorks"))}</h4>
        <div class="mc-steps">${stepsHTML(project.steps)}</div>
      </div>
      <div class="mc-section">
        <h4>${escapeHTML(t("projects.modules"))}</h4>
        <div class="mc-modules">${modulesHTML(project.modules)}</div>
      </div>
      <div class="mc-section">
        <div class="mc-columns">
          <div>
            <h4>${escapeHTML(t("projects.forSeekers"))}</h4>
            ${listHTML(project.forSeekers)}
          </div>
          <div>
            <h4>${escapeHTML(t("projects.forBusinesses"))}</h4>
            ${listHTML(project.forBusinesses)}
          </div>
        </div>
      </div>
      <div class="mc-section">
        <h4>${escapeHTML(t("projects.capabilities"))}</h4>
        <div class="mc-tech">${project.capabilities.map((c) => `<span>${escapeHTML(c)}</span>`).join("")}</div>
      </div>
      <div class="mc-section mc-status-block">
        <h4><i></i>${escapeHTML(t("projects.status"))}</h4>
        <p>${escapeHTML(project.statusText)}</p>
      </div>`;

    openModal(document.getElementById("projectModal"));
  }

  function initProjects() {
    document.getElementById("projectsGrid").addEventListener("click", (e) => {
      const card = e.target.closest(".project-card");
      if (card) openProjectModal(card.dataset.id);
    });

    renderProjects();
  }

  /* ---------------------------------------------------------------- news */

  function formatDate(iso) {
    const locale = LOCALE_MAP[state.lang] || "pt-PT";
    try {
      return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
    } catch (err) {
      return iso;
    }
  }

  function newsCardHTML(article, index) {
    const gradient = NEWS_GRADIENTS[index % NEWS_GRADIENTS.length];
    return `
      <article class="news-card reveal is-visible" data-id="${article.id}">
        <div class="news-cover" style="--cover-gradient:${gradient}">
          <div class="news-cover-grid"></div>
        </div>
        <div class="news-body">
          <span class="news-category">${escapeHTML(article.category)}</span>
          <h3>${escapeHTML(article.title)}</h3>
          <p>${escapeHTML(article.summary)}</p>
          <div class="news-meta">
            <span>${escapeHTML(article.author)}</span>
            <span>${formatDate(article.date)}</span>
          </div>
        </div>
      </article>`;
  }

  function renderNews() {
    const grid = document.getElementById("newsGrid");
    const list = newsData[state.lang] || newsData.pt;
    grid.innerHTML = list.map(newsCardHTML).join("");
  }

  function openNewsModal(id) {
    const list = newsData[state.lang] || newsData.pt;
    const index = list.findIndex((a) => a.id === id);
    const article = list[index];
    if (!article) return;
    const gradient = NEWS_GRADIENTS[index % NEWS_GRADIENTS.length];

    document.getElementById("newsModalBody").innerHTML = `
      <div class="mc-cover" style="--cover-gradient:${gradient}"></div>
      <span class="mc-tag">${escapeHTML(article.category)}</span>
      <h3 class="mc-title">${escapeHTML(article.title)}</h3>
      <div class="mc-meta">
        <span>${escapeHTML(article.author)}</span>
        <span>${formatDate(article.date)}</span>
      </div>
      <div class="mc-section">
        <p>${escapeHTML(article.summary)}</p>
      </div>`;

    openModal(document.getElementById("newsModal"));
  }

  function initNews() {
    document.getElementById("newsGrid").addEventListener("click", (e) => {
      const card = e.target.closest(".news-card");
      if (card) openNewsModal(card.dataset.id);
    });
    renderNews();
  }

  /* ----------------------------------------------------------- workshops */

  function updateWorkshopsToggleLabel() {
    const grid = document.getElementById("workshopsGrid");
    const btn = document.getElementById("workshopsToggle");
    if (!grid || !btn) return;
    const expanded = grid.classList.contains("is-expanded");
    btn.textContent = expanded ? t("workshops.cta_less") : t("workshops.cta");
  }

  function initWorkshops() {
    const grid = document.getElementById("workshopsGrid");
    const btn = document.getElementById("workshopsToggle");
    btn.addEventListener("click", () => {
      grid.classList.toggle("is-expanded");
      updateWorkshopsToggleLabel();
      if (!grid.classList.contains("is-expanded")) {
        grid.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      }
    });
  }

  /* ---------------------------------------------------------------- init */

  document.addEventListener("DOMContentLoaded", () => {
    initLang();
    initTheme();
    initHeader();
    initMobileNav();
    initReveal();
    initCounters();
    initCursor();
    initBackToTop();
    initModals();
    initProjects();
    initNews();
    initWorkshops();
    updateProgressBar();
    updateBackToTop();
  });
})();
