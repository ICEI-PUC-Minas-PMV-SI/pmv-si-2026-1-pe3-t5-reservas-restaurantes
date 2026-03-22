# 3. DOCUMENTO DE ESPECIFICAÇÃO DE REQUISITOS DE SOFTWARE

Nesta parte do trabalho você deve detalhar a documentação dos requisitos do sistema proposto de acordo com as seções a seguir. Ressalta-se que aqui é utilizado como exemplo um sistema de gestão de cursos de aperfeiçoamento.

## 3.1 Objetivos deste documento
Este documento tem como objetivo especificar os requisitos do sistema web de reservas para restaurantes, descrevendo suas funcionalidades, restrições, perfis de usuários e elementos principais de modelagem. A especificação busca orientar o desenvolvimento da solução proposta, servindo como base para as próximas etapas do projeto, especialmente o design de interação, a implementação e os testes.

Além disso, o documento tem a finalidade de registrar de forma clara o escopo do produto, seus limites e os benefícios esperados, garantindo que todos os integrantes da equipe compartilhem a mesma compreensão sobre o sistema a ser desenvolvido, pelos princípios de Design Centrado no Usuário (DCU), visando atender às necessidades de gestores e clientes finais

## 3.2 Escopo do produto

### 3.2.1 Nome do produto e seus componentes principais
O produto será denominado ReservaFácil, um sistema web de reservas para restaurantes de pequeno e médio porte.

O sistema possuirá, inicialmente, os seguintes componentes principais:
•	módulo de cadastro e autenticação de usuários;

•	módulo de gerenciamento de mesas;

•	módulo de gerenciamento de reservas;

•	módulo de consulta de disponibilidade;

•	módulo de administração para gestores e funcionários.


### 3.2.2 Missão do produto
A missão do produto é permitir o gerenciamento digital das reservas de restaurantes, promovendo maior organização operacional, redução de conflitos de agendamento e melhoria da experiência do usuário durante o processo de reserva.

### 3.2.3 Limites do produto
O sistema proposto contempla o cadastro e o gerenciamento de reservas e mesas, bem como a consulta de horários disponíveis.


O produto não contempla, nesta versão inicial:

•	processamento de pagamentos online;

•	integração com sistemas de delivery;

•	emissão de nota fiscal;

•	integração com aplicativos externos de mensagens;

•	controle financeiro do restaurante;

•	gestão de cardápio e pedidos nas mesas.

### 3.2.4 Benefícios do produto

| # | Benefício | Valor para o Cliente |
|--------------------|------------------------------------|----------------------------------------|
|1	| Facilidade no agendamento de reservas |	Essencial |
|2 | Redução de conflitos de horários | Essencial | 
|3 | Melhor controle da ocupação das mesas | Essencial | 
|4	| Organização das informações de clientes e reservas	| Essencial | 
|5	| Melhoria da experiência do usuário	| Recomendável | 
|6	| Agilidade no atendimento e planejamento operacional	| Recomendável | 

## 3.3 Descrição geral do produto

### 3.3.1 Requisitos Funcionais

O sistema proposto consiste em uma aplicação web destinada ao gerenciamento de reservas de mesas em restaurantes. A solução busca auxiliar na organização do fluxo de clientes, otimizar o uso das mesas disponíveis e reduzir falhas associadas a processos manuais de controle de reservas. O sistema permitirá que clientes realizem reservas de forma digital, enquanto os gestores do restaurante poderão administrar mesas, horários, reservas e dados dos clientes, contribuindo para uma gestão mais eficiente e baseada em informações.

