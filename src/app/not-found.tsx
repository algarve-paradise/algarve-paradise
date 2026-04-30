import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/shared/page-intro";
import { ButtonLink } from "@/components/ui/button-link";
import { siteRoutes } from "@/lib/site";

export default function NotFound() {
  return (
    <Container className="py-10">
      <PageIntro
        eyebrow="404"
        title="Página não encontrada"
        description="A rota pedida nao existe nesta estrutura base. Volte para a Home ou entre em contacto com a equipa."
      />
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={siteRoutes.home}>Voltar a Home</ButtonLink>
        <ButtonLink href={siteRoutes.contact} variant="outline">
          Contactos
        </ButtonLink>
      </div>
    </Container>
  );
}
