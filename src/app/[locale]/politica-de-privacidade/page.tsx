import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { siteConfig, siteRoutes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: `Saiba como o ${siteConfig.name} recolhe, usa e protege os seus dados pessoais.`,
};

const LAST_UPDATED = "20 de maio de 2026";

export default function PrivacyPolicyPage() {
  return (
    <Container>
      <div className="mx-auto max-w-3xl py-14 sm:py-20">
        {/* Header */}
        <div className="mb-10 space-y-3">
          <span className="inline-block rounded-full border border-foreground/10 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            LGPD · RGPD
          </span>
          <h1 className="font-heading text-4xl text-foreground sm:text-5xl">
            Política de Privacidade
          </h1>
          <p className="text-sm text-muted-foreground">
            Última atualização: <strong>{LAST_UPDATED}</strong>
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-[15px] leading-7 text-foreground/80">

          <section>
            <h2 className="font-heading text-2xl text-foreground">1. Quem somos</h2>
            <p>
              O <strong>{siteConfig.name}</strong> é uma plataforma digital de notícias e informação regional dedicada ao Algarve,
              disponível em{" "}
              <Link href={siteRoutes.home} className="text-[var(--dt-color-accent)] underline underline-offset-2">
                {siteConfig.url}
              </Link>
              . Para questões relacionadas com privacidade, pode contactar-nos através de{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-[var(--dt-color-accent)] underline underline-offset-2">
                {siteConfig.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-foreground">2. Dados que recolhemos</h2>
            <p>Recolhemos apenas os dados estritamente necessários para o funcionamento da plataforma:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><strong>Dados de contacto</strong> — nome e email fornecidos voluntariamente em formulários de contacto, comunidade ou doação.</li>
              <li><strong>Dados de navegação</strong> — endereço IP, browser, sistema operativo e páginas visitadas, recolhidos automaticamente para fins de segurança e análise (apenas com o seu consentimento).</li>
              <li><strong>Cookies e tecnologias similares</strong> — conforme descrito na nossa{" "}
                <Link href={siteRoutes.cookiePolicy} className="text-[var(--dt-color-accent)] underline underline-offset-2">
                  Política de Cookies
                </Link>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-foreground">3. Como usamos os seus dados</h2>
            <p>Os dados recolhidos são utilizados para:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Gerir e melhorar a plataforma e os conteúdos editoriais.</li>
              <li>Responder a pedidos de contacto, patrocínio ou parceria.</li>
              <li>Processar contribuições e donativos (em ambiente de demonstração).</li>
              <li>Analisar o uso do site de forma anónima e agregada (apenas com consentimento).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-foreground">4. Base legal (LGPD e RGPD)</h2>
            <p>O tratamento dos seus dados baseia-se em uma ou mais das seguintes bases legais:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><strong>Consentimento (Art. 6.º, al. a) RGPD / Art. 7.º LGPD)</strong> — para cookies não essenciais e comunicações de marketing.</li>
              <li><strong>Interesse legítimo (Art. 6.º, al. f) RGPD / Art. 7.º, VI LGPD)</strong> — para segurança e prevenção de fraude.</li>
              <li><strong>Execução de contrato (Art. 6.º, al. b) RGPD)</strong> — quando aplica ao processamento de donativos ou prestação de serviços.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-foreground">5. Os seus direitos</h2>
            <p>Ao abrigo da LGPD e do RGPD, tem direito a:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Aceder, corrigir ou eliminar os seus dados pessoais.</li>
              <li>Retirar o consentimento em qualquer momento.</li>
              <li>Opor-se ao tratamento com base em interesse legítimo.</li>
              <li>Solicitar a portabilidade dos seus dados.</li>
              <li>Apresentar reclamação à autoridade de controlo competente (CNPD em Portugal / ANPD no Brasil).</li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer destes direitos, contacte-nos em{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-[var(--dt-color-accent)] underline underline-offset-2">
                {siteConfig.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-foreground">6. Retenção de dados</h2>
            <p>
              Os dados são conservados apenas pelo tempo necessário para os fins para os quais foram recolhidos,
              ou pelo período legalmente exigido. Dados de navegação anónimos podem ser conservados por até 26 meses.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-foreground">7. Partilha de dados com terceiros</h2>
            <p>
              Não vendemos nem partilhamos os seus dados pessoais com terceiros para fins comerciais.
              Podemos partilhar dados com prestadores de serviços técnicos (ex: infraestrutura cloud, analytics)
              que atuam como subprocessadores sob as mesmas garantias de proteção.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-foreground">8. Alterações a esta política</h2>
            <p>
              Esta política pode ser atualizada periodicamente. As alterações serão publicadas nesta página
              com a data de atualização. Recomendamos que a consulte regularmente.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-foreground">9. Contacto</h2>
            <p>
              Para qualquer questão relacionada com privacidade ou proteção de dados, contacte-nos em{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-[var(--dt-color-accent)] underline underline-offset-2">
                {siteConfig.email}
              </a>
              {" "}ou consulte a nossa{" "}
              <Link href={siteRoutes.cookiePolicy} className="text-[var(--dt-color-accent)] underline underline-offset-2">
                Política de Cookies
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
