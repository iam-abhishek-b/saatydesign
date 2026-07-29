/* ============================================================
   SAATY DESIGN — CONFIG
   Update these when real business details change.
   ============================================================ */
const CONFIG = {
  whatsappNumber: "919187189813", // +91 91871 89813, digits only for wa.me
  whatsappMessage: "Hi SAATY DESIGN, I'd like to book a consultation.",
  instagramUrl: "https://www.instagram.com/saaty_designs2026?igsh=MWppMGNlNGlxaXc2Yw==",
  phoneDisplay: "+91 91 87189 813",
  email: "hello@saatydesign.com",
  address: "1st Floor, Above Vetic Clinic, 283, MIG, 1st Phase, 15th A Cross, Yelahanka New Town, Bengaluru 560064",
  hours: "Monday–Saturday, 10:00 AM–5:30 PM"
};

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initLenisAndScrollTrigger();
  initNav();
  initHeroReveal();
  initScrollReveals();
  initThread();
  initMagnetic();
  initCustomizer();
  initStories();
  const yearEl = document.getElementById("year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ---------------- Config wiring ---------------- */
function applyConfig(){
  const waLink = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;

  ["ctaWhatsapp", "footerWhatsapp"].forEach(id => {
    const el = document.getElementById(id);
    if(el){ el.href = waLink; el.target = "_blank"; el.rel = "noopener"; }
  });
  const igEl = document.getElementById("footerInstagram");
  if(igEl){ igEl.href = CONFIG.instagramUrl; }

  const phoneEl = document.getElementById("footerPhone");
  if(phoneEl) phoneEl.textContent = CONFIG.phoneDisplay;
  const emailEl = document.getElementById("footerEmail");
  if(emailEl) emailEl.textContent = CONFIG.email;
  const addrEl = document.getElementById("footerAddress");
  if(addrEl) addrEl.textContent = CONFIG.address;
  const hoursEl = document.getElementById("footerHours");
  if(hoursEl) hoursEl.textContent = CONFIG.hours;
}

/* ---------------- Lenis + ScrollTrigger ---------------- */
function initLenisAndScrollTrigger(){
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(prefersReduced || typeof Lenis === "undefined"){
    ScrollTrigger.refresh();
    return;
  }

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  window._lenis = lenis;
}

/* ---------------- Nav ---------------- */
function initNav(){
  const nav = document.getElementById("siteNav");
  const toggle = document.getElementById("navToggle");
  const mobile = document.getElementById("navMobile");
  const overlay = document.getElementById("navOverlay");

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  const setMenuOpen = (isOpen) => {
    mobile.classList.toggle("is-open", isOpen);
    overlay.classList.toggle("is-open", isOpen);
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.documentElement.classList.toggle("menu-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  };

  toggle.addEventListener("click", () => {
    setMenuOpen(!mobile.classList.contains("is-open"));
  });

  overlay.addEventListener("click", () => {
    setMenuOpen(false);
  });

  mobile.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if(event.key === "Escape" && mobile.classList.contains("is-open")){
      setMenuOpen(false);
    }
  });
}

/* ---------------- Hero — shows immediately, no opening animation ---------------- */
function initHeroReveal(){
  gsap.set([".hero .eyebrow", ".hero__title", ".hero__sub", ".hero__actions"], { opacity: 1, y: 0 });
  gsap.from([".hero .eyebrow", ".hero__title", ".hero__sub", ".hero__actions"], {
    opacity: 0, y: 10, duration: 0.6, ease: "power2.out", stagger: 0.06
  });
}

/* ---------------- Generic scroll reveals ---------------- */
function initScrollReveals(){
  const items = gsap.utils.toArray("[data-reveal]");
  items.forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true }
    });
  });

  gsap.utils.toArray(".craft__step").forEach((el, i) => {
    gsap.fromTo(el, { opacity:0, y:24 }, {
      opacity:1, y:0, duration:.9, ease:"power3.out", delay: (i % 4) * 0.06,
      scrollTrigger: { trigger: el, start:"top 90%", once:true }
    });
  });
}

