import express from "express";
import cors from "cors";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8787;

// Default model. Opus 4.8 is the most capable; for a high-volume sales bot you can
// switch to a cheaper model per client (see clients/*.json "model" field), e.g.
// "claude-haiku-4-5" ($1/$5 per 1M tok) or "claude-sonnet-5" ($3/$15).
const DEFAULT_MODEL = process.env.MODEL || "claude-opus-4-8";

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn(
    "⚠  ANTHROPIC_API_KEY is not set — the server starts, but /api/chat will fail until you set it.",
  );
}

// SDK reads ANTHROPIC_API_KEY from the environment automatically.
const anthropic = new Anthropic();

/* ---------------- Client configs (multi-tenant) ---------------- */
const clientsDir = path.join(__dirname, "clients");

function loadClients() {
  const map = new Map();
  if (!fs.existsSync(clientsDir)) return map;
  for (const file of fs.readdirSync(clientsDir)) {
    if (!file.endsWith(".json")) continue;
    try {
      const cfg = JSON.parse(fs.readFileSync(path.join(clientsDir, file), "utf8"));
      if (cfg.id) map.set(cfg.id, cfg);
    } catch (e) {
      console.error(`Failed to load client config ${file}:`, e.message);
    }
  }
  return map;
}
let clients = loadClients();

/* ---------------- App ---------------- */
const app = express();
app.use(cors()); // widget is embedded on client domains — allow cross-origin
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

// Public config for the widget (never exposes the system prompt / business data).
app.get("/api/config", (req, res) => {
  const cfg = clients.get(String(req.query.client || ""));
  if (!cfg) return res.status(404).json({ error: "unknown client" });
  res.json({
    id: cfg.id,
    name: cfg.name,
    brandColor: cfg.brandColor || "#7c5cff",
    accentColor: cfg.accentColor || "#22d3ee",
    greeting: cfg.greeting || "Olá! 👋 Como posso ajudar?",
    whatsapp: cfg.whatsapp || null,
    quickReplies: Array.isArray(cfg.quickReplies) ? cfg.quickReplies.slice(0, 4) : [],
    launcherText: cfg.launcherText || "Fale com a gente",
  });
});

function buildSystem(cfg) {
  return [
    `You are ${cfg.name}'s AI sales & support assistant, embedded on their website.`,
    `Reply in the SAME language the customer writes in (default: Brazilian Portuguese).`,
    `Be warm, concise and helpful. Keep answers to 2-4 short sentences unless more detail is genuinely needed.`,
    `Your goals: answer questions, qualify the lead, and guide the customer toward buying or booking.`,
    cfg.whatsapp
      ? `When the customer wants to talk to a human, buy, or schedule, invite them to WhatsApp: https://wa.me/${cfg.whatsapp}`
      : "",
    `Never invent prices, availability, or policies that are not stated below. If you don't know, offer to connect them with the team.`,
    `Answer with your final response only — do not show your reasoning or meta-commentary.`,
    ``,
    `# Business information`,
    cfg.systemPrompt || "",
  ]
    .filter(Boolean)
    .join("\n");
}

app.post("/api/chat", async (req, res) => {
  const { client, messages } = req.body || {};
  const cfg = clients.get(String(client || ""));
  if (!cfg) return res.status(404).json({ error: "unknown client" });

  // Sanitize history: only user/assistant string turns, drop leading assistant
  // turns (the API requires the first message to be from the user), cap length.
  let history = (Array.isArray(messages) ? messages : [])
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim(),
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
  while (history.length && history[0].role === "assistant") history.shift();
  history = history.slice(-20);
  if (!history.length) return res.status(400).json({ error: "no user message" });

  // Stream the reply to the browser as Server-Sent Events.
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  });
  const send = (event, data) =>
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  try {
    const stream = anthropic.messages.stream({
      model: cfg.model || DEFAULT_MODEL,
      max_tokens: 1024,
      system: buildSystem(cfg),
      messages: history,
    });
    stream.on("text", (delta) => send("delta", { text: delta }));
    await stream.finalMessage();
    send("done", {});
  } catch (err) {
    console.error("chat error:", err?.message || err);
    send("error", { message: "Desculpe, tive um problema agora. Pode tentar de novo?" });
  } finally {
    res.end();
  }
});

app.get("/health", (_req, res) =>
  res.json({ ok: true, model: DEFAULT_MODEL, clients: [...clients.keys()] }),
);

app.listen(PORT, () => {
  console.log(
    `SolverIA chatbot on :${PORT} — model ${DEFAULT_MODEL} — clients: ${
      [...clients.keys()].join(", ") || "(none)"
    }`,
  );
});
