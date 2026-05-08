"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, RotateCcw } from "lucide-react";

type ChatMessage = {
  id: string;
  from: "bot" | "user";
  text: string;
  link?: { label: string; href: string };
};

type QuickReply = {
  label: string;
  value: string;
};

const QUICK_REPLIES: QuickReply[] = [
  { label: "💡 Sugestão de notícia", value: "sugestao" },
  { label: "🤝 Parceria ou publicidade", value: "parceria" },
  { label: "📩 Enviar conteúdo", value: "conteudo" },
  { label: "📞 Falar com a equipa", value: "equipa" },
];

const RESPONSES: Record<string, { text: string; link?: { label: string; href: string } }> = {
  sugestao: {
    text: "Tem uma sugestão de notícia ou reportagem? A nossa equipa editorial agradece! Envie-nos os detalhes por email e avaliamos a publicação.",
    link: { label: "Enviar sugestão", href: "mailto:Media@algarvetvparadise.com?subject=Sugestão de notícia" },
  },
  parceria: {
    text: "Para parcerias comerciais, publicidade ou projetos institucionais, a nossa equipa responde em até 2 dias úteis. Aguardamos o seu contacto!",
    link: { label: "Contactar equipa comercial", href: "mailto:Media@algarvetvparadise.com?subject=Parceria%2FPublicidade" },
  },
  conteudo: {
    text: "Quer partilhar fotos, vídeos ou histórias da região do Algarve? Envie-nos ou explore a nossa página de comunidade!",
    link: { label: "Ir para a comunidade", href: "/comunidade" },
  },
  equipa: {
    text: "Para falar diretamente com a nossa equipa, envie um email para Media@algarvetvparadise.com. Estamos em Algarve, Portugal.",
    link: { label: "Enviar email", href: "mailto:Media@algarvetvparadise.com" },
  },
};

const WELCOME: ChatMessage = {
  id: "welcome",
  from: "bot",
  text: "Olá! Sou o assistente da Algarve TV Paradise 👋 Como posso ajudar?",
};

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [showReplies, setShowReplies] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function handleReply(reply: QuickReply) {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      from: "user",
      text: reply.label,
    };
    const response = RESPONSES[reply.value];
    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      from: "bot",
      text: response.text,
      link: response.link,
    };

    setShowReplies(false);
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      setMessages((prev) => [...prev, botMsg]);
      setTimeout(() => setShowReplies(true), 400);
    }, 500);
  }

  function reset() {
    setMessages([WELCOME]);
    setShowReplies(true);
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex w-[340px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-white shadow-[0_24px_70px_-10px_rgba(10,10,10,0.22)] sm:right-6">
          <div className="flex items-center justify-between gap-3 bg-[#04162f] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative inline-flex size-9 items-center justify-center rounded-full bg-white/10">
                <MessageCircle className="size-4 text-white" />
                <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-[#04162f] bg-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Algarve TV Paradise</p>
                <p className="text-[11px] text-white/55">Assistente digital</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={reset}
                className="inline-flex size-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
                aria-label="Reiniciar conversa"
              >
                <RotateCcw className="size-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-white"
                aria-label="Fechar chat"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex max-h-72 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col gap-1 ${msg.from === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.from === "bot"
                      ? "bg-[var(--color-brand-50)] text-foreground"
                      : "bg-[#04162f] text-white"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.link && (
                  <a
                    href={msg.link.href}
                    className="ml-1 mt-0.5 inline-flex items-center gap-1.5 rounded-full border border-[var(--dt-color-accent)] px-3 py-1 text-xs font-medium text-[var(--dt-color-accent)] transition hover:bg-[var(--dt-color-accent)] hover:text-white"
                  >
                    {msg.link.label} →
                  </a>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {showReplies && (
            <div className="flex flex-col gap-2 border-t border-foreground/8 p-4 pt-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Escolha uma opção
              </p>
              <div className="flex flex-col gap-2">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply.value}
                    onClick={() => handleReply(reply)}
                    className="rounded-xl border border-foreground/10 bg-[var(--dt-color-bg)] px-4 py-2.5 text-left text-sm text-foreground transition hover:border-[var(--dt-color-accent)] hover:bg-white"
                  >
                    {reply.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar chat de suporte" : "Abrir chat de suporte"}
        className="fixed bottom-6 right-4 z-50 inline-flex size-14 items-center justify-center rounded-full bg-[#04162f] text-white shadow-[0_8px_32px_rgba(4,22,47,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(4,22,47,0.45)] sm:right-6"
      >
        {open ? (
          <X className="size-5 transition-transform duration-200" />
        ) : (
          <MessageCircle className="size-5 transition-transform duration-200" />
        )}
        {!open && (
          <span className="absolute -right-1 -top-1 size-3.5 rounded-full border-2 border-white bg-emerald-400" />
        )}
      </button>
    </>
  );
}