/* ---------------- Signature thread — flows from the stitching-machine badge ---------------- */
function initThread(){
  const layer = document.getElementById("threadLayer");
  const svg = document.getElementById("threadSvg");
  const path = document.getElementById("threadPath");
  const needle = document.getElementById("threadNeedle");
  if(!layer || window.innerWidth <= 860) return;

  const originY = 113; // aligns with the machine badge near the top of the page
  const originX = 36;

  function buildPath(){
    const docHeight = document.body.scrollHeight;
    const width = 160;
    svg.setAttribute("width", width);
    svg.setAttribute("height", docHeight);
    svg.style.left = (originX - width/2) + "px";

    const amplitude = 34;
    const wavelength = 520;
    let d = `M ${width/2} ${originY}`;
    const steps = Math.ceil((docHeight - originY) / 40);
    for(let i = 1; i <= steps; i++){
      const y = originY + i * 40;
      const x = width/2 + Math.sin((y - originY) / wavelength * Math.PI * 2) * amplitude;
      d += ` L ${x.toFixed(1)} ${y}`;
    }
    path.setAttribute("d", d);

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    return length;
  }

  let pathLength = buildPath();

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    scrub: 0.6,
    onUpdate: (self) => {
      const offset = pathLength * (1 - self.progress);
      path.style.strokeDashoffset = offset;
    }
  });

  gsap.to(needle, {
    motionPath: {
      path: path,
      align: path,
      alignOrigin: [0.5, 0.5],
      autoRotate: 90
    },
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6
    }
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      pathLength = buildPath();
      ScrollTrigger.refresh();
    }, 250);
  });
}

/* ---------------- Magnetic buttons ---------------- */
function initMagnetic(){
  if(window.matchMedia("(pointer: coarse)").matches) return;
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      gsap.to(btn, { x: x * 0.28, y: y * 0.5, duration: .4, ease: "power2.out" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: .5, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* ---------------- Customization panel ---------------- */
function initCustomizer(){
  const groups = document.querySelectorAll("[data-group]");
  const summary = document.getElementById("customSummary");
  if(!groups.length) return;

  const state = { fabric: "Silk", colour: "Burgundy", embroidery: "Zardozi" };

  groups.forEach((group) => {
    const key = group.dataset.group;
    group.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if(!btn) return;
      group.querySelectorAll("button").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state[key] = btn.dataset.value;
      updateSummary();
    });
  });

  function updateSummary(){
    summary.textContent = `${state.fabric}, in ${state.colour}, with ${state.embroidery} embroidery.`;
  }
}

/* ---------------- Stories & Portfolio: tabs + filters ---------------- */
function initStories(){
  const tabs = document.querySelectorAll(".stories__tab");
  const panels = document.querySelectorAll(".stories__panel");
  const chips = document.querySelectorAll(".stories__chip");
  if(!tabs.length) return;

  let activeTab = "photos";
  let activeFilter = "all";

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeTab = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle("is-active", t === tab));
      tabs.forEach(t => t.setAttribute("aria-selected", t === tab ? "true" : "false"));
      panels.forEach(p => { p.hidden = p.dataset.panel !== activeTab; });
      playVisibleReels();
    });
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      activeFilter = chip.dataset.chip;
      chips.forEach(c => c.classList.toggle("is-active", c === chip));
      applyFilter();
    });
  });

  function applyFilter(){
    document.querySelectorAll(".story-item, .reel").forEach((item) => {
      const match = activeFilter === "all" || item.dataset.category === activeFilter;
      item.classList.toggle("is-hidden", !match);
    });
    playVisibleReels();
  }

  function playVisibleReels(){
    document.querySelectorAll(".reel video").forEach((video) => {
      const item = video.closest(".reel");
      const visible = activeTab === "videos" && !item.classList.contains("is-hidden");
      if(visible){
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }

  // Autoplay reels gently when they scroll into view
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target.querySelector("video");
      if(!video) return;
      if(entry.isIntersecting){
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.35 });
  document.querySelectorAll(".reel").forEach(r => io.observe(r));
}
