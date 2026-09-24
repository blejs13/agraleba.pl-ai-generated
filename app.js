const config = window.SITE_CONFIG;

function getValue(path) {
  return path.split(".").reduce((value, key) => value?.[key], config);
}

function bindContent() {
  document.querySelectorAll("[data-bind]").forEach((element) => {
    const value = getValue(element.dataset.bind);
    if (value !== undefined) {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-link]").forEach((element) => {
    const value = getValue(element.dataset.link);
    if (value) {
      element.href = value;
    } else {
      element.hidden = true;
    }
  });

  document.querySelectorAll("[data-image]").forEach((element) => {
    const value = getValue(element.dataset.image);
    if (value) element.src = value;
  });

  const phoneHref = `tel:${config.booking.phone.replace(/[^+\d]/g, "")}`;
  document.querySelectorAll("[data-phone-link]").forEach((element) => {
    element.href = phoneHref;
  });
}

function toggleSections() {
  document.querySelectorAll("[data-section]").forEach((section) => {
    const isEnabled = getValue(`${section.dataset.section}.enabled`) === true;
    section.hidden = !isEnabled;
  });

  syncSectionLinks();
}

function syncSectionLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const target = document.getElementById(link.getAttribute("href").slice(1));
    link.hidden = !target || Boolean(target.closest("[hidden]"));
  });
}

function renderGarden() {
  const images = config.garden?.images;
  if (!config.garden?.enabled || !Array.isArray(images) || !images.length) {
    document.querySelector("#ogrod").hidden = true;
    return;
  }
  images.forEach((entry) => {
    const figure = document.createElement("figure");
    const picture = createPicture(entry);
    const image = picture.querySelector("img");
    image.width = 400;
    image.height = 600;
    const caption = document.createElement("figcaption");
    caption.textContent = entry.caption;
    figure.append(picture, caption);
    document.querySelector("#garden-images").append(figure);
  });
}

function setupPayment() {
  const input = document.querySelector("#bank-account");
  const account = config.payment?.account;
  if (!config.payment?.enabled || typeof account !== "string" || !/^\d{26}$/.test(account.replace(/\s/g, ""))) {
    document.querySelector("#przelew").hidden = true;
    return;
  }
  input.value = account;
  document.querySelector("#copy-account").addEventListener("click", async () => {
    const status = document.querySelector("#copy-status");
    try {
      await navigator.clipboard.writeText(account.replace(/\s/g, ""));
      status.textContent = "Numer rachunku skopiowany.";
    } catch {
      input.focus();
      input.select();
      status.textContent = "Zaznaczono numer. Skopiuj go z pola rachunku.";
    }
  });
}

function setupMap() {
  let url;
  try {
    url = new URL(config.map?.embedUrl);
    if (url.protocol !== "https:" || !["maps.google.com", "www.google.com"].includes(url.hostname)) throw new Error("Invalid map URL");
  } catch {
    document.querySelector("#mapa").hidden = true;
    return;
  }
  if (!config.map?.enabled) return;
  const frame = document.createElement("iframe");
  frame.title = "Mapa Łeby i jezior Łebsko oraz Sarbsko z lokalizacją Zielonego Ogrodu";
  frame.src = url.href;
  frame.referrerPolicy = "no-referrer-when-downgrade";
  frame.allowFullscreen = true;
  document.querySelector("#map-frame").replaceChildren(frame);
}

function setupReveals() {
  const sections = [...document.querySelectorAll("main > section:not(.hero)")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!("IntersectionObserver" in window) || reducedMotion.matches) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("reveal-pending");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -120px 0px" });
  sections.filter((section) => !section.hidden).forEach((section) => {
    section.classList.add("reveal", "reveal-pending");
    observer.observe(section);
  });
  document.addEventListener("focusin", (event) => event.target.closest(".reveal")?.classList.remove("reveal-pending"));
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      sections.forEach((section) => section.classList.remove("reveal-pending"));
      observer.disconnect();
    }
  });
}

