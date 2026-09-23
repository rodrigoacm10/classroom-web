import type { Metadata } from "next";
import Link from "next/link";
import { SecondaryPage } from "@/components/ui/secondary-page";
import { Notice } from "@/components/ui/notice";

export const metadata: Metadata = {
  title: "Privacidade",
  description:
    "O que o Locus coleta quando um aluno confirma presença, quem vê cada dado e o que o sistema não faz.",
};

export default function PrivacidadePage() {
  return (
    <SecondaryPage>
      <h1 className="text-[32px] leading-9 font-black tracking-tight text-ink sm:text-[40px] sm:leading-[46px]">
        Privacidade
      </h1>
      <p className="mt-3 font-mono text-caption/caption text-muted">
        Última atualização: 15 de setembro de 2026
      </p>

      <div className="mt-8">
        <Notice title="Rascunho técnico">
          Esta página descreve exatamente o que o sistema coleta hoje, verificado no
          código. Os itens jurídicos ainda pendentes estão listados no fim, e precisam
          de revisão antes de valerem como política.
        </Notice>
      </div>

      <div className="legal-prose mt-10">
        <p>
          O Locus registra presença em sala de aula. Para isso ele precisa saber que o
          aluno estava perto da sala no momento da chamada — e essa é a única razão
          pela qual pede localização.
        </p>

        <h2>O que é coletado na confirmação</h2>
        <p>
          Quando o professor abre a chamada e o aluno confirma presença no celular, um
          registro é criado com:
        </p>
        <ul>
          <li>
            <strong>Código do dia</strong> digitado pelo aluno.
          </li>
          <li>
            <strong>Latitude e longitude</strong> do aparelho no instante da
            confirmação, e a <strong>precisão do GPS</strong> informada pelo sistema
            operacional.
          </li>
          <li>
            <strong>Distância até a sala</strong> e se ela ficou dentro do raio
            configurado para aquela sala.
          </li>
          <li>
            <strong>Dispositivo</strong>: identificador do aparelho e metadados como
            sistema operacional e modelo.
          </li>
          <li>
            <strong>Endereço IP</strong> e <strong>identificação do navegador ou app</strong>{" "}
            usados na requisição.
          </li>
          <li>
            <strong>Data e hora</strong> da confirmação.
          </li>
        </ul>
        <p>
          Esses dados ficam no registro daquela aula. É esse conjunto que permite
          sustentar — ou contestar — uma presença depois.
        </p>

        <h2>O que o Locus não faz</h2>
        <ul>
          <li>
            Não acompanha a localização de forma contínua. A posição é lida uma vez,
            no momento da confirmação.
          </li>
          <li>
            Fora de uma chamada aberta, o sistema não pede nem recebe localização
            nenhuma.
          </li>
          <li>
            Não existe mapa ao vivo de um aluno, nem histórico de trajeto entre as
            aulas. Só pontos isolados, um por presença confirmada.
          </li>
          <li>
            Não vende nem compartilha esses dados para publicidade.
          </li>
        </ul>

        <h2>Quem vê o quê</h2>
        <ul>
          <li>
            <strong>Aluno</strong>: apenas o próprio histórico. Não vê colegas nem o
            código do dia de outra turma.
          </li>
          <li>
            <strong>Professor</strong>: as confirmações das suas turmas, incluindo
            distância e status, para conduzir a chamada e revisar o que sair do padrão.
          </li>
          <li>
            <strong>Coordenação</strong>: frequência por turma e período, sem operar a
            chamada.
          </li>
          <li>
            <strong>Administração da instituição</strong>: pessoas, salas e permissões.
          </li>
        </ul>

        <h2>Quando algo sai do padrão</h2>
        <p>
          Uma confirmação fora do raio não vira falta automática nem punição
          automática. Ela é marcada como irregular e vai para o professor{" "}
          <strong>aprovar ou rejeitar</strong>, com uma justificativa que fica anexada
          ao registro, junto de quem revisou e quando.
        </p>
        <p>
          Recusar a permissão de localização não gera punição automática do sistema:
          sem confirmação nenhum registro é criado, e onde não há registro não há dado
          de localização. Hoje o Locus não permite lançar essa presença manualmente,
          então o acerto acontece fora do sistema, com a coordenação.
        </p>

        <h2>Dados de conta</h2>
        <p>
          Para entrar no sistema o Locus guarda nome, e-mail, senha (armazenada apenas
          como hash), o vínculo com a instituição e o papel de cada pessoa nela. O
          acesso é criado por convite da instituição — não existe cadastro aberto.
        </p>

        <h2>Menores de idade</h2>
        <p>
          Em instituições de educação básica os titulares dos dados são menores de
          idade, e o tratamento acontece a pedido e sob responsabilidade da
          instituição de ensino. A coleta de consentimento dos responsáveis é conduzida
          pela instituição.
        </p>

        <h2>Pendente de revisão jurídica</h2>
        <p>
          Os pontos abaixo dependem de definição formal e ainda não estão declarados
          nesta página:
        </p>
        <ul>
          <li>Identificação do controlador dos dados (razão social e CNPJ).</li>
          <li>Prazo de retenção dos registros de presença e de conta.</li>
          <li>Contato do encarregado pelo tratamento de dados (DPO).</li>
          <li>Base legal aplicável a cada finalidade, nos termos da LGPD.</li>
          <li>Relação de operadores e serviços de terceiros envolvidos.</li>
          <li>Procedimento para exercício dos direitos do titular.</li>
        </ul>
        <p>
          Até que isso esteja fechado, dúvidas sobre dados podem ir direto para{" "}
          <a href="mailto:contato@locus.app">contato@locus.app</a>. Veja também os{" "}
          <Link href="/termos">termos de uso</Link>.
        </p>
      </div>
    </SecondaryPage>
  );
}
