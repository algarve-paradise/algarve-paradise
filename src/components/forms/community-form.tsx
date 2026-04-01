"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CommunityForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card
        id="participar"
        className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]"
      >
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-foreground">Partilhar com a comunidade</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Formulario preparado para recolher mensagens, sugestoes ou testemunhos numa integracao futura.
            </p>
          </div>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-foreground">Nome</span>
              <Input
                type="text"
                name="nome"
                placeholder="O seu nome"
                className="h-12 rounded-2xl px-4"
                required
              />
            </label>
            <label className="grid gap-2 text-sm">
              <span className="font-medium text-foreground">Mensagem</span>
              <Textarea
                name="mensagem"
                placeholder="Partilhe a sua opiniao, sugestao ou mensagem para a regiao."
                className="min-h-32 rounded-2xl px-4 py-3"
                required
              />
            </label>
            {submitted ? (
              <p className="rounded-2xl border border-[color:var(--color-brand-200)] bg-[var(--color-brand-50)] px-4 py-3 text-sm text-[var(--color-brand-700)]">
                Mensagem registada em modo demonstracao. A integracao final pode ser ligada depois.
              </p>
            ) : null}
            <Button type="submit" className="h-12 rounded-full px-6">
              Enviar
              <MessageSquare className="size-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
