"use client";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Megaphone,
  Trophy,
  CalendarDays,
  CloudRain,
  Sparkles,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PostTag = "Aviso" | "Torneio" | "Treino" | "Novidade";

interface Post {
  id: string;
  tag: PostTag;
  date: string;
  text: string;
  icon: typeof Megaphone;
  likes: number;
  comments: string[];
  /** Foto do post (arquivo em public/feed/). Se ausente ou não encontrada, o post fica só com texto. */
  image?: string;
}

const initialPosts: Post[] = [
  {
    id: "1",
    tag: "Treino",
    date: "22/07 · 12:30",
    text: "📋 Listas do treino de hoje (quarta) já estão no Calendário de Aulas! Confirme sua presença com o professor. Destaque para a Elite B que treina em duplas às 19h. 🔥",
    icon: CalendarDays,
    likes: 18,
    comments: ["Bora! 💪", "Confirmadíssimo"],
  },
  {
    id: "2",
    tag: "Torneio",
    date: "21/07 · 18:00",
    text: "🏆 Vem aí o TORNEIO INTERNO CT VH! Inscrições abertas para as categorias Iniciante, Aprendiz e Elite. Duplas serão sorteadas para equilibrar o nível. Garanta sua vaga com a recepção!",
    icon: Trophy,
    likes: 42,
    comments: ["Já me inscrevi!", "Vai ter premiação? 👀", "Bora Elite B"],
  },
  {
    id: "3",
    tag: "Aviso",
    date: "20/07 · 14:15",
    text: "🌧️ Previsão de chuva forte hoje à noite. Caso o treino das 20h seja cancelado, avisaremos aqui no feed e no grupo do WhatsApp até as 18h. Fiquem ligados!",
    icon: CloudRain,
    likes: 9,
    comments: ["Valeu pelo aviso!"],
  },
  {
    id: "4",
    tag: "Novidade",
    date: "19/07 · 10:00",
    text: "✨ Chegaram as novas bolas oficiais e a rede nova da quadra 1! Treino de qualidade merece estrutura de qualidade. Obrigado a todos os alunos pelo apoio de sempre. 💜",
    icon: Sparkles,
    likes: 35,
    comments: ["A quadra ficou top!", "Merecido 👏"],
  },
];

const tagStyles: Record<PostTag, string> = {
  Aviso: "bg-arena-orange/10 text-arena-orange",
  Torneio: "bg-arena-blue/10 text-arena-blue",
  Treino: "bg-arena-green/10 text-arena-green",
  Novidade: "bg-arena-red/10 text-arena-red",
};

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [newPost, setNewPost] = useState("");
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [nextId, setNextId] = useState(100);
  // Fotos que falharam ao carregar (arquivo ainda não está em public/feed/).
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const publish = () => {
    const text = newPost.trim();
    if (!text) return;
    const now = new Date();
    const stamp = `${String(now.getDate()).padStart(2, "0")}/${String(
      now.getMonth() + 1,
    ).padStart(2, "0")} · ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;
    setPosts((prev) => [
      {
        id: String(nextId),
        tag: "Aviso",
        date: stamp,
        text,
        icon: Megaphone,
        likes: 0,
        comments: [],
      },
      ...prev,
    ]);
    setNextId((n) => n + 1);
    setNewPost("");
  };

  const addComment = (id: string) => {
    const text = commentDraft.trim();
    if (!text) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, comments: [...p.comments, text] } : p,
      ),
    );
    setCommentDraft("");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-arena-ink sm:text-3xl">Feed</h1>
        <p className="mt-1 text-sm text-arena-muted">
          Todas as atualizações do CT VH em um só lugar: avisos, torneios,
          treinos e novidades.
        </p>
      </div>

      {/* Composer */}
      <div className="mb-6 rounded-xl border border-arena-border bg-arena-card p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-arena-blue text-sm font-bold text-white">
            VH
          </span>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Compartilhe uma atualização com os alunos..."
              rows={2}
              className="w-full resize-none rounded-md border border-arena-border bg-arena-bg px-3 py-2 text-sm text-arena-ink outline-none transition-colors placeholder:text-arena-muted focus:border-arena-blue"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={publish}
                disabled={!newPost.trim()}
                className="inline-flex items-center gap-2 rounded-md bg-arena-blue px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-arena-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post) => {
          const isLiked = liked.has(post.id);
          const likeCount = post.likes + (isLiked ? 1 : 0);
          const showComments = openComments === post.id;
          return (
            <article
              key={post.id}
              className="rounded-xl border border-arena-border bg-arena-card shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-arena-blue text-sm font-bold text-white">
                  VH
                </span>
                <div className="flex-1">
                  <p className="flex items-center gap-1 text-sm font-semibold text-arena-ink">
                    CT VH Futevôlei
                    <BadgeCheck className="h-4 w-4 text-arena-blue" />
                  </p>
                  <p className="text-xs text-arena-muted">{post.date}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                    tagStyles[post.tag],
                  )}
                >
                  <post.icon className="h-3.5 w-3.5" />
                  {post.tag}
                </span>
              </div>

              {/* Body */}
              <p className="whitespace-pre-line px-4 py-3 text-sm leading-relaxed text-arena-ink">
                {post.text}
              </p>

              {/* Foto (estilo Instagram) */}
              {post.image && !brokenImages.has(post.image) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.image}
                  alt="Foto da publicação"
                  className="max-h-[480px] w-full bg-black object-cover"
                  onError={() =>
                    setBrokenImages((prev) => {
                      const next = new Set(prev);
                      next.add(post.image!);
                      return next;
                    })
                  }
                />
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 border-t border-arena-border px-4 py-2.5">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium transition-all duration-150 active:scale-90",
                    isLiked
                      ? "text-arena-red"
                      : "text-arena-muted hover:text-arena-red",
                  )}
                >
                  <Heart
                    className={cn("h-5 w-5", isLiked && "fill-current")}
                  />
                  {likeCount}
                </button>
                <button
                  onClick={() =>
                    setOpenComments(showComments ? null : post.id)
                  }
                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-arena-muted transition-colors hover:text-arena-blue"
                >
                  <MessageCircle className="h-5 w-5" />
                  {post.comments.length}
                </button>
              </div>

              {/* Comments */}
              {showComments && (
                <div className="border-t border-arena-border px-4 py-3">
                  {post.comments.length > 0 && (
                    <ul className="mb-3 space-y-2">
                      {post.comments.map((c, i) => (
                        <li
                          key={i}
                          className="rounded-md bg-arena-bg px-3 py-2 text-sm text-arena-ink"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex gap-2">
                    <input
                      value={commentDraft}
                      onChange={(e) => setCommentDraft(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addComment(post.id)}
                      placeholder="Escreva um comentário..."
                      className="flex-1 rounded-md border border-arena-border bg-arena-bg px-3 py-2 text-sm text-arena-ink outline-none transition-colors placeholder:text-arena-muted focus:border-arena-blue"
                    />
                    <button
                      onClick={() => addComment(post.id)}
                      className="rounded-md bg-arena-blue px-3 py-2 text-white transition-colors hover:bg-arena-blue-dark"
                      aria-label="Enviar comentário"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