function setupReviews() {
  const section = document.querySelector("#opinie");
  const stage = document.querySelector("#review-stage");
  const settings = config.reviews;
  const hasScore = (item) => Number.isFinite(item.score) && Number.isFinite(item.maxScore) &&
    item.maxScore > 0 && item.score >= 0 && item.score <= item.maxScore;
  const items = Array.isArray(settings?.items) ? settings.items.filter((item) =>
    item && typeof item.text === "string" && item.text.trim() &&
    typeof item.source === "string" && item.source.trim() &&
    (hasScore(item) || (Number.isInteger(item.stars) && item.stars >= 1 && item.stars <= 5))
  ) : [];
  if (!settings?.enabled || !items.length) {
    section.hidden = true;
    return;
  }
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const summary = settings.summary;
  const summaryElement = document.querySelector("#reviews-summary");
  const formatScore = (value) => value.toLocaleString("pl-PL");
  if (summary && hasScore(summary) && Number.isInteger(summary.count) && summary.count > 0 &&
    typeof summary.source === "string" && summary.source.trim()) {
    summaryElement.textContent = `${summary.source}: ${formatScore(summary.score)}/${formatScore(summary.maxScore)} · Liczba opinii: ${summary.count}`;
    summaryElement.hidden = false;
  }
  const interval = Number.isFinite(settings.intervalMs) ? Math.max(3000, settings.intervalMs) : 3000;
  let visible = false;
  let hovered = false;
  let focused = false;
  let timer;
  let current = -1;
  let remaining = [];

  const slides = items.map((item) => {
    const slide = document.createElement("figure");
    slide.className = "review-slide";
    const stars = document.createElement("div");
    if (hasScore(item)) {
      stars.className = "review-score";
      stars.textContent = `${formatScore(item.score)}/${formatScore(item.maxScore)}`;
      stars.setAttribute("aria-label", `Ocena ${formatScore(item.score)} na ${formatScore(item.maxScore)}`);
      const icon = document.createElement("img");
      icon.src = "assets/icons/star.svg";
      icon.alt = "";
      icon.width = 22;
      icon.height = 22;
      stars.prepend(icon);
    } else {
      stars.className = "review-stars";
      stars.setAttribute("role", "img");
      stars.setAttribute("aria-label", `${item.stars} z 5 gwiazdek`);
      stars.textContent = "★".repeat(item.stars) + "☆".repeat(5 - item.stars);
    }
    const quote = document.createElement("blockquote");
    quote.textContent = item.text;
    const caption = document.createElement("figcaption");
    const author = typeof item.author === "string" ? item.author.trim() : "";
    caption.textContent = author ? `${author} · ${item.source}` : item.source;
    slide.append(stars, quote, caption);
    stage.append(slide);
    return slide;
  });

  function showNext() {
    if (!remaining.length) remaining = items.map((item, index) => index);
    const choices = remaining.filter((index) => index !== current);
    const chosen = choices.length ? choices[Math.floor(Math.random() * choices.length)] : remaining[0];
    remaining = remaining.filter((index) => index !== chosen);
    current = chosen;
    slides.forEach((slide, index) => {
      const active = index === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
  }

  function schedule() {
    clearTimeout(timer);
    if (items.length > 1 && !reducedMotion.matches && visible && !hovered && !focused && !document.hidden) {
      timer = setTimeout(() => { showNext(); schedule(); }, interval);
    }
  }

  section.addEventListener("mouseenter", () => { hovered = true; schedule(); });
  section.addEventListener("mouseleave", () => { hovered = false; schedule(); });
  section.addEventListener("focusin", () => { focused = true; schedule(); });
  section.addEventListener("focusout", (event) => {
    if (!section.contains(event.relatedTarget)) {
      focused = false;
      schedule();
    }
  });
  document.addEventListener("visibilitychange", schedule);
  reducedMotion.addEventListener("change", schedule);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      schedule();
    }, { threshold: 0.2 }).observe(section);
  } else {
    visible = true;
  }
  showNext();
  schedule();
}

function createPicture(entry) {
  const picture = document.createElement("picture");
  if (entry.mobileSrc) {
    const source = document.createElement("source");
    source.media = "(max-width: 700px)";
    source.srcset = entry.mobileSrc;
    picture.append(source);
  }
  const image = document.createElement("img");
  image.src = entry.src;
  image.alt = entry.alt;
  image.width = 900;
  image.height = 600;
  image.loading = "lazy";
  image.decoding = "async";
  picture.append(image);
  return picture;
}

function renderRooms() {
  if (!config.rooms?.enabled) return;
  document.querySelector("#room-photo").append(createPicture(config.rooms.image));
  config.rooms.amenityGroups.forEach((group) => {
    const container = document.createElement("div");
    const heading = document.createElement("h3");
    heading.textContent = group.heading;
    const list = document.createElement("ul");
    list.className = "amenity-list";
    group.items.forEach((amenity) => {
      const item = document.createElement("li");
      item.textContent = amenity;
      list.append(item);
    });
    container.append(heading, list);
    document.querySelector("#amenity-groups").append(container);
  });
}

