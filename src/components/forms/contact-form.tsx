"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

import { contactFormFields } from "@/data/contacts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  title?: string;
  description?: string;
};

export function ContactForm({
  title = "Entrar em contacto",
  description = "Formulário preparado para integração futura com email, CRM ou automação.",
}: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="border border-white/10 bg-white shadow-[0_16px_40px_rgba(7,32,67,0.08)]">
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <h2 className="font-heading text-2xl text-foreground">{title}</h2>
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            {contactFormFields.map((field) => (
              <label key={field.name} className="grid gap-2 text-sm">
                <span className="font-medium text-foreground">{field.label}</span>
                {field.type === "textarea" ? (
                  <Textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    className="min-h-32 rounded-2xl px-4 py-3"
                    required
                  />
                ) : (
                  <Input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    className="h-12 rounded-2xl px-4"
                    required
                  />
                )}
              </label>
            ))}
            {submitted ? (
              <p className="rounded-2xl border border-[color:var(--color-brand-200)] bg-[var(--color-brand-50)] px-4 py-3 text-sm text-[var(--color-brand-700)]">
                Pedido registado em modo demonstracao. A entrega final pode ligar este formulario a email ou CRM.
              </p>
            ) : null}
            <Button type="submit" className="h-12 rounded-full px-6">
              Enviar mensagem
              <Send className="size-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
