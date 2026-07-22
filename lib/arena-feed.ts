// Publicações do Instagram do CT VH exibidas no Feed (ordem de exibição).
// Para adicionar um post novo: cole a URL no TOPO da lista — todos os
// usuários logados verão a notificação de novidade até abrirem o Feed.
export const instagramPosts = [
  "https://www.instagram.com/reel/DHJHeyWxCT-/",
  "https://www.instagram.com/reel/DHWBxBVxMr-/",
  "https://www.instagram.com/p/DXo2vV9ivuk/",
  "https://www.instagram.com/p/DZU-wwylpe9/",
  "https://www.instagram.com/p/DaVZ6NnFgno/",
  "https://www.instagram.com/reel/DakvWLkun51/",
  "https://www.instagram.com/p/DY7PTimx1li/",
];

const SEEN_KEY_PREFIX = "ctvh-feed-seen:";
export const FEED_SEEN_EVENT = "ctvh-feed-seen-changed";

function seenKey(username: string) {
  return `${SEEN_KEY_PREFIX}${username}`;
}

/** Posts que o usuário ainda não viu. */
export function getUnseenPosts(username: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(seenKey(username));
    const seen = new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
    return instagramPosts.filter((url) => !seen.has(url));
  } catch {
    return instagramPosts;
  }
}

/** Marca todos os posts atuais como vistos e avisa a interface. */
export function markAllPostsSeen(username: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(seenKey(username), JSON.stringify(instagramPosts));
  window.dispatchEvent(new Event(FEED_SEEN_EVENT));
}