function renderPrices() {
  const priceList = document.querySelector("#price-list");
  config.pricing.rows.forEach((row) => {
    const item = document.createElement("div");
    item.className = "price-row";
    item.innerHTML = `<span>${row.name}</span><strong>${row.price}<small>${row.unit}</small></strong>`;
    priceList.append(item);
  });
}

function renderGallery() {
  const usedImages = new Set([
    ...(config.hero?.enabled ? [config.hero.image] : []),
    ...(config.rooms?.enabled ? [config.rooms.image?.src] : []),
    ...(config.contact?.enabled ? [config.contact.image?.src] : []),
    ...(config.garden?.enabled ? config.garden.images.map((image) => image.src) : [])
  ]);
  const images = (config.gallery?.images || []).filter((image) => {
    if (!image?.src || usedImages.has(image.src)) return false;
    usedImages.add(image.src);
    return true;
  });
  if (!config.gallery?.enabled || !images.length) {
    document.querySelector("#galeria").hidden = true;
    return;
  }
  const track = document.querySelector("#gallery-track");
  const previous = document.querySelector("#gallery-prev");
  const next = document.querySelector("#gallery-next");
  const counter = document.querySelector("#gallery-counter");
  const caption = document.querySelector("#gallery-caption");
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = lightbox.querySelector(":scope > img");
  const lightboxCaption = lightbox.querySelector("p");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let current = 0;

  const slides = images.map((image, index) => {
    const button = document.createElement("button");
    button.className = "gallery-slide";
    button.type = "button";
    button.setAttribute("aria-label", `Zdjęcie ${index + 1} z ${images.length}. Powiększ: ${image.caption}`);
    button.title = `Powiększ zdjęcie: ${image.caption}`;
    button.append(createPicture(image));
    button.addEventListener("click", () => {
      lightboxImage.src = button.querySelector("img").currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = image.caption;
      lightbox.showModal();
    });
    track.append(button);
    return button;
  });

  function updateControls() {
    counter.textContent = `${current + 1} / ${images.length}`;
    caption.textContent = images[current].caption;
    previous.disabled = current === 0;
    next.disabled = current === images.length - 1;
    slides.forEach((slide, index) => { slide.tabIndex = index === current ? 0 : -1; });
  }

  function goTo(index) {
    const target = Math.max(0, Math.min(images.length - 1, index));
    track.scrollTo({ left: target * track.clientWidth, behavior: reducedMotion.matches ? "instant" : "smooth" });
  }

  previous.addEventListener("click", () => goTo(current - 1));
  next.addEventListener("click", () => goTo(current + 1));
  track.addEventListener("scroll", () => {
    const index = Math.max(0, Math.min(images.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
    if (index !== current) {
      current = index;
      updateControls();
    }
  }, { passive: true });
  track.addEventListener("keydown", (event) => {
    const targets = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: images.length - 1 };
    if (Object.hasOwn(targets, event.key)) {
      event.preventDefault();
      track.focus({ preventScroll: true });
      goTo(targets[event.key]);
    }
  });
  new ResizeObserver(() => track.scrollTo({ left: current * track.clientWidth, behavior: "instant" })).observe(track);
  updateControls();

  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      lightbox.close();
    }
  });
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}

function renderDistances() {
  const distanceList = document.querySelector("#distance-list");
  config.location.distances.forEach((distance) => {
    const item = document.createElement("li");
    item.innerHTML = `<span>${distance.label}</span><strong>${distance.value}</strong>`;
    distanceList.append(item);
  });
}

function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-nav");
  function setMenuOpen(isOpen) {
    const label = isOpen ? "Zamknij menu" : "Otwórz menu";
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
    navigation.classList.toggle("is-open", isOpen);
  }
  toggle.addEventListener("click", () => {
    setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  navigation.addEventListener("click", () => setMenuOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) setMenuOpen(false);
  });
  window.matchMedia("(min-width: 1001px)").addEventListener("change", () => setMenuOpen(false));
}

bindContent();
toggleSections();
renderRooms();
if (config.contact?.enabled && config.contact.image?.src) {
  const contactPhoto = document.querySelector("#contact-photo");
  contactPhoto.append(createPicture(config.contact.image));
  contactPhoto.hidden = false;
}
renderPrices();
renderGallery();
renderDistances();
setupMenu();
renderGarden();
setupPayment();
setupMap();
setupReviews();
syncSectionLinks();
setupReveals();
document.querySelector("#current-year").textContent = new Date().getFullYear();