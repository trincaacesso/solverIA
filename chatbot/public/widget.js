/* SolverIA embeddable chat widget.
 * Usage on any client site:
 *   <script src="https://YOUR-HOST/widget.js" data-client="demo" defer></script>
 */
(function () {
  "use strict";

  var script =
    document.currentScript ||
    (function () {
      var s = document.getElementsByTagName("script");
      return s[s.length - 1];
    })();

  var CLIENT = script.getAttribute("data-client") || "demo";
  // API base = the origin the widget was served from.
  var BASE = new URL(script.src).origin;

  var messages = []; // {role, content} — includes the greeting for context
  var open = false;
  var busy = false;
  var cfg = null;

  /* ---------- styles ---------- */
  function injectStyles(brand, accent) {
    var css =
      ":root{--sia-brand:" + brand + ";--sia-accent:" + accent + ";}" +
      ".sia-launcher{position:fixed;right:20px;bottom:20px;z-index:2147483000;display:flex;align-items:center;gap:10px;border:none;cursor:pointer;border-radius:999px;padding:14px 18px;color:#06122a;font-weight:700;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;background:linear-gradient(120deg,var(--sia-brand),var(--sia-accent));box-shadow:0 12px 34px -10px rgba(124,92,255,.6);transition:transform .2s ease,box-shadow .2s ease}" +
      ".sia-launcher:hover{transform:translateY(-2px);box-shadow:0 18px 44px -12px rgba(34,211,238,.6)}" +
      ".sia-launcher svg{width:20px;height:20px}" +
      ".sia-panel{position:fixed;right:20px;bottom:20px;z-index:2147483001;width:380px;max-width:calc(100vw - 32px);height:600px;max-height:calc(100vh - 40px);display:flex;flex-direction:column;overflow:hidden;border-radius:20px;background:#0b0e1c;color:#eef1fb;border:1px solid rgba(255,255,255,.1);box-shadow:0 30px 80px -20px rgba(0,0,0,.7);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;opacity:0;transform:translateY(16px) scale(.98);transition:opacity .25s ease,transform .25s ease;pointer-events:none}" +
      ".sia-panel.sia-on{opacity:1;transform:none;pointer-events:auto}" +
      ".sia-head{display:flex;align-items:center;gap:12px;padding:16px 18px;background:linear-gradient(120deg,var(--sia-brand),var(--sia-accent));color:#06122a}" +
      ".sia-head .sia-av{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:rgba(6,18,42,.15);flex:none}" +
      ".sia-head b{font-size:15px;display:block;line-height:1.2}" +
      ".sia-head span{font-size:12px;opacity:.8}" +
      ".sia-x{margin-left:auto;background:none;border:none;color:#06122a;cursor:pointer;font-size:20px;line-height:1;opacity:.7;padding:4px}" +
      ".sia-x:hover{opacity:1}" +
      ".sia-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}" +
      ".sia-msg{max-width:82%;padding:10px 13px;border-radius:16px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}" +
      ".sia-bot{align-self:flex-start;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08)}" +
      ".sia-me{align-self:flex-end;background:linear-gradient(120deg,var(--sia-brand),var(--sia-accent));color:#06122a;font-weight:500}" +
      ".sia-typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px}" +
      ".sia-typing i{width:7px;height:7px;border-radius:50%;background:#8b94b8;animation:sia-b 1s infinite}" +
      ".sia-typing i:nth-child(2){animation-delay:.15s}.sia-typing i:nth-child(3){animation-delay:.3s}" +
      "@keyframes sia-b{0%,80%,100%{opacity:.3;transform:translateY(0)}40%{opacity:1;transform:translateY(-4px)}}" +
      ".sia-quick{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 8px}" +
      ".sia-quick button{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:#cdd4ee;border-radius:999px;padding:7px 12px;font-size:12px;cursor:pointer;transition:.15s}" +
      ".sia-quick button:hover{border-color:var(--sia-accent);color:#fff}" +
      ".sia-foot{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.08)}" +
      ".sia-foot input{flex:1;background:#05060c;border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:11px 13px;color:#fff;font-size:14px;outline:none;font-family:inherit}" +
      ".sia-foot input:focus{border-color:var(--sia-brand)}" +
      ".sia-send{border:none;cursor:pointer;border-radius:12px;width:44px;flex:none;display:grid;place-items:center;color:#06122a;background:linear-gradient(120deg,var(--sia-brand),var(--sia-accent))}" +
      ".sia-send:disabled{opacity:.5;cursor:default}" +
      ".sia-wa{margin:0 16px 10px;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;background:rgba(37,211,102,.12);border:1px solid rgba(37,211,102,.4);color:#4ade80;border-radius:12px;padding:9px;font-size:13px;font-weight:600}" +
      ".sia-body::-webkit-scrollbar{width:6px}.sia-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:99px}";
    var el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
  }

  var CHAT_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  var SEND_ICON =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';

  var launcher, panel, body, input, sendBtn, quickWrap;

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function scrollDown() {
    body.scrollTop = body.scrollHeight;
  }

  function addBubble(role) {
    var b = document.createElement("div");
    b.className = "sia-msg " + (role === "user" ? "sia-me" : "sia-bot");
    body.appendChild(b);
    scrollDown();
    return b;
  }

  function typing(on) {
    var ex = body.querySelector(".sia-typing");
    if (on && !ex) {
      var t = document.createElement("div");
      t.className = "sia-typing sia-msg sia-bot";
      t.innerHTML = "<i></i><i></i><i></i>";
      body.appendChild(t);
      scrollDown();
    } else if (!on && ex) {
      ex.remove();
    }
  }

  function toggle(force) {
    open = force === undefined ? !open : force;
    panel.classList.toggle("sia-on", open);
    launcher.style.display = open ? "none" : "flex";
    if (open) setTimeout(function () { input.focus(); }, 200);
  }

  function renderQuickReplies() {
    quickWrap.innerHTML = "";
    if (!cfg.quickReplies || messages.length > 1) return;
    cfg.quickReplies.forEach(function (q) {
      var b = document.createElement("button");
      b.textContent = q;
      b.onclick = function () { sendMessage(q); };
      quickWrap.appendChild(b);
    });
  }

  async function sendMessage(text) {
    text = (text || input.value).trim();
    if (!text || busy) return;
    input.value = "";
    quickWrap.innerHTML = "";
    messages.push({ role: "user", content: text });
    addBubble("user").textContent = text;
    busy = true;
    sendBtn.disabled = true;
    typing(true);

    var bubble = null;
    var acc = "";

    try {
      var resp = await fetch(BASE + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client: CLIENT, messages: messages }),
      });
      if (!resp.ok || !resp.body) throw new Error("bad response");

      var reader = resp.body.getReader();
      var dec = new TextDecoder();
      var buf = "";

      while (true) {
        var chunk = await reader.read();
        if (chunk.done) break;
        buf += dec.decode(chunk.value, { stream: true });
        var parts = buf.split("\n\n");
        buf = parts.pop();
        for (var i = 0; i < parts.length; i++) {
          var ev = "message", data = "";
          parts[i].split("\n").forEach(function (line) {
            if (line.indexOf("event:") === 0) ev = line.slice(6).trim();
            else if (line.indexOf("data:") === 0) data += line.slice(5).trim();
          });
          if (ev === "delta") {
            var d = JSON.parse(data);
            if (!bubble) { typing(false); bubble = addBubble("assistant"); }
            acc += d.text;
            bubble.textContent = acc;
            scrollDown();
          } else if (ev === "error") {
            typing(false);
            if (!bubble) bubble = addBubble("assistant");
            bubble.textContent = JSON.parse(data).message;
          }
        }
      }
    } catch (e) {
      typing(false);
      if (!bubble) bubble = addBubble("assistant");
      bubble.textContent = "Desculpe, não consegui responder agora. Tente novamente em instantes.";
    } finally {
      typing(false);
      if (acc) messages.push({ role: "assistant", content: acc });
      busy = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  function build() {
    injectStyles(cfg.brandColor, cfg.accentColor);

    launcher = document.createElement("button");
    launcher.className = "sia-launcher";
    launcher.innerHTML = CHAT_ICON + "<span>" + esc(cfg.launcherText) + "</span>";
    launcher.onclick = function () { toggle(true); };
    document.body.appendChild(launcher);

    panel = document.createElement("div");
    panel.className = "sia-panel";
    panel.innerHTML =
      '<div class="sia-head"><div class="sia-av">' + CHAT_ICON + "</div>" +
      "<div><b>" + esc(cfg.name) + "</b><span>Responde na hora • IA</span></div>" +
      '<button class="sia-x" aria-label="Fechar">×</button></div>' +
      '<div class="sia-body"></div>' +
      '<div class="sia-quick"></div>' +
      (cfg.whatsapp
        ? '<a class="sia-wa" target="_blank" rel="noopener" href="https://wa.me/' +
          esc(cfg.whatsapp) +
          '">Prefere WhatsApp? Falar agora</a>'
        : "") +
      '<div class="sia-foot"><input type="text" placeholder="Escreva sua mensagem…" />' +
      '<button class="sia-send">' + SEND_ICON + "</button></div>";
    document.body.appendChild(panel);

    body = panel.querySelector(".sia-body");
    input = panel.querySelector(".sia-foot input");
    sendBtn = panel.querySelector(".sia-send");
    quickWrap = panel.querySelector(".sia-quick");

    panel.querySelector(".sia-x").onclick = function () { toggle(false); };
    sendBtn.onclick = function () { sendMessage(); };
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); sendMessage(); }
    });

    // greeting
    messages.push({ role: "assistant", content: cfg.greeting });
    addBubble("assistant").textContent = cfg.greeting;
    renderQuickReplies();
  }

  fetch(BASE + "/api/config?client=" + encodeURIComponent(CLIENT))
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(function (c) {
      cfg = c;
      if (document.body) build();
      else window.addEventListener("DOMContentLoaded", build);
    })
    .catch(function () {
      console.error("[SolverIA] Could not load chatbot config for client '" + CLIENT + "'.");
    });
})();