| Código | Requisito Funcional (Funcionalidade) | Descrição                                                                                                                  |
| ------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| RF1    | Gerenciar Clientes                   | Permitir o cadastro, atualização, exclusão e consulta de dados dos clientes que utilizam o sistema.                        |
| RF2    | Gerenciar Mesas                      | Permitir ao gestor cadastrar, editar, excluir e consultar mesas, incluindo número identificador, capacidade e localização. |
| RF3    | Gerenciar Reservas                   | Permitir a criação, alteração, cancelamento e consulta de reservas, associando cliente, data, horário e mesa.              |
| RF4    | Consultar Disponibilidade de Mesas   | Permitir a verificação de mesas disponíveis com base na data, horário e quantidade de pessoas informada.                   |
| RF5    | Gerenciar Acesso de Usuários         | Permitir cadastro e autenticação de usuários (cliente e gestor) por meio de login e senha.                                 |
| RF6    | Visualizar Agenda de Reservas        | Permitir ao gestor visualizar todas as reservas organizadas por data e horário.                                            |
| RF7    | Notificar Cliente sobre Reserva      | Enviar notificações de confirmação e lembretes de reservas ao cliente.                                                     |
| RF8    | Gerar Relatórios de Reservas         | Permitir ao gestor gerar relatórios com informações sobre reservas, cancelamentos e ocupação das mesas.                    |

### 3.3.2 Requisitos Não Funcionais

| Código | Requisito Não Funcional (Restrição) |
|--------------------|------------------------------------|
| RNF1 | O sistema deverá ser desenvolvido como uma aplicação web acessível por meio de navegadores modernos como Google Chrome, Mozilla Firefox e Microsoft Edge. |
| RNF2 | O sistema deverá apresentar interface responsiva, permitindo acesso por computadores, tablets e dispositivos móveis. |
| RNF3 | Segurança: o sistema deverá restringir o acesso às funcionalidades administrativas por meio de autenticação com login e senha individuais. |
| RNF4 | Segurança: o sistema deverá restringir o acesso às funcionalidades administrativas por meio de autenticação com login e senha individuais. |
| RNF5 | O tempo de resposta para operações de consulta de disponibilidade de mesas não deverá ultrapassar 3 segundos em condições normais de uso. |
| RNF6 | O tempo de resposta para operações de consulta de disponibilidade de mesas não deverá ultrapassar 3 segundos em condições normais de uso. |
| RNF7 | O sistema deverá manter registro das reservas realizadas para fins de auditoria e geração de relatórios. |
| RNF8 | O sistema deverá permitir fácil manutenção e atualização do software sem interrupção significativa do serviço. |

### 3.3.3 Usuários 

| Ator | Descrição |
|--------------------|------------------------------------|
| Administrador | Usuário responsável pela administração geral do sistema, incluindo cadastro de mesas, gerenciamento de reservas e geração de relatórios. |
| Funcionário do Restaurante | Usuário responsável por acompanhar as reservas realizadas, confirmar presença dos clientes e auxiliar na organização das mesas. |
| Cliente | Usuário final que acessa o sistema para consultar disponibilidade de mesas e realizar reservas no restaurante. |


## 3.4 Modelagem do Sistema

### 3.4.1 Diagrama de Casos de Uso

#### Figura 1: Diagrama de Casos de Uso do Sistema.

<img src="/docs/img/Template de Diagrama de Casos de Uso(2).jpg">
 
### 3.4.2 Descrições de Casos de Uso

Gerar Relatórios das Reservas (CSU01)

Sumário:
O administrador solicita a geração de relatórios contendo informações sobre as reservas realizadas no sistema.

Ator Primário:
Administrador.

Pré-condições:
O administrador deve estar autenticado no sistema.

Fluxo Principal:

1. O administrador acessa a funcionalidade de relatórios de reservas.
2. O sistema apresenta opções de filtros para geração do relatório (data, período ou cliente).
3. O administrador seleciona os filtros desejados.
4. O sistema processa os dados das reservas.
5. O sistema gera e apresenta o relatório ao administrador.

-----------------------------------------------

Gerenciar Clientes (CSU02)

Sumário:
O administrador realiza a gestão dos dados dos clientes, podendo incluir, alterar, excluir ou consultar informações.

