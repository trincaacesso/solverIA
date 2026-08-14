/**
 * Service worker do CT VH.
 *
 * É um programinha que o navegador roda por fora da página. Serve para
 * duas coisas aqui:
 *   1. abrir o app mesmo com internet ruim, usando o que já foi baixado
 *   2. receber notificação quando o app está fechado
 *
 * Sobre a estratégia de cache: NÃO guardamos respostas do Supabase, só
 * os arquivos do próprio app. Guardar dados daria a impressão de estar
 * funcionando enquanto mostra presença e pagamento desatualizados — pior
 * do que avisar que está sem internet.
 */

const VERSAO = "ctvh-v1";
const ESSENCIAIS = ["/arena/calendar/", "/arena/login/", "/manifest.json"];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches
      .open(VERSAO)
      // sem falhar a instalação inteira se um item não baixar
      .then((cache) => Promise.allSettled(ESSENCIAIS.map((u) => cache.add(u))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nomes) =>
        Promise.all(nomes.filter((n) => n !== VERSAO).map((n) => caches.delete(n))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (evento) => {
  const req = evento.request;

  // Só interceptamos navegação e arquivos do próprio site.
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Supabase e afins passam direto

  // Rede primeiro, cache como rede de segurança: o app é um sistema de
  // gestão, então dado novo importa mais do que abrir rápido.
  evento.respondWith(
    fetch(req)
      .then((resposta) => {
        if (resposta.ok) {
          const copia = resposta.clone();
          caches.open(VERSAO).then((cache) => cache.put(req, copia));
        }
        return resposta;
      })
      .catch(async () => {
        const doCache = await caches.match(req);
        if (doCache) return doCache;
        // navegação sem internet e sem cache: cai na tela principal
        if (req.mode === "navigate") {
          const inicial = await caches.match("/arena/calendar/");
          if (inicial) return inicial;
        }
        return new Response("Sem conexão.", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }),
  );
});

// ── Notificações ─────────────────────────────────────────────────────

self.addEventListener("push", (evento) => {
  let dados = { titulo: "CT VH", corpo: "", rota: "/arena/calendar/" };
  try {
    if (evento.data) dados = { ...dados, ...evento.data.json() };
  } catch {
    if (evento.data) dados.corpo = evento.data.text();
  }

  evento.waitUntil(
    self.registration.showNotification(dados.titulo, {
      body: dados.corpo,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { rota: dados.rota },
      // agrupa avisos do mesmo assunto em vez de empilhar
      tag: dados.tag || "ctvh-aviso",
      renotify: true,
    }),
  );
});

self.addEventListener("notificationclick", (evento) => {
  evento.notification.close();
  const rota = evento.notification.data?.rota || "/arena/calendar/";

  evento.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((janelas) => {
        // se o app já estiver aberto, aproveita a janela em vez de
        // abrir outra
        for (const janela of janelas) {
          if (janela.url.includes(self.location.origin) && "focus" in janela) {
            janela.navigate?.(rota);
            return janela.focus();
          }
        }
        return self.clients.openWindow(rota);
      }),
  );
});
