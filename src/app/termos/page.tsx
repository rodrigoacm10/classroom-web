import type { Metadata } from "next";
import Link from "next/link";
import { SecondaryPage } from "@/components/ui/secondary-page";
import { Notice } from "@/components/ui/notice";

export const metadata: Metadata = {
  title: "Termos de uso",
  description:
    "Como o acesso ao Locus é concedido, o que cada papel pode fazer e a quem pertencem os registros de presença.",
};

export default function TermosPage() {
  return (
    <SecondaryPage>
      <h1 className="text-[32px] leading-9 font-black tracking-tight text-ink sm:text-[40px] sm:leading-[46px]">
        Termos de uso
      </h1>
      <p className="mt-3 font-mono text-caption/caption text-muted">
        Última atualização: 15 de setembro de 2026
      </p>

      <div className="mt-8">
        <Notice title="Rascunho técnico">
          Este texto descreve como o Locus funciona hoje, verificado no código. As
          cláusulas contratuais listadas no fim ainda não foram redigidas e precisam de
          revisão jurídica antes de valerem como termo.
        </Notice>
      </div>

      <div className="legal-prose mt-10">
        <h2>O que o Locus é</h2>
        <p>
          O Locus é um sistema de registro de presença para instituições de ensino. O
          professor abre a chamada em uma sala com raio definido, o aluno confirma pelo
          celular com o código do dia e a posição do aparelho, e a frequência é
          consolidada a partir desses registros.
        </p>

        <h2>Como o acesso é concedido</h2>
        <p>
          O acesso é sempre por instituição. Não existe cadastro aberto: uma pessoa
          entra no Locus porque a administração da sua instituição a convidou, e o
          convite chega por e-mail com um link de aceite. A instituição concede e revoga
          esses acessos.
        </p>
        <p>
          Cada pessoa é responsável por manter sua senha em sigilo. Contas são pessoais
          e não devem ser compartilhadas — um registro de presença vale exatamente o
          quanto a identidade de quem o criou vale.
        </p>

        <h2>O que cada papel pode fazer</h2>
        <ul>
          <li>
            <strong>Aluno</strong>: confirmar a própria presença e consultar o próprio
            histórico.
          </li>
          <li>
            <strong>Professor</strong>: abrir, fechar e cancelar chamadas das suas
            turmas, revisar confirmações irregulares e emitir o relatório da turma.
          </li>
          <li>
            <strong>Coordenação</strong>: consultar frequência por turma e período.
          </li>
          <li>
            <strong>Administração</strong>: gerenciar instituição, pessoas, salas,
            turmas e permissões.
          </li>
        </ul>

        <h2>Uso aceitável</h2>
        <p>
          Confirmar presença por outra pessoa, compartilhar o código do dia com quem não
          está em aula ou falsear a localização do aparelho são fraudes de frequência.
          O sistema marca confirmações fora do padrão para revisão humana, e a
          consequência de uma fraude é definida pela instituição, não pelo Locus.
        </p>
        <p>
          Também não é permitido tentar acessar registros de outras turmas ou de outras
          instituições, nem automatizar requisições de forma que degrade o serviço.
        </p>

        <h2>A quem pertencem os registros</h2>
        <p>
          Os registros de presença, turmas, salas e pessoas pertencem à instituição de
          ensino. O Locus os processa para operar o serviço. O tratamento desses dados,
          incluindo localização, está descrito na{" "}
          <Link href="/privacidade">política de privacidade</Link>.
        </p>

        <h2>Disponibilidade</h2>
        <p>
          O Locus pode ficar indisponível por manutenção ou falha. Como a chamada
          acontece em um horário fixo e curto, uma indisponibilidade durante a aula pode
          impedir confirmações — nesse caso a presença é resolvida pelo professor no
          registro da turma.
        </p>

        <h2>Pendente de redação jurídica</h2>
        <p>
          As cláusulas abaixo ainda não constam deste documento:
        </p>
        <ul>
          <li>Identificação da contratada (razão social e CNPJ) e da contratante.</li>
          <li>Condições comerciais, vigência, renovação e rescisão.</li>
          <li>Nível de serviço acordado e consequências do seu descumprimento.</li>
          <li>Limitação de responsabilidade e indenização.</li>
          <li>Propriedade intelectual e licença de uso do software.</li>
          <li>Foro e legislação aplicável.</li>
        </ul>
        <p>
          Dúvidas até então: <a href="mailto:contato@locus.app">contato@locus.app</a>.
        </p>
      </div>
    </SecondaryPage>
  );
}