Ator Primário:
Administrador.

Pré-condições:
O administrador deve estar autenticado no sistema.

Fluxo Principal:

1. O administrador solicita o gerenciamento de clientes.
2. O sistema apresenta as operações disponíveis: inclusão, alteração, exclusão e consulta de clientes.
3. O administrador seleciona a operação desejada.
4. O sistema apresenta os campos necessários para a operação selecionada.
5. O administrador informa ou altera os dados do cliente.
6. O sistema valida os dados informados.
7. O sistema registra a operação realizada.

-----------------------------------------------

Gerenciar Mesas (CSU03)

Sumário:
O administrador realiza a gestão das mesas disponíveis no restaurante, podendo cadastrar, alterar, excluir ou consultar mesas.

Ator Primário:
Administrador.

Pré-condições:
O administrador deve estar autenticado no sistema.

Fluxo Principal:

1. O administrador acessa a opção de gerenciamento de mesas.
2. O sistema apresenta as operações disponíveis: inclusão, alteração, exclusão e consulta de mesas.
3. O administrador seleciona a operação desejada.
4. O sistema apresenta os campos necessários para a operação escolhida.
5. O administrador informa ou altera os dados da mesa.
6. O sistema valida os dados informados.
7. O sistema registra a operação.

-----------------------------------------------

Gerenciar Reservas (CSU04)

Sumário:
O administrador realiza a gestão das reservas cadastradas no sistema.

Ator Primário:
Administrador.

Pré-condições:
O administrador deve estar autenticado no sistema.

Fluxo Principal:

1. O administrador acessa a funcionalidade de gerenciamento de reservas.
2. O sistema apresenta a lista de reservas cadastradas.
3. O administrador pode consultar, alterar ou cancelar uma reserva.
4. O sistema registra as alterações realizadas.

-----------------------------------------------

Efetuar Autenticação (CSU05)

Sumário:
O usuário ou administrador realiza o login no sistema para acessar as funcionalidades disponíveis.

Ator Primário:
Usuário.

Ator Secundário:
Administrador.

Pré-condições:
O usuário deve possuir cadastro no sistema.

Fluxo Principal:

1. O usuário acessa a tela de autenticação do sistema.
2. O sistema apresenta os campos de login e senha.
3. O usuário informa suas credenciais.
4. O sistema valida os dados informados.
5. Se as credenciais forem válidas, o sistema concede acesso ao sistema.


- Fluxo Alternativo (4): Credenciais inválidas

 a) O sistema identifica que os dados informados são inválidos.

 b) O sistema informa o erro ao usuário.

 c) O usuário pode tentar novamente.

-----------------------------------------------

Cadastrar Usuário (CSU06)

Sumário:
Permite que um novo usuário realize seu cadastro no sistema para posteriormente efetuar reservas.

Ator Primário:
Usuário.

Pré-condições:
O usuário não deve possuir cadastro no sistema.

Fluxo Principal:

1. O usuário solicita o cadastro no sistema.
2. O sistema apresenta um formulário de cadastro.
3. O usuário informa seus dados pessoais.
4. O sistema valida os dados informados.
5. O sistema registra o novo usuário no sistema.

- Fluxo Alternativo (4): Dados inválidos

 a) O sistema identifica que algum dado informado é inválido ou incompleto.

 b) O sistema informa o erro ao usuário.

 c) O sistema solicita a correção dos dados.

 d) O usuário informa os dados novamente.

 e) O fluxo retorna ao passo 4 do fluxo principal.


- Fluxo Alternativo (4): Usuário já cadastrado

 a) O sistema verifica que o e-mail ou CPF já está cadastrado.

 b) O sistema informa que já existe um cadastro para o usuário.

 c) O sistema orienta o usuário a realizar login ou recuperar a senha.

 d) O caso de uso é encerrado.

-----------------------------------------------

