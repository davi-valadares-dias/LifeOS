# LifeOS - Plataforma SaaS de Produtividade Pessoal

Sistema full-stack desenvolvido para gerenciamento de rotina pessoal, estruturado com foco em arquitetura multi-tenant, segurança de dados e automação por inteligência artificial.

## Visão Geral

O LifeOS centraliza módulos essenciais do dia a dia em uma interface unificada, garantindo o isolamento completo de dados entre diferentes usuários e integração com modelos de linguagem para processamento de comandos em linguagem natural.

## Tecnologias Utilizadas

### Back-end

* Node.js / Express.js
* MongoDB / Mongoose
* JSON Web Tokens (JWT) / Bcrypt
* Google Generative AI SDK

### Front-end

* React.js
* React Calendar / React Hot Toast

## Módulos do Sistema

1. **Autenticação:** Sistema de registro e controle de acesso baseado em tokens JWT com isolamento estrito de dados por ID de usuário (`usuarioId`).
2. **Financeiro:** Controle de fluxo de caixa, entradas, saídas, cálculo de saldo e categorização de lançamentos.
3. **Treinos:** Registro de histórico de exercícios, grupos musculares e duração de sessões.
4. **Estudos:** Gerenciamento de disciplinas acadêmicas, corpo docente e controle de frequência.
5. **Projetos:** Portfólio técnico para documentação de software, tecnologias aplicadas e links de repositórios.
6. **Calendário:** Agenda interativa para mapeamento de eventos, avaliações e compromissos.
7. **Nutrição:** Acompanhamento de refeições e cálculo automatizado de macronutrientes.
8. **Assistente de IA:** Módulo integrado para interpretação de comandos textuais e execução automatizada de operações no banco de dados.

## Arquitetura de Segurança

O sistema implementa barreiras de isolamento lógico:

* Associação obrigatória de entidades de domínio ao identificador do usuário autenticado.
* Interceptação de requisições por middleware de validação de token para injeção de escopo de sessão.
* Restrição de consultas a escopos autorizados em operações de leitura, atualização e exclusão.