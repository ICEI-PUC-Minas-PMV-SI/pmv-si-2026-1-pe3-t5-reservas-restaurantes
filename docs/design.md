# 4. PROJETO DO DESIGN DE INTERAÇÃO

## 4.1 Personas

### Persona 1 – Cliente Prático (Reserva Rápida)


<img src="../docs/img/Personas_Rest_page-0001.jpg" style="width:70%;">

### Persona 2 – Cliente Planejador (Ocasiões Especiais)


<img src="../docs/img/Personas_Rest_page-0002.jpg" style="width:70%;">

### Persona 3 – Administradora (Gestão do Restaurante)


<img src="../docs/img/Personas_Rest_page-0003.jpg" style="width:70%;">

### Persona 4 – Recepcionista Operacional


<img src="../docs/img/Personas_Rest_page-0004.jpg" style="width:70%;">

### Persona 5 – Cliente Avaliador (Experiência)


<img src="../docs/img/Personas_Rest_page-0005.jpg" style="width:70%;">

### Persona 6 – Cliente Digital Jovem)


<img src="../docs/img/Personas_Rest_page-0006.jpg" style="width:70%;">


## 4.2 Mapa de Empatia

<img width="10898" height="11253" alt="1" src="https://github.com/user-attachments/assets/2b8120e6-c122-4ded-8221-677db216e1ba" />
<img width="10904" height="11190" alt="2" src="https://github.com/user-attachments/assets/003127aa-b070-4ca6-9916-3851df2dcc87" />
<img width="10890" height="11148" alt="3" src="https://github.com/user-attachments/assets/13e58dce-1e24-47eb-8e44-f6b8cc325f06" />
<img width="10878" height="11330" alt="4" src="https://github.com/user-attachments/assets/0992d8b3-8db3-482a-844e-ccf0e8a6baea" />
<img width="10890" height="11373" alt="5" src="https://github.com/user-attachments/assets/3ad5aa44-4ce7-418a-b580-d2aa7667406e" />
<img width="10890" height="11439" alt="6" src="https://github.com/user-attachments/assets/e9fd17f7-6e10-470f-9476-6c9d0de1f398" />

## 4.3 Protótipos das Interfaces

Nesta seção são apresentados os protótipos de alta fidelidade desenvolvidos para o sistema Reserva Fácil. Esses protótipos possuem elevado nível de detalhamento visual e funcional, buscando representar de forma próxima o produto final a ser implementado.

O sistema foi projetado com o objetivo de facilitar a busca por restaurantes, a realização de reservas on-line e o gerenciamento de informações por clientes e estabelecimentos cadastrados. As interfaces contemplam fluxos completos de navegação, incluindo cadastro, login, consulta de restaurantes, reservas e funcionalidades administrativas.

Durante o desenvolvimento das telas, foram aplicados princípios de Interação Humano-Computador, considerando os princípios da Gestalt, recomendações ergonômicas e as Regras de Ouro de Ben Shneiderman. Esses conceitos contribuem para tornar a navegação mais intuitiva, organizada e eficiente.

Entre os princípios utilizados, destacam-se a proximidade e similaridade no agrupamento de elementos relacionados, figura-fundo para melhor distinção das áreas interativas e ponto focal em botões de ações principais. No aspecto ergonômico, buscou-se reduzir a carga cognitiva do usuário por meio de organização clara das informações, boa legibilidade e navegação simplificada.

Quanto às Regras de Ouro, o sistema prioriza consistência entre telas, feedback informativo após ações realizadas, prevenção de erros por validações, liberdade de navegação e redução da necessidade de memorização de informações.

Os protótipos apresentados a seguir são importantes para validar a usabilidade do sistema e identificar melhorias antes da implementação final da solução.

---

## Protótipo 1 – Tela Inicial / Landing Page

<img src="./img/prototype/home.png" style="width:100%;">

### 1. Objetivo da Tela

A tela inicial do sistema Reserva Fácil tem como objetivo apresentar a proposta da plataforma e permitir que o usuário inicie rapidamente a busca por restaurantes disponíveis. Nessa interface, o usuário pode informar cidade, data, horário e quantidade de pessoas, facilitando a localização de estabelecimentos compatíveis com sua necessidade.

Além disso, a tela apresenta seções explicativas sobre o funcionamento do sistema, perguntas frequentes e atalhos para autenticação, contribuindo para uma navegação clara desde o primeiro acesso.

### 2. Princípios Gestálticos Aplicados

Proximidade:
Os campos de pesquisa (cidade, data, horário e pessoas) estão posicionados próximos entre si, formando um grupo visual único relacionado ao processo de busca.

Similaridade:
Os campos de entrada seguem o mesmo padrão visual, com dimensões semelhantes, bordas arredondadas e alinhamento uniforme. Os cards informativos também mantêm padronização estética.

Figura-fundo:
O formulário central se destaca do plano de fundo por meio do contraste entre cores suaves e elementos brancos, facilitando a identificação da área principal de interação.

