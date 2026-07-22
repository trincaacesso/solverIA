import { Instagram } from "lucide-react";

// Publicações do Instagram do CT VH exibidas no feed (ordem de exibição).
// Para adicionar um post novo: cole a URL aqui no topo da lista.
const instagramPosts = [
  "https://www.instagram.com/reel/DHJHeyWxCT-/",
  "https://www.instagram.com/reel/DHWBxBVxMr-/",
  "https://www.instagram.com/p/DXo2vV9ivuk/",
  "https://www.instagram.com/p/DZU-wwylpe9/",
  "https://www.instagram.com/p/DaVZ6NnFgno/",
  "https://www.instagram.com/reel/DakvWLkun51/",
  "https://www.instagram.com/p/DY7PTimx1li/",
];

export default function FeedPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-arena-ink sm:text-3xl">
          <Instagram className="h-7 w-7 text-arena-blue" />
          Feed
        </h1>
        <p className="mt-1 text-sm text-arena-muted">
          As publicações do Instagram do CT VH, direto aqui no painel.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {instagramPosts.map((url) => (
          <div
            key={url}
            className="overflow-hidden rounded-xl border border-arena-border bg-arena-card shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <iframe
              src={`${url}embed/`}
              title={`Publicação do Instagram CT VH — ${url}`}
              className="h-[560px] w-full border-0 bg-white"
              loading="lazy"
              allow="encrypted-media"
              scrolling="no"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
