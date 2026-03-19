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

| Código | Requisito Funcional (Funcionalidade) | Descrição |
|--------------------|------------------------------------|----------------------------------------|
| RF1 | Gerenciar Clientes | Processamento de inclusão, alteração, exclusão e consulta de dados de clientes que utilizam o sistema de reservas. |
| RF2 | Gerenciar Mesas | Processamento de inclusão, alteração, exclusão e consulta de mesas do restaurante, incluindo capacidade de pessoas e localização da mesa. |
| RF3 | Gerenciar Reservas | Processamento de inclusão, alteração, exclusão e consulta de reservas realizadas pelos clientes. |
| RF4 | Consultar Disponibilidade de Mesas |	O sistema deve permitir a verificação da disponibilidade de mesas de acordo com data, horário e quantidade de pessoas. |
| RF5 | Confirmar Reserva | O sistema deve permitir que o cliente confirme a realização da reserva após o preenchimento das informações necessárias. |
| RF6 | Cancelar Reserva | O sistema deve permitir que o cliente ou administrador cancele uma reserva previamente realizada. |
| RF7 | Gerenciar Usuários do Sistema |	Processamento de inclusão, alteração, exclusão e consulta de usuários administrativos do sistema. |
| RF8 | Visualizar Agenda de Reservas |	O sistema deve permitir que os administradores visualizem todas as reservas organizadas por data e horário. |
| RF9 | Notificar Confirmação de Reserva | O sistema deve enviar uma notificação ou mensagem de confirmação ao cliente após a realização da reserva. |
| RF10 | Gerar Relatórios de Reservas | O sistema deve permitir a geração de relatórios contendo informações sobre reservas realizadas, canceladas e ocupação das mesas. |

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
Como observado no diagrama de casos de uso da Figura 1, a secretária poderá gerenciar as matrículas e professores no sistema, enquanto o coordenador, além dessas funções, poderá gerenciar os cursos de aperfeiçoamento.

#### Figura 1: Diagrama de Casos de Uso do Sistema.

![dcu](https://github.com/user-attachments/assets/41f6b731-b44e-43aa-911f-423ad6198f47)
 
### 3.4.2 Descrições de Casos de Uso

Cada caso de uso deve ter a sua descrição representada nesta seção. Exemplo:

#### Gerenciar Professor (CSU01)

Sumário: A Secretária realiza a gestão (inclusão, remoção, alteração e consulta) dos dados sobre professores.

Ator Primário: Secretária.

Ator Secundário: Coordenador.

Pré-condições: A Secretária deve ser validada pelo Sistema.

Fluxo Principal:

1) 	A Secretária requisita manutenção de professores.
2) 	O Sistema apresenta as operações que podem ser realizadas: inclusão de um novo professor, alteração de um professor, a exclusão de um professor e a consulta de dados de um professor.
3) 	A Secretária seleciona a operação desejada: Inclusão, Exclusão, Alteração ou Consulta, ou opta por finalizar o caso de uso.
4) 	Se a Secretária desejar continuar com a gestão de professores, o caso de uso retorna ao passo 2; caso contrário o caso de uso termina.

Fluxo Alternativo (3): Inclusão

a)	A Secretária requisita a inclusão de um professor. <br>
b)	O Sistema apresenta uma janela solicitando o CPF do professor a ser cadastrado. <br>
c)	A Secretária fornece o dado solicitado. <br>
d)	O Sistema verifica se o professor já está cadastrado. Se sim, o Sistema reporta o fato e volta ao início; caso contrário, apresenta um formulário em branco para que os detalhes do professor (Código, Nome, Endereço, CEP, Estado, Cidade, Bairro, Telefone, Identidade, Sexo, Fax, CPF, Data do Cadastro e Observação) sejam incluídos. <br>
e)	A Secretária fornece os detalhes do novo professor. <br>
f)	O Sistema verifica a validade dos dados. Se os dados forem válidos, inclui o novo professor e a grade listando os professores cadastrados é atualizada; caso contrário, o Sistema reporta o fato, solicita novos dados e repete a verificação. <br>

Fluxo Alternativo (3): Remoção

a)	A Secretária seleciona um professor e requisita ao Sistema que o remova. <br>
b)	Se o professor pode ser removido, o Sistema realiza a remoção; caso contrário, o Sistema reporta o fato. <br>

Fluxo Alternativo (3): Alteração

a)	A Secretária altera um ou mais dos detalhes do professor e requisita sua atualização. <br>
b)	O Sistema verifica a validade dos dados e, se eles forem válidos, altera os dados na lista de professores, caso contrário, o erro é reportado. <br>
 
Fluxo Alternativo (3): Consulta

a)	A Secretária opta por pesquisar pelo nome ou código e solicita a consulta sobre a lista de professores. <br>
b)	O Sistema apresenta uma lista professores. <br>
c)	A Secretária seleciona o professor. <br>
d)	O Sistema apresenta os detalhes do professor no formulário de professores. <br>

Pós-condições: Um professor foi inserido ou removido, seus dados foram alterados ou apresentados na tela.

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
