const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const hero = document.querySelector(".hero");
const processSteps = document.querySelectorAll(".process-step");
const processVisual = document.querySelector(".process-visual");
const processImage = document.querySelector(".process-visual img");
const processKicker = document.querySelector(".process-kicker");
const processTitle = document.querySelector(".process-visual strong");
const processDescription = document.querySelector(".process-visual small");
const processProgress = document.querySelector(".process-progress span");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const processDetails = Array.from(processSteps).map((step, index) => ({
  kicker: `Step ${String(index + 1).padStart(2, "0")} of ${String(processSteps.length).padStart(2, "0")}`,
  title: step.querySelector("h3")?.textContent ?? "",
  description: step.querySelector("p")?.textContent ?? "",
  image: step.dataset.image ?? "",
  alt: step.dataset.alt ?? "",
}));
const revealGroups = document.querySelectorAll(
  ".strengths, .product-grid, .why-grid, .process-list, .country-tags, .metric-row, .client-proof-grid"
);
const revealItems = document.querySelectorAll(
  ".client-marquee, .section-heading, .split-section > *, .process-visual, .clients-copy, .client-proof, .clients-section blockquote, .export-content > *, .contact-section > *, .strength-card, .product-card, .why-grid article, .process-step, .country-tags > span, .metric-row > div"
);

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});

if (!prefersReducedMotion) {
  hero?.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;

    hero.style.setProperty("--hero-x", x.toFixed(2));
    hero.style.setProperty("--hero-y", y.toFixed(2));
  });

  hero?.addEventListener("pointerleave", () => {
    hero.style.setProperty("--hero-x", "0");
    hero.style.setProperty("--hero-y", "0");
  });
}

const setActiveProcessStep = (index) => {
  const detail = processDetails[index];

  if (!detail || !processVisual || !processImage || !processKicker || !processTitle || !processDescription || !processProgress) {
    return;
  }

  processSteps.forEach((step, stepIndex) => {
    const isActive = stepIndex === index;
    step.classList.toggle("is-active", isActive);
    step.setAttribute("aria-pressed", String(isActive));
  });

  processVisual.classList.add("is-switching");

  window.setTimeout(() => {
    processImage.src = detail.image;
    processImage.alt = detail.alt;
    processKicker.textContent = detail.kicker;
    processTitle.textContent = detail.title;
    processDescription.textContent = detail.description;
    processProgress.style.width = `${((index + 1) / processDetails.length) * 100}%`;
    processVisual.classList.remove("is-switching");
  }, 160);
};

processSteps.forEach((step, index) => {
  step.addEventListener("click", () => setActiveProcessStep(index));
  step.addEventListener("mouseenter", () => setActiveProcessStep(index));
});

revealGroups.forEach((group) => {
  group.classList.add("reveal-stagger");
  Array.from(group.children).forEach((child, index) => {
    child.style.setProperty("--reveal-index", index);
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal");
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
  });
}
