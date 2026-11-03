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

  const AKITEM_GRADIENT = "linear-gradient(135deg,#0B2545,#E3B458)";

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
    "linear-gradient(135deg,#0B2545,#E3B458)",
    "linear-gradient(135deg,#0A1B33,#0B2545)",
    "linear-gradient(135deg,#0B2545,#3C4F91)",
    "linear-gradient(135deg,#14140F,#0B2545)",
    "linear-gradient(135deg,#B6881E,#E3B458)",
    "linear-gradient(135deg,#0B2545,#6B7FBE)"
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
    heroHeadline.restart();
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

    nav.querySelectorAll(".mobile-sub-toggle").forEach((btn) => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.addEventListener("click", () => {
        const open = btn.getAttribute("aria-expanded") !== "true";
        btn.setAttribute("aria-expanded", String(open));
        panel.classList.toggle("is-open", open);
      });
    });
  }

  /* ------------------------------------------------------ nav dropdown */

  function initNavDropdown() {
    const item = document.getElementById("navServices");
    if (!item) return;
    const toggle = item.querySelector(".nav-dropdown-toggle");
    const panel = document.getElementById(toggle.getAttribute("aria-controls"));
    const links = () => [...panel.querySelectorAll("a")];
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let openTimer = 0;
    let closeTimer = 0;
    // Opened by click/keyboard: stays open until outside click, Esc or focus leaves.
    let pinned = false;

    const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
    function setOpen(open) {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
      toggle.setAttribute("aria-expanded", String(open));
      item.classList.toggle("is-open", open);
      if (!open) pinned = false;
    }
    function focusLink(i) {
      const all = links();
      all[(i + all.length) % all.length].focus();
    }

    toggle.addEventListener("click", () => {
      if (isOpen() && pinned) {
        setOpen(false);
      } else {
        setOpen(true);
        pinned = true;
      }
    });

    if (canHover) {
      item.addEventListener("mouseenter", () => {
        clearTimeout(closeTimer);
        if (!isOpen()) openTimer = setTimeout(() => setOpen(true), 120);
      });
      item.addEventListener("mouseleave", () => {
        clearTimeout(openTimer);
        if (isOpen() && !pinned) closeTimer = setTimeout(() => setOpen(false), 250);
      });
    }

    document.addEventListener("click", (e) => {
      if (isOpen() && !item.contains(e.target)) setOpen(false);
    });
    item.addEventListener("focusout", (e) => {
      if (isOpen() && !item.contains(e.relatedTarget)) setOpen(false);
    });
    panel.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });

    item.addEventListener("keydown", (e) => {
      const all = links();
      const i = all.indexOf(document.activeElement);
      if (e.key === "Escape" && isOpen()) {
        e.preventDefault();
        setOpen(false);
        toggle.focus();
      } else if (e.target === toggle && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        e.preventDefault();
        setOpen(true);
        pinned = true;
        focusLink(e.key === "ArrowDown" ? 0 : -1);
      } else if (i !== -1 && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        e.preventDefault();
        focusLink(i + (e.key === "ArrowDown" ? 1 : -1));
      } else if (i !== -1 && (e.key === "Home" || e.key === "End")) {
        e.preventDefault();
        focusLink(e.key === "Home" ? 0 : -1);
      }
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

  /* ------------------------------------------------------- hero headline */

  /** Rects of `el`'s content relative to `hero`, minus any reveal transform on `revealEl`. */
  function heroRects(el, revealEl, hero, useRange) {
    const heroBox = hero.getBoundingClientRect();
    let left = 0;
    let top = 0;
    for (let n = revealEl; n && n !== hero; n = n.offsetParent) {
      left += n.offsetLeft;
      top += n.offsetTop;
    }
    const box = revealEl.getBoundingClientRect();
    const dx = box.left - heroBox.left - left;
    const dy = box.top - heroBox.top - top;
    let list;
    if (useRange) {
      const range = document.createRange();
      range.selectNodeContents(el);
      list = range.getClientRects();
    } else {
      list = el.getClientRects();
    }
    return [...list].filter((r) => r.width && r.height).map((r) => ({
      l: r.left - heroBox.left - dx,
      r: r.right - heroBox.left - dx,
      t: r.top - heroBox.top - dy,
      b: r.bottom - heroBox.top - dy
    }));
  }

  const heroHeadline = (function () {
    let els = null;
    let words = [];
    let restText = "";
    let idx = 0;
    let timer = 0;
    let layoutRaf = 0;

    function query() {
      const tagline = document.getElementById("heroTagline");
      if (!tagline) return null;
      const hero = tagline.closest(".hero");
      return {
        hero,
        tagline,
        h1: tagline.closest(".hero-title"),
        before: tagline.querySelector(".hero-tagline-before"),
        lead: tagline.querySelector(".hero-tagline-lead"),
        br: tagline.querySelector(".hero-word-break"),
        wrap: tagline.querySelector(".hero-word-wrap"),
        word: tagline.querySelector(".hero-word"),
        tail: tagline.querySelector(".hero-tagline-tail"),
        rest: tagline.querySelector(".hero-tagline-rest"),
        eyebrow: hero.querySelector(".hero-eyebrow"),
        text: hero.querySelector(".hero-text"),
        cta: hero.querySelector(".hero-cta"),
        netLayer: hero.querySelector(".hero-net-layer")
      };
    }

    function stop() {
      clearTimeout(timer);
      timer = 0;
    }
    function later(fn, ms) {
      timer = setTimeout(fn, ms);
    }
    function setTyping(on) {
      els.wrap.classList.toggle("is-typing", on);
    }

    function typeNext(i) {
      const target = words[idx];
      if (i < target.length) {
        els.word.textContent = target.slice(0, i + 1);
        later(() => typeNext(i + 1), 60 + Math.random() * 65);
      } else {
        setTyping(false);
        later(startDelete, 2500);
      }
    }
    function deleteStep() {
      const current = els.word.textContent;
      if (current.length) {
        els.word.textContent = current.slice(0, -1);
        later(deleteStep, 60);
      } else {
        setTyping(false);
        later(() => {
          idx = (idx + 1) % words.length;
          setTyping(true);
          typeNext(0);
        }, 450);
      }
    }
    function startDelete() {
      if (words.length < 2) return;
      setTyping(true);
      deleteStep();
    }

    function render() {
      const after = t("hero.tagline_after");
      const tail = after.match(/^\S*/)[0];
      els.tail.textContent = tail;
      restText = after.slice(tail.length);
      renderRest(new Set());
      const list = t("hero.words");
      words = Array.isArray(list) && list.length ? list : [String(list)];
      setLead(true);
    }

    /**
     * Text after the animated word (EN only: " digital solutions."), one span per
     * word, with a forced break before each word index in `breakBefore`.
     */
    function renderRest(breakBefore) {
      els.rest.textContent = "";
      let i = 0;
      restText.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          els.rest.append(part);
          return;
        }
        if (breakBefore.has(i)) els.rest.append(document.createElement("br"));
        const span = document.createElement("span");
        span.textContent = part;
        els.rest.append(span);
        i++;
      });
    }

    /** Moves the word before the animated one into (or out of) the unbreakable unit. */
    function setLead(glued) {
      const before = t("hero.tagline_before");
      const cut = before.lastIndexOf(" ");
      if (glued && cut !== -1) {
        els.before.textContent = before.slice(0, cut);
        els.lead.textContent = before.slice(cut + 1) + " ";
      } else {
        els.before.textContent = before;
        els.lead.textContent = "";
      }
    }

    /**
     * Keeps the unit (lead word + animated word + period) on a fixed line for every
     * full and partial word, locks the headline height, and sizes the mask hole
     * around the hero text.
     */
    function layout() {
      if (!els) return;
      const { h1, br, wrap, word } = els;
      const current = word.textContent;
      h1.style.minHeight = "";
      br.hidden = true;

      setLead(true);
      const widest = Math.max(...words.map((w) => {
        word.textContent = w;
        return wrap.getBoundingClientRect().width;
      }));
      // Lead + word don't fit on one line here: keep only the word unbreakable.
      if (widest > els.tagline.clientWidth) setLead(false);

      // Line breaks change monotonically with word length, so comparing the empty
      // word with every full word covers the partial states too. Positions are
      // relative to the headline, which the hero centres vertically.
      const tops = (el) => {
        const origin = els.tagline.getBoundingClientRect().top;
        return [...el.getClientRects()].map((r) => Math.round(r.top - origin)).join(",");
      };
      const unitMoves = new Set(["", ...words].map((w) => {
        word.textContent = w;
        return `${tops(els.before)}|${tops(wrap)}`;
      })).size > 1;
      // Start the unit on its own line so its length can't change where it sits.
      if (unitMoves) br.hidden = false;

      // Text after the word: break it where the longest word makes it break, so
      // every word gives the same lines (shorter words just leave more room).
      renderRest(new Set());
      let longest = words[0];
      words.forEach((w) => {
        word.textContent = w;
        const width = wrap.getBoundingClientRect().width;
        word.textContent = longest;
        if (width > wrap.getBoundingClientRect().width) longest = w;
      });
      word.textContent = longest;
      const breakBefore = new Set();
      let prevTop = Math.round(wrap.getBoundingClientRect().top);
      [...els.rest.children].forEach((span, k) => {
        const top = Math.round(span.getBoundingClientRect().top);
        if (top > prevTop) breakBefore.add(k);
        prevTop = top;
      });
      if (breakBefore.size) renderRest(breakBefore);

      let maxH = 0;
      words.forEach((w) => {
        word.textContent = w;
        maxH = Math.max(maxH, h1.getBoundingClientRect().height);
      });
      h1.style.minHeight = Math.ceil(maxH) + "px";

      const rects = [];
      words.forEach((w) => {
        word.textContent = w;
        rects.push(...heroRects(els.tagline, h1, els.hero, false));
      });
      word.textContent = current;
      rects.push(...heroRects(els.eyebrow, els.eyebrow, els.hero, true));
      rects.push(...heroRects(els.text, els.text, els.hero, true));
      [...els.cta.children].forEach((btn) => rects.push(...heroRects(btn, els.cta, els.hero, false)));
      updateMask(rects);
    }

    /**
     * Smallest centred ellipse that contains every text rect. Wide screens have free
     * space at the sides (tall ellipse); narrow ones only above/below (flat ellipse).
     */
    function updateMask(rects) {
      if (!rects.length) return;
      const pad = 18;
      const box = rects.map((r) => ({ l: r.l - pad, r: r.r + pad, t: r.t - pad, b: r.b + pad }));
      const cx = (Math.min(...box.map((r) => r.l)) + Math.max(...box.map((r) => r.r))) / 2;
      const cy = (Math.min(...box.map((r) => r.t)) + Math.max(...box.map((r) => r.b))) / 2;
      const bMax = Math.max(...box.map((r) => Math.max(Math.abs(r.t - cy), Math.abs(r.b - cy))));
      const ry = bMax * (els.hero.clientWidth >= 1100 ? 2 : 1.08);
      let rx = 0;
      box.forEach((r) => {
        [r.l, r.r].forEach((x) => {
          [r.t, r.b].forEach((y) => {
            rx = Math.max(rx, Math.abs(x - cx) / Math.sqrt(1 - Math.pow((y - cy) / ry, 2)));
          });
        });
      });
      const fade = 1.3;
      const mask = { cx, cy, rx: rx * fade, ry: ry * fade, clear: 1 / fade };
      const s = els.netLayer.style;
      s.setProperty("--net-cx", cx.toFixed(1) + "px");
      s.setProperty("--net-cy", cy.toFixed(1) + "px");
      s.setProperty("--net-rx", (rx * fade).toFixed(1) + "px");
      s.setProperty("--net-ry", (ry * fade).toFixed(1) + "px");
      s.setProperty("--net-clear", (100 / fade).toFixed(2) + "%");

      // The network keeps its shapes out of the text block and the scroll cue.
      const union = {
        l: Math.min(...box.map((r) => r.l)), r: Math.max(...box.map((r) => r.r)),
        t: Math.min(...box.map((r) => r.t)), b: Math.max(...box.map((r) => r.b))
      };
      const clear = [union];
      const cue = els.hero.querySelector(".scroll-indicator");
      if (cue) clear.push(...heroRects(cue, cue, els.hero, false).map((r) => ({ l: r.l - pad, r: r.r + pad, t: r.t - pad, b: r.b + pad })));
      heroNetwork.setClear(clear, mask);
    }

    function start() {
      els = els || query();
      if (!els) return;
      stop();
      render();
      idx = 0;
      els.word.textContent = words[0];
      layout();
      setTyping(false);
      if (prefersReducedMotion) {
        els.wrap.classList.remove("is-animated");
        return;
      }
      els.wrap.classList.add("is-animated");
      later(startDelete, 2500);
    }

    function scheduleLayout() {
      cancelAnimationFrame(layoutRaf);
      layoutRaf = requestAnimationFrame(layout);
    }

    function init() {
      start();
      if (!els) return;
      window.addEventListener("resize", scheduleLayout, { passive: true });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleLayout);
      document.addEventListener("visibilitychange", () => {
        if (prefersReducedMotion) return;
        stop();
        if (!document.hidden) {
          els.word.textContent = words[idx];
          setTyping(false);
          later(startDelete, 2500);
        }
      });
    }

    return { init, restart: start };
  })();

  /* -------------------------------------------------------- hero network */

  /** Deterministic PRNG (mulberry32), so the network looks the same on every load. */
  function seededRandom(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * Shapes in grid cells; every vertex sits on a grid intersection. Squares stand for
   * stability and trust; triangles (pointing up or up-right, like the logo's) for
   * direction and innovation. `w` x `h` is the block of cells a shape claims.
   */
  const NET_SHAPES = {
    sq1: { kind: "sq", w: 1, h: 1, pts: [[0, 0], [1, 0], [1, 1], [0, 1]] },
    sq2: { kind: "sq", w: 2, h: 2, pts: [[0, 0], [2, 0], [2, 2], [0, 2]] },
    sq3: { kind: "sq", w: 3, h: 3, pts: [[0, 0], [3, 0], [3, 3], [0, 3]] },
    ramp1: { kind: "tri", w: 1, h: 1, pts: [[0, 1], [1, 1], [1, 0]] },
    ramp2: { kind: "tri", w: 2, h: 2, pts: [[0, 2], [2, 2], [2, 0]] },
    ramp3: { kind: "tri", w: 3, h: 3, pts: [[0, 3], [3, 3], [3, 0]] },
    peak2: { kind: "tri", w: 2, h: 2, pts: [[0, 2], [2, 2], [1, 0]] },
    peak4: { kind: "tri", w: 4, h: 3, pts: [[0, 3], [4, 3], [2, 0]] }
  };
  // [shape, weight]: the back layer holds a few large shapes, the front many small ones.
  const NET_MIX = {
    back: [["sq3", 3], ["ramp3", 2], ["peak4", 2], ["sq2", 2]],
    front: [["sq1", 5], ["ramp1", 4], ["sq2", 2], ["ramp2", 2], ["peak2", 2]]
  };

  /**
   * Grows shape clusters on the hero grid: dense top-left and bottom-right, lighter in
   * the other corners, thinning toward the centre. Cells under the nav bar, inside
   * `clear` boxes, or where the text mask would leave them nearly invisible stay empty.
   * Returns shapes as { spec, c, r, layer } in grid cells.
   */
  function generateNetwork(W, H, cell, headerH, clear, mask, mobile) {
    // V8's optimising compiler can return Math.pow/exp/hypot results that differ in
    // the last bit from the interpreter's; rounding keeps every decision identical.
    const q = (v) => Math.round(v * 1e6) / 1e6;
    const maskAlpha = (x, y) => {
      if (!mask) return 1;
      const rho = q(Math.hypot((x - mask.cx) / mask.rx, (y - mask.cy) / mask.ry));
      return Math.min(1, Math.max(0, (rho - mask.clear) / (1 - mask.clear)));
    };
    const rand = seededRandom(0xd1a4);
    // Shapes may bleed two cells past the sides and one past the bottom, so the
    // pattern reads as continuing beyond the frame rather than stuck to its edges.
    const cMin = -2, cMax = Math.ceil(W / cell) + 2, rMax = Math.ceil(H / cell) + 1;
    const nc = cMax - cMin;
    const inGrid = (c, r) => c >= cMin && c < cMax && r >= 0 && r < rMax;
    const FREE = 0, BLOCKED = 1, BACK = 2, FRONT = 3, GAP = 4;
    const state = new Uint8Array(nc * rMax);
    const at = (c, r) => r * nc + (c - cMin);
    for (let r = 0; r < rMax; r++) {
      for (let c = cMin; c < cMax; c++) {
        const x0 = c * cell, y0 = r * cell, x1 = x0 + cell, y1 = y0 + cell;
        if (y0 < headerH + 8 || maskAlpha(x0 + cell / 2, y0 + cell / 2) < 0.2 ||
            clear.some((bx) => x1 > bx.l && x0 < bx.r && y1 > bx.t && y0 < bx.b)) {
          state[at(c, r)] = BLOCKED;
        }
      }
    }

    const reach = 0.3 * Math.hypot(W, H);
    const corners = [
      { x: 0, y: 0, weight: 1 },
      { x: W, y: H, weight: 1 },
      { x: W, y: 0, weight: 0.45 },
      { x: 0, y: H, weight: 0.45 }
    ];
    const density = (c, r) => {
      const x = (c + 0.5) * cell, y = (r + 0.5) * cell;
      return q(Math.max(...corners.map((k) => k.weight * Math.exp(-Math.pow(Math.hypot(x - k.x, y - k.y) / reach, 2)))));
    };
    // Integer weights + integer draw: no float comparison can tip a choice.
    const pickWeighted = (items, weightOf) => {
      const weights = items.map((it) => Math.round(weightOf(it) * 1e6));
      const total = weights.reduce((t, w) => t + w, 0);
      if (!total) return items[Math.floor(rand() * items.length)];
      let x = Math.floor(rand() * total);
      for (let i = 0; i < items.length; i++) if ((x -= weights[i]) < 0) return items[i];
      return items[items.length - 1];
    };

    const shapes = [];
    // Two triangles side by side on the same base line leave a "V" between them that
    // reads as a downward triangle, so they're never placed directly next to each other.
    const formsV = (spec, c, r) => spec.kind === "tri" && shapes.some((s) => s.spec.kind === "tri" &&
      s.r + s.spec.h === r + spec.h && (s.c + s.spec.w === c || c + spec.w === s.c));
    function grow(corner, layer, target) {
      const inQuad = (c, r) => ((c + 0.5) * cell < W / 2) === (corner.x === 0) && ((r + 0.5) * cell < H / 2) === (corner.y === 0);
      const onScreen = (spec, c, r) => c + spec.w > 0 && c * cell < W && r * cell < H;
      const fits = (spec, c, r) => {
        if (!inGrid(c, r) || !inGrid(c + spec.w - 1, r + spec.h - 1) || !onScreen(spec, c, r)) return false;
        for (let y = r; y < r + spec.h; y++) {
          for (let x = c; x < c + spec.w; x++) if (state[at(x, y)] !== FREE || !inQuad(x, y)) return false;
        }
        return true;
      };
      const mine = [];
      let placed = 0;
      let last = null;
      for (let attempt = 0; placed < target && attempt < target * 40; attempt++) {
        const candidates = [];
        if (!mine.length) {
          for (let r = 0; r < rMax; r++) for (let c = cMin; c < cMax; c++) if (state[at(c, r)] === FREE && inQuad(c, r)) candidates.push([c, r]);
        } else {
          const seen = new Set();
          mine.forEach(([c, r]) => {
            [[c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]].forEach(([x, y]) => {
              const key = x + "," + y;
              if (inGrid(x, y) && !seen.has(key) && state[at(x, y)] === FREE && inQuad(x, y)) {
                seen.add(key);
                candidates.push([x, y]);
              }
            });
          });
        }
        if (!candidates.length) break;
        const [cc, cr] = pickWeighted(candidates, ([c, r]) => Math.pow(density(c, r), mine.length ? 2 : 4));
        // Discourage repeating the previous shape so clusters don't read as a sawtooth row.
        const key = pickWeighted(NET_MIX[layer], (m) => m[1] * (m[0] === last ? 0.25 : 1))[0];
        const spec = NET_SHAPES[key];
        const offsets = [];
        for (let dy = 0; dy < spec.h; dy++) for (let dx = 0; dx < spec.w; dx++) offsets.push([dx, dy]);
        for (let i = offsets.length - 1; i > 0; i--) {
          const j = Math.floor(rand() * (i + 1));
          [offsets[i], offsets[j]] = [offsets[j], offsets[i]];
        }
        for (const [dx, dy] of offsets) {
          const c = cc - dx, r = cr - dy;
          if (!fits(spec, c, r) || formsV(spec, c, r)) continue;
          for (let y = r; y < r + spec.h; y++) {
            for (let x = c; x < c + spec.w; x++) {
              state[at(x, y)] = layer === "back" ? BACK : FRONT;
              mine.push([x, y]);
            }
          }
          shapes.push({ spec, c, r, layer });
          last = key;
          placed++;
          break;
        }
      }
    }

    const counts = mobile
      ? { back: [1, 1, 0, 0], front: [5, 6, 2, 2] }
      : { back: [3, 3, 1, 1], front: [14, 14, 4, 4] };
    corners.forEach((k, i) => grow(k, "back", counts.back[i]));
    // A one-cell gap around back shapes: the layers drift differently, so they
    // shouldn't share edges (they'd split into double lines).
    for (let r = 0; r < rMax; r++) {
      for (let c = cMin; c < cMax; c++) {
        if (state[at(c, r)] !== BACK) continue;
        [[c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]].forEach(([x, y]) => {
          if (inGrid(x, y) && state[at(x, y)] === FREE) state[at(x, y)] = GAP;
        });
      }
    }
    corners.forEach((k, i) => grow(k, "front", counts.front[i]));

    // Barely-visible fills: one triangle in gold, one square in navy, deep in the corners.
    const score = (s) => density(s.c + s.spec.w / 2 - 0.5, s.r + s.spec.h / 2 - 0.5);
    const best = (list) => list.reduce((a, b) => (score(b) > score(a) ? b : a), list[0]);
    const tris = shapes.filter((s) => s.spec.kind === "tri" && s.spec.w >= 2);
    const tri = best(tris.length ? tris : shapes.filter((s) => s.spec.kind === "tri"));
    if (tri) tri.fill = "gold";
    const leftSide = tri && tri.c * cell < W / 2;
    const squares = shapes.filter((s) => s.spec.kind === "sq" && s.spec.w >= 2);
    const opposite = squares.filter((s) => (s.c * cell < W / 2) !== leftSide);
    const sq = best(opposite.length ? opposite : squares);
    if (sq) sq.fill = "base";

    return { shapes, rand };
  }

  /** Turns shapes into drawable geometry per layer: deduplicated unit edges, meeting points, graph. */
  function buildNetworkLayer(shapes, cell, rand) {
    const nodes = [];
    const nodeIndex = new Map();
    const node = (gx, gy) => {
      const key = gx + "," + gy;
      if (!nodeIndex.has(key)) nodeIndex.set(key, nodes.push({ gx, gy, x: gx * cell + 0.5, y: gy * cell + 0.5 }) - 1);
      return nodeIndex.get(key);
    };
    const edges = [];
    const edgeIndex = new Map();
    const addEdge = (a, b, strong) => {
      const key = Math.min(a, b) + "-" + Math.max(a, b);
      if (edgeIndex.has(key)) {
        if (strong) edges[edgeIndex.get(key)].strong = true;
        return;
      }
      edgeIndex.set(key, edges.push({ a, b, strong }) - 1);
    };
    const polys = shapes.map((s) => s.spec.pts.map(([x, y]) => [s.c + x, s.r + y]));

    polys.forEach((pts) => {
      pts.forEach(([x1, y1], i) => {
        const [x2, y2] = pts[(i + 1) % pts.length];
        const strong = rand() < 0.13;
        if (x1 === x2 || y1 === y2) {
          // Axis-aligned: split into unit steps so overlapping sides draw once.
          const steps = Math.abs(x2 - x1) + Math.abs(y2 - y1);
          const sx = Math.sign(x2 - x1), sy = Math.sign(y2 - y1);
          for (let k = 0; k < steps; k++) addEdge(node(x1 + sx * k, y1 + sy * k), node(x1 + sx * (k + 1), y1 + sy * (k + 1)), strong);
        } else {
          addEdge(node(x1, y1), node(x2, y2), strong);
        }
      });
    });

    // A dot only where shapes meet: a corner that touches another shape's outline.
    const onOutline = (pts, px, py) => pts.some(([x1, y1], i) => {
      const [x2, y2] = pts[(i + 1) % pts.length];
      const cross = (x2 - x1) * (py - y1) - (y2 - y1) * (px - x1);
      return cross === 0 && px >= Math.min(x1, x2) && px <= Math.max(x1, x2) && py >= Math.min(y1, y2) && py <= Math.max(y1, y2);
    });
    const dots = new Set();
    polys.forEach((pts, i) => {
      pts.forEach(([px, py]) => {
        if (polys.some((other, j) => j !== i && onOutline(other, px, py))) dots.add(node(px, py));
      });
    });

    const adj = nodes.map(() => []);
    edges.forEach((e, i) => {
      adj[e.a].push([e.b, i]);
      adj[e.b].push([e.a, i]);
    });

    const toPath = (list) => {
      const p = new Path2D();
      list.forEach((e) => {
        p.moveTo(nodes[e.a].x, nodes[e.a].y);
        p.lineTo(nodes[e.b].x, nodes[e.b].y);
      });
      return p;
    };
    const dotPath = new Path2D();
    dots.forEach((i) => {
      dotPath.moveTo(nodes[i].x + 1.6, nodes[i].y);
      dotPath.arc(nodes[i].x, nodes[i].y, 1.6, 0, Math.PI * 2);
    });
    const fills = shapes.filter((s) => s.fill).map((s, k) => {
      const p = new Path2D();
      polys[shapes.indexOf(s)].forEach(([x, y], i) => (i ? p.lineTo(x * cell + 0.5, y * cell + 0.5) : p.moveTo(x * cell + 0.5, y * cell + 0.5)));
      p.closePath();
      return { path: p, color: s.fill, key: k };
    });

    return {
      nodes, edges, adj, fills, dotPath,
      normalPath: toPath(edges.filter((e) => !e.strong)),
      strongPath: toPath(edges.filter((e) => e.strong))
    };
  }

  const heroNetwork = (function () {
    const TAU = Math.PI * 2;
    // Back layer: larger shapes, fainter, slower. Front: smaller, crisper, a bit faster.
    const LAYERS = {
      back: { amp: 3, tx: 19, ty: 23, ph: [0.7, 1.9], alpha: 0.65, dot: 0.6 },
      front: { amp: 5, tx: 11, ty: 13, ph: [2.3, 4.1], alpha: 1, dot: 1 }
    };
    let canvas, ctx, hero, bg;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let net = null;
    let colors = null;
    let clear = [];
    let mask = null;
    let clearKey = "";
    let flows = [];
    let nextFlow = 0;
    let raf = 0;
    let running = false;
    let onScreen = true;
    let resizeRaf = 0;

    function readColors() {
      const cs = getComputedStyle(document.documentElement);
      const rgb = (name) => cs.getPropertyValue(name).split(",").map((v) => parseFloat(v));
      const dark = getCurrentTheme() === "dark";
      colors = {
        base: rgb("--hero-accent-rgb"),
        gold: rgb("--logo-gold-rgb"),
        edge: dark ? 0.16 : 0.2,
        strong: dark ? 0.28 : 0.34,
        dot: dark ? 0.36 : 0.42,
        baseFill: dark ? 0.03 : 0.035,
        goldFill: 0.08
      };
    }

    function rebuild() {
      const cell = parseFloat(getComputedStyle(bg).getPropertyValue("--grid-cell")) || 72;
      const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 80;
      const { shapes, rand } = generateNetwork(W, H, cell, headerH, clear, mask, W < 760);
      net = {
        back: buildNetworkLayer(shapes.filter((s) => s.layer === "back"), cell, rand),
        front: buildNetworkLayer(shapes.filter((s) => s.layer === "front"), cell, rand)
      };
      flows = [];
    }

    function offset(name, tSec, animate) {
      if (!animate) return [0, 0];
      const L = LAYERS[name];
      return [L.amp * Math.sin((TAU * tSec) / L.tx + L.ph[0]), L.amp * Math.sin((TAU * tSec) / L.ty + L.ph[1])];
    }

    /* "Data flow": a gold dot runs along 3-6 connected edges, lighting what it passes. */
    function spawnFlow(now) {
      const order = Math.random() < 0.7 ? ["front", "back"] : ["back", "front"];
      for (const name of order) {
        const L = net[name];
        const starts = L.nodes.map((_, i) => i).filter((i) => L.adj[i].length);
        if (!starts.length) continue;
        for (let tries = 0; tries < 25; tries++) {
          const want = 3 + Math.floor(Math.random() * 4);
          let n = starts[Math.floor(Math.random() * starts.length)];
          const path = [n];
          const segs = [];
          const seen = new Set([n]);
          while (segs.length < want) {
            const options = L.adj[n].filter(([m]) => !seen.has(m));
            if (!options.length) break;
            const [m, e] = options[Math.floor(Math.random() * options.length)];
            path.push(m);
            segs.push(e);
            seen.add(m);
            n = m;
          }
          if (segs.length < 3) continue;
          const cum = [0];
          for (let k = 1; k < path.length; k++) {
            const a = L.nodes[path[k - 1]], b = L.nodes[path[k]];
            cum.push(cum[k - 1] + Math.hypot(b.x - a.x, b.y - a.y));
          }
          flows.push({ layer: name, path, segs, cum, start: now, dur: Math.min(4000, Math.max(2000, segs.length * 650)), reached: [], left: [] });
          return;
        }
      }
    }

    /** Per-frame flow state: dot position plus how lit each passed node/edge still is. */
    function flowState(f, now) {
      const L = net[f.layer];
      const u = Math.min(1, (now - f.start) / f.dur);
      const dist = ((1 - Math.cos(Math.PI * u)) / 2) * f.cum[f.cum.length - 1];
      let i = 0;
      while (i < f.segs.length - 1 && dist >= f.cum[i + 1]) i++;
      f.path.forEach((_, k) => {
        if (f.reached[k] === undefined && dist >= f.cum[k] - 0.01) f.reached[k] = now;
      });
      f.segs.forEach((_, k) => {
        if (f.left[k] === undefined && (dist >= f.cum[k + 1] - 0.01 || u === 1)) f.left[k] = now;
      });
      const a = L.nodes[f.path[i]], b = L.nodes[f.path[i + 1]];
      const seg = f.cum[i + 1] - f.cum[i] || 1;
      const t = Math.min(1, Math.max(0, (dist - f.cum[i]) / seg));
      const fade = Math.min(1, (now - f.start) / 250) * (u < 1 ? 1 : Math.max(0, 1 - (now - f.start - f.dur) / 350));
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, i, fade, done: u === 1 && now - f.start - f.dur > 900 };
    }

    function halo(x, y, r, alpha) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${colors.gold.join(",")},${alpha})`);
      g.addColorStop(1, `rgba(${colors.gold.join(",")},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    }

    function draw(now, animate) {
      if (!ctx || !colors || !net) return;
      const tSec = now / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const { base, gold } = colors;
      const rgba = (c, a) => `rgba(${c.join(",")},${a})`;

      if (animate) {
        if (now >= nextFlow) {
          if (flows.length < 2) spawnFlow(now);
          nextFlow = now + 3000 + Math.random() * 2000;
        }
      }
      const states = animate ? flows.map((f) => ({ f, s: flowState(f, now) })) : [];
      flows = flows.filter((f, k) => !states[k].s.done);

      ["back", "front"].forEach((name) => {
        const L = net[name];
        const S = LAYERS[name];
        const [ox, oy] = offset(name, tSec, animate);
        ctx.save();
        ctx.translate(ox, oy);

        L.fills.forEach((f) => {
          ctx.fillStyle = f.color === "gold" ? rgba(gold, colors.goldFill) : rgba(base, colors.baseFill);
          ctx.fill(f.path);
        });

        ctx.lineWidth = 1;
        ctx.strokeStyle = rgba(base, colors.edge * S.alpha);
        ctx.stroke(L.normalPath);
        ctx.strokeStyle = rgba(base, colors.strong * S.alpha);
        ctx.stroke(L.strongPath);
        ctx.fillStyle = rgba(base, colors.dot * S.dot);
        ctx.fill(L.dotPath);

        // Edges and nodes lit by a passing flow.
        const litEdges = new Map();
        const litNodes = new Map();
        const decay = (t0) => (t0 === undefined ? 0 : Math.max(0, 1 - (now - t0) / 900));
        states.filter(({ f }) => f.layer === name).forEach(({ f, s }) => {
          f.segs.forEach((e, k) => {
            const g = k === s.i && !f.left[k] ? 1 : decay(f.left[k]);
            if (g > 0) litEdges.set(e, Math.max(litEdges.get(e) || 0, g));
          });
          f.path.forEach((n, k) => {
            const g = decay(f.reached[k]);
            if (g > 0) litNodes.set(n, Math.max(litNodes.get(n) || 0, g));
          });
        });
        litEdges.forEach((g, e) => {
          const { a, b } = L.edges[e];
          ctx.strokeStyle = `rgba(${mix(base, gold, 0.75 * g)},${colors.edge * S.alpha + 0.35 * g})`;
          ctx.beginPath();
          ctx.moveTo(L.nodes[a].x, L.nodes[a].y);
          ctx.lineTo(L.nodes[b].x, L.nodes[b].y);
          ctx.stroke();
        });
        litNodes.forEach((g, n) => {
          const p = L.nodes[n];
          halo(p.x, p.y, 9, 0.35 * g);
          ctx.fillStyle = rgba(gold, 0.85 * g);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.8, 0, TAU);
          ctx.fill();
        });
        states.filter(({ f }) => f.layer === name).forEach(({ s }) => {
          halo(s.x, s.y, 11, 0.45 * s.fade);
          ctx.fillStyle = rgba(gold, s.fade);
          ctx.beginPath();
          ctx.arc(s.x, s.y, 2.2, 0, TAU);
          ctx.fill();
        });
        ctx.restore();
      });
    }

    function mix(a, b, k) {
      return `${Math.round(a[0] + (b[0] - a[0]) * k)},${Math.round(a[1] + (b[1] - a[1]) * k)},${Math.round(a[2] + (b[2] - a[2]) * k)}`;
    }

    function frame(now) {
      draw(now, true);
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (running || prefersReducedMotion || !onScreen || document.hidden || !ctx) return;
      running = true;
      nextFlow = performance.now() + 1500;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
      flows = [];
    }

    function resize() {
      W = hero.clientWidth;
      H = hero.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      rebuild();
      if (!running) draw(performance.now(), false);
    }

    /**
     * Text block / scroll cue boxes that must stay free of shapes, plus the text mask
     * ellipse (hero coordinates) so shapes aren't placed where they'd be invisible.
     */
    function setClear(boxes, textMask) {
      const key = boxes.map((b) => [b.l, b.t, b.r, b.b].map(Math.round).join(",")).join("|") +
        "|" + [textMask.cx, textMask.cy, textMask.rx, textMask.ry].map(Math.round).join(",");
      if (key === clearKey) return;
      clearKey = key;
      clear = boxes;
      mask = textMask;
      if (!ctx) return;
      rebuild();
      if (!running) draw(performance.now(), false);
    }

    function init() {
      canvas = document.getElementById("heroNetwork");
      if (!canvas || !canvas.getContext) return;
      ctx = canvas.getContext("2d");
      hero = canvas.closest(".hero");
      bg = canvas.closest(".hero-bg");
      readColors();
      resize();

      new ResizeObserver(() => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(resize);
      }).observe(hero);

      new MutationObserver(() => {
        readColors();
        if (!running) draw(performance.now(), false);
      }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
          onScreen = entries[0].isIntersecting;
          onScreen ? start() : stop();
        }).observe(hero);
      }
      document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
      start();
    }

    return { init, setClear };
  })();

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

  /**
   * Cover built from the DIAH logo itself (navy + gold on the light brand
   * ground) instead of a stock image. Used by the card and the modal.
   */
  function brandCoverHTML() {
    return `
      <div class="news-cover-grid"></div>
      <div class="brand-lockup">
        <img src="assets/logo/diah-logo-full.svg" alt="" width="220" height="87">
        <span class="brand-rule"></span>
      </div>
      <span class="brand-chip">${escapeHTML(t("news.chapter"))}</span>`;
  }

  function newsCoverAttrs(cls, article, index) {
    return article.cover === "brand"
      ? `class="${cls} is-brand"`
      : `class="${cls}" style="--cover-gradient:${NEWS_GRADIENTS[index % NEWS_GRADIENTS.length]}"`;
  }

  function newsCardHTML(article, index) {
    const brand = article.cover === "brand";
    return `
      <article class="news-card reveal is-visible" data-id="${article.id}" tabindex="0" role="button" aria-haspopup="dialog">
        <div ${newsCoverAttrs("news-cover", article, index)}>
          ${brand ? brandCoverHTML() : `<div class="news-cover-grid"></div>`}
        </div>
        <div class="news-body">
          <span class="news-category">${escapeHTML(article.category)}</span>
          <h3>${escapeHTML(article.title)}</h3>
          <p>${escapeHTML(article.summary)}</p>
          <div class="news-meta">
            <span class="project-status"><i></i>${escapeHTML(article.type)}</span>
            ${article.date ? `<span>${formatDate(article.date)}</span>` : ""}
            <span class="project-view">${escapeHTML(t("news.readmore"))} &rarr;</span>
          </div>
        </div>
      </article>`;
  }

  function renderNews() {
    const grid = document.getElementById("newsGrid");
    const list = newsData[state.lang] || newsData.pt;
    grid.classList.toggle("is-single", list.length === 1);
    grid.innerHTML = list.map(newsCardHTML).join("");
  }

  function openNewsModal(id) {
    const list = newsData[state.lang] || newsData.pt;
    const index = list.findIndex((a) => a.id === id);
    const article = list[index];
    if (!article) return;
    const brand = article.cover === "brand";

    document.getElementById("newsModalBody").innerHTML = `
      <div ${newsCoverAttrs("mc-cover", article, index)}>
        ${brand ? brandCoverHTML() : ""}
      </div>
      <span class="mc-tag">${escapeHTML(article.category)}</span>
      <h3 class="mc-title">${escapeHTML(article.title)}</h3>
      ${article.tagline ? `<p class="mc-tagline">${escapeHTML(article.tagline)}</p>` : ""}
      <span class="mc-badge"><i></i>${escapeHTML(article.type)}</span>
      ${article.date ? `<div class="mc-meta"><span>${formatDate(article.date)}</span></div>` : ""}
      <div class="mc-section mc-article">
        ${(article.body || [article.summary]).map((p) => `<p>${escapeHTML(p)}</p>`).join("")}
      </div>
      ${article.closing ? `<p class="mc-closing">${escapeHTML(article.closing)}</p>` : ""}`;

    openModal(document.getElementById("newsModal"));
  }

  function initNews() {
    const grid = document.getElementById("newsGrid");
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".news-card");
      if (card) openNewsModal(card.dataset.id);
    });
    grid.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".news-card");
      if (!card) return;
      e.preventDefault();
      openNewsModal(card.dataset.id);
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
    initNavDropdown();
    heroHeadline.init();
    heroNetwork.init();
    initReveal();
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