Ponto focal:
O botão “Buscar restaurantes” apresenta cor de destaque, chamando a atenção do usuário para a principal ação da tela.

Continuidade:
A organização vertical dos elementos conduz naturalmente o olhar do usuário: cabeçalho → área de busca → seção explicativa → perguntas frequentes → rodapé.

Região comum:
As seções “Como funciona” e “Perguntas frequentes” estão agrupadas em áreas próprias, permitindo melhor organização do conteúdo.

### 3. Recomendações Ergonômicas

Usabilidade:
A interface apresenta navegação simples e objetiva, permitindo que o usuário compreenda rapidamente como utilizar o sistema.

Carga cognitiva reduzida:
As informações estão distribuídas em blocos claros e organizados, evitando excesso de elementos simultâneos.

Legibilidade:
Há boa hierarquia tipográfica, contraste adequado entre texto e fundo e tamanhos de fonte confortáveis para leitura.

Eficiência de uso:
O usuário consegue iniciar sua busca em poucos passos, sem necessidade de cadastro prévio.

Aprendizado rápido:
Os textos explicativos e perguntas frequentes auxiliam novos usuários no entendimento do funcionamento da plataforma.

### 4. Regras de Ouro de Shneiderman

Consistência:
Botões, campos e seções seguem padrão visual uniforme em toda a interface.

Feedback informativo:
Os campos respondem à interação do usuário e os botões indicam claramente ações executáveis.

Atalhos:
Os botões “Entrar” e “Criar conta” permitem acesso rápido às funcionalidades de autenticação.

Prevenção de erros:
A divisão lógica dos campos reduz chances de preenchimento incorreto.

Usuário no controle:
O usuário escolhe livremente os critérios de busca antes de prosseguir.

Redução da carga de memória:
As opções necessárias estão visíveis na própria tela, sem exigir memorização de etapas.

Fechamento de diálogo:
Após preencher os dados, a ação de busca conduz naturalmente para a próxima etapa do sistema.

---

## Protótipo 2 – Tela de Descoberta de Restaurantes

<img src="./img/prototype/discover.png" style="width:100%;">

### 1. Objetivo da Tela

A tela de descoberta de restaurantes tem como objetivo apresentar ao usuário os estabelecimentos disponíveis de acordo com os critérios de busca informados, como data, horário, quantidade de pessoas, tipo de cozinha e faixa de preço.

Nessa interface, o usuário pode visualizar os restaurantes em formato de cards, consultar horários disponíveis, acessar mais detalhes sobre cada estabelecimento ou iniciar o processo de reserva. A tela também permite refinar a busca por meio de filtros, facilitando a comparação entre opções antes da tomada de decisão.

### 2. Princípios Gestálticos Aplicados

Proximidade:
Os filtros de busca estão agrupados em uma mesma área, indicando que fazem parte de uma única funcionalidade. Da mesma forma, as informações de cada restaurante aparecem próximas dentro de seus respectivos cards.

Similaridade:
Os cards dos restaurantes seguem o mesmo padrão visual, com imagem, nome, categoria, localização, horários e botões de ação. Isso facilita a comparação entre os estabelecimentos.

Figura-fundo:
Os cards brancos se destacam sobre o fundo claro da página, permitindo que o usuário identifique rapidamente os restaurantes disponíveis.

Ponto focal:
Os botões vermelhos, como “Buscar mesa” e “Ver detalhes”, direcionam a atenção do usuário para as principais ações da tela.

Continuidade:
A disposição dos filtros na parte superior e dos cards logo abaixo conduz o usuário de forma lógica: primeiro refinar a busca, depois analisar os resultados.

Região comum:
Cada card funciona como uma região visual independente, agrupando todas as informações relacionadas a um mesmo restaurante.

### 3. Recomendações Ergonômicas

Usabilidade:
A tela apresenta estrutura clara, permitindo que o usuário encontre restaurantes e compare opções de maneira simples.

Carga cognitiva reduzida:
As informações são organizadas em blocos visuais padronizados, evitando confusão e facilitando a leitura.

Legibilidade:
A hierarquia entre título, descrição, horários e botões contribui para boa compreensão das informações.

Eficiência de uso:
Os filtros e botões de ação permitem que o usuário refine sua busca e avance rapidamente para os detalhes ou reserva.

Facilidade de decisão:
A apresentação de horários, categorias, localização e faixa de preço auxilia o usuário na escolha do restaurante mais adequado.

### 4. Regras de Ouro de Shneiderman

Consistência:
A tela mantém o mesmo padrão visual da tela inicial, com navbar, botões arredondados, cores e tipografia consistentes.

Feedback informativo:
Os filtros selecionados e botões clicáveis indicam visualmente as possibilidades de interação.

Atalhos:
Os botões “Ver detalhes” e “Reservar” permitem acesso direto às principais ações do fluxo.

Prevenção de erros:
A separação dos filtros por categoria reduz a chance de escolhas equivocadas durante a busca.

Usuário no controle:
O usuário pode alterar os critérios de busca, limpar filtros, visualizar detalhes ou escolher iniciar uma reserva.

