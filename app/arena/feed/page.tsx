"use client";

import { useEffect, useState } from "react";
import { Instagram, Sparkles } from "lucide-react";
import { instagramPosts, getUnseenPosts, markAllPostsSeen } from "@/lib/arena-feed";
import { useAuth } from "@/components/arena/auth-context";

export default function FeedPage() {
  const { user } = useAuth();
  // Captura o que era novidade ao abrir a página, para exibir o selo "Novo".
  const [newPosts, setNewPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    setNewPosts(new Set(getUnseenPosts(user.username)));
    markAllPostsSeen(user.username);
  }, [user]);

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
            className="relative overflow-hidden rounded-xl border border-arena-border bg-arena-card shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            {newPosts.has(url) && (
              <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-arena-blue px-2.5 py-1 text-xs font-bold text-white shadow-md">
                <Sparkles className="h-3.5 w-3.5" />
                Novo
              </span>
            )}
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

      {/* Link para o perfil no Instagram */}
      <div className="mt-8 flex justify-center pb-4">
        <a
          href="https://www.instagram.com/cefflash/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-arena-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-arena-blue-dark active:scale-95"
        >
          <Instagram className="h-5 w-5" />
          Ver mais no Instagram
        </a>
      </div>
    </div>
  );
}
