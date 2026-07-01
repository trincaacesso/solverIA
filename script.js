// Ano no rodapé
document.getElementById("year").textContent = new Date().getFullYear();

// Navbar com efeito ao rolar
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Menu mobile
const toggle = document.getElementById("navToggle");
const links = document.getElementById("navLinks");
toggle.addEventListener("click", () => links.classList.toggle("open"));
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => links.classList.remove("open"))
);

// Animação de revelação ao entrar na viewport
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  io.observe(el);
});

// Contador animado nas estatísticas
const animateCount = (el) => {
  const target = +el.dataset.count;
  const dur = 1400;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const countIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countIO.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

// Formulário de contato (validação simples + feedback)
const form = document.getElementById("contactForm");
const msg = document.getElementById("formMsg");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const nome = (data.get("nome") || "").toString().trim();
  const email = (data.get("email") || "").toString().trim();
  const mensagem = (data.get("mensagem") || "").toString().trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!nome || !mensagem || !emailOk) {
    msg.textContent = "Por favor, preencha todos os campos com um e-mail válido.";
    msg.className = "form__msg err";
    return;
  }

  msg.textContent = `Obrigado, ${nome}! Recebemos sua mensagem e retornaremos em breve.`;
  msg.className = "form__msg ok";
  form.reset();
});