Efetuar Reserva (CSU07)

Sumário:
O usuário solicita a realização de uma reserva de mesa no restaurante.

Ator Primário:
Usuário.

Pré-condições:
O usuário deve estar autenticado no sistema.

Fluxo Principal:

1. O usuário acessa a funcionalidade de reserva de mesa.
2. O sistema solicita os dados da reserva (data, horário e número de pessoas).
3. O usuário informa os dados solicitados.
4. O sistema consulta a disponibilidade de mesas.
5. O sistema apresenta as mesas disponíveis.
6. O usuário seleciona a mesa desejada.
7. O sistema registra a reserva.
8. O sistema confirma a reserva ao usuário.


- Fluxo Alternativo (4): Não há mesas disponíveis

 a) O sistema verifica que não existem mesas disponíveis no horário solicitado.

 b) O sistema informa a indisponibilidade ao usuário.

 c) O usuário pode escolher outra data ou horário.

 d) O fluxo retorna ao passo 2 do fluxo principal.

- Fluxo Alternativo (6): Mesa indisponível no momento da seleção

 a) O sistema identifica que a mesa selecionada acabou de ser reservada por outro usuário.

 b) O sistema informa ao usuário que a mesa não está mais disponível.

 c) O sistema solicita que o usuário selecione outra mesa disponível.

 d) O fluxo retorna ao passo 5 do fluxo principal.

-----------------------------------------------
  
Consultar Disponibilidade de Mesas (CSU08)

Sumário:
O sistema verifica quais mesas estão disponíveis para a data e horário solicitados.

Ator Primário:
Usuário.

Pré-condições:
O usuário deve informar data e horário desejados.

Fluxo Principal:

1. O sistema recebe os dados da reserva.
2. O sistema verifica as mesas disponíveis no horário solicitado.
3. O sistema retorna a lista de mesas disponíveis.

-----------------------------------------------

Verificar Quantidade de Pessoas por Mesa (CSU09)

Sumário:
O sistema verifica se a mesa selecionada suporta a quantidade de pessoas informada pelo usuário.

Ator Primário:
Sistema.

Pré-condições:
Uma mesa deve ter sido selecionada.

Fluxo Principal:

1. O sistema verifica a capacidade da mesa selecionada.
2. O sistema compara a capacidade da mesa com a quantidade de pessoas informada.
3. Se a capacidade for suficiente, a reserva pode prosseguir.

-----------------------------------------------

Notificar sobre Status da Reserva (CSU10)

Sumário:
O sistema envia uma notificação ao usuário informando o status da reserva realizada.

Ator Primário:
Usuário.

Pré-condições:
Uma reserva deve ter sido registrada no sistema.

Fluxo Principal:

1. O sistema registra a reserva realizada.
2. O sistema gera uma notificação de confirmação.
3. O sistema envia a notificação ao usuário informando o status da reserva.




### 3.4.3 Diagrama de Classes 

A Figura 2 mostra o diagrama de classes do sistema. A Matrícula deve conter a identificação do funcionário responsável pelo registro, bem com os dados do aluno e turmas. Para uma disciplina podemos ter diversas turmas, mas apenas um professor responsável por ela.

#### Figura 2: Diagrama de Classes do Sistema.
 
![image](https://github.com/user-attachments/assets/abc7591a-b46f-4ea2-b8f0-c116b60eb24e)


### 3.4.4 Descrições das Classes 

| # | Nome | Descrição |
|--------------------|------------------------------------|----------------------------------------|
| 1	|	Aluno |	Cadastro de informações relativas aos alunos. |
| 2	| Curso |	Cadastro geral de cursos de aperfeiçoamento. |
| 3 |	Matrícula |	Cadastro de Matrículas de alunos nos cursos. |
| 4 |	Turma |	Cadastro de turmas.
| 5	|	Professor |	Cadastro geral de professores que ministram as disciplinas. |
| ... |	... |	... |