Redução da carga de memória:
As informações principais de cada restaurante ficam visíveis no card, sem exigir que o usuário memorize dados da busca anterior.

Fechamento de diálogo:
Após selecionar um restaurante ou horário, o sistema conduz o usuário para a próxima etapa do processo de reserva.

---

## 4.4 Testes com Protótipos

## Metodologia de Avaliação de Usabilidade — ReservaFácil

### Objetivo da Avaliação

Esta etapa teve como objetivo avaliar o protótipo de alta fidelidade **ReservaFácil**, verificando sua usabilidade, clareza das informações e adequação do design às necessidades dos perfis de usuários definidos anteriormente no projeto.

A análise buscou identificar pontos fortes, dificuldades de uso e oportunidades de melhoria para a versão final da solução.

---

## Participantes

Os testes foram realizados com **6 participantes**, distribuídos entre perfis compatíveis com as personas previamente definidas no projeto.

| Perfil | Quantidade |
|---|---:|
| Cliente / Usuário Final | 3 |
| Funcionário / Administrador | 3 |
| **Total** | **6** |

Essa divisão permitiu comparar percepções entre usuários externos, que realizam reservas, e usuários internos, responsáveis pela operação do restaurante.

---

## Método Aplicado

Foi utilizado um **teste de usabilidade supervisionado**, seguido de questionário estruturado contendo perguntas objetivas e campos abertos complementares.

Cada integrante do grupo aplicou o teste com participantes distintos, permitindo reunir diferentes percepções sobre a experiência de uso.

Após interagir com o protótipo, cada participante respondeu ao formulário com base em sua navegação prática.

---

## Tarefas Executadas no Protótipo

Antes da aplicação dos testes, foram definidas tarefas específicas para simular situações reais de uso.

### Participantes do perfil Cliente:

- acessar o sistema;
- consultar horários disponíveis;
- selecionar data e quantidade de pessoas;
- realizar uma reserva;
- confirmar a solicitação.

### Participantes do perfil Funcionário / Administrador:

- acessar área administrativa;
- visualizar reservas cadastradas;
- consultar horários ocupados e disponíveis;
- interpretar informações operacionais;
- analisar organização do fluxo de reservas.

---

## Observações Durante os Testes

Durante a navegação dos participantes, foram registradas observações relacionadas a:

- dúvidas recorrentes;
- dificuldades de compreensão;
- erros operacionais;
- hesitações durante tarefas;
- comentários espontâneos;
- facilidade geral de uso.

Essas observações complementaram os resultados numéricos obtidos no questionário.

---

## Escala de Respostas

As perguntas objetivas utilizaram **escala Likert de 1 a 5**, conforme abaixo:

| Valor | Significado |
|---|---|
| 1 | Discordo Totalmente / Muito Insatisfeito |
| 2 | Discordo Parcialmente |
| 3 | Neutro / Satisfatório |
| 4 | Concordo Parcialmente |
| 5 | Concordo Totalmente / Excelente |

---

## Estrutura do Questionário

O formulário foi dividido em cinco dimensões principais:

### 1. Navegação e Fluxo de Uso

Avaliou:

- facilidade para compreender o uso do sistema;
- organização das etapas;
- localização de menus e funções;
- fluidez do processo.

### 2. Layout e Interface Visual

Avaliou:

- organização visual das telas;
- identificação de botões e áreas clicáveis;
- uso de cores e ícones;
- contraste e legibilidade.

### 3. Clareza e Comunicação

Avaliou:

- clareza dos textos;
- entendimento de mensagens;
- coerência de nomes e comandos.

### 4. Segurança e Confiança

Avaliou:

- confiança para utilizar o sistema;
- aparência profissional;
- segurança percebida durante o uso.

### 5. Satisfação Geral

Avaliou:

- experiência geral;
- intenção de uso futuro;
- recomendação para outras pessoas.

---

## Campos Abertos Complementares

Além das perguntas objetivas, o questionário contou com campos abertos para aprofundamento qualitativo.

Foram coletadas respostas sobre:

- dificuldades encontradas durante o processo;
- símbolos, ícones ou elementos confusos;
- pontos positivos da experiência;
- melhorias sugeridas para o protótipo.

---

## Consolidação dos Resultados

Os resultados individuais foram reunidos em uma análise geral, permitindo identificar:

- principais problemas encontrados;
- padrões entre perfis de usuários;
- oportunidades de melhoria;
- prioridades de ajuste para a versão final.

Os dados também foram organizados em tabelas e dashboards visuais para facilitar interpretação comparativa.

---

## Conclusão Metodológica

A metodologia combinou **observação prática**, **avaliação quantitativa** e **feedback qualitativo**, proporcionando uma visão ampla da experiência do usuário e contribuindo diretamente para o aprimoramento final do projeto ReservaFácil.

<img width="2800" height="6186" alt="reservafacil-dashboard-light-premium-ALTA" src="https://github.com/user-attachments/assets/7e5fb965-8174-4009-8fb2-b98bdb2e7a8d" />

