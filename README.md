# gerenciadorEventos
projeto para praticar react+node+express+sqlite 3 - proj eventos


---detalhes do projeto ---


projeto : aplicativo de reserva d eventos


Objetivo:
Desenvolver um aplicativo para gerenciar e reservar eventos, onde os usuários podem visualizar eventos disponíveis, fazer reservas e gerenciar suas reservas. O aplicativo permitirá que organizadores de eventos publiquem e gerenciem eventos, enquanto os participantes poderão se inscrever e acompanhar suas reservas.

Funcionalidades:
Autenticação e Registro:

Permitir que organizadores e participantes se registrem e façam login.

Implementar diferentes tipos de usuários com permissões distintas (organizador e participante).
Gerenciamento de Eventos:

Para Organizadores:
Criar, editar e excluir eventos.
Definir detalhes do evento (data, horário, local, capacidade, descrição).

Para Participantes:
Visualizar a lista de eventos disponíveis.
Reservar ingressos para eventos.
Cancelar reservas.


Painel de Controle:

Para Organizadores:
Ver lista de eventos criados.
Gerenciar reservas para seus eventos (ver quem se inscreveu, número de participantes).

Para Participantes:
Ver suas reservas.
Gerenciar suas reservas (visualizar, cancelar).
Interface do Usuário:

Criar uma interface amigável e responsiva utilizando React e uma biblioteca de componentes (por exemplo, Material-UI ou Bootstrap).
Implementar páginas para visualização de eventos, criação de eventos, gerenciamento de reservas e perfil do usuário.
Persistência de Dados:

Utilizar SQLite3 para armazenar dados de eventos, usuários e reservas.
Configurar o Node.js para criar uma API RESTful que interaja com o banco de dados SQLite3.
Funcionalidades Adicionais (opcional):

Sistema de notificação para lembretes de eventos e reservas.
Avaliação e comentários sobre eventos.
Pesquisa e filtros avançados para eventos.
Tecnologias e Ferramentas:
Frontend:

React
Biblioteca de componentes (Material-UI, Bootstrap, etc.)
Axios para chamadas de API
Backend:

Node.js
Express.js para construir a API RESTful
SQLite3 para o banco de dados
Biblioteca de autenticação (por exemplo, Passport.js)
Estrutura do Projeto:
Frontend:

Componentes Principais: Página de login e registro, painel de controle do organizador, página de eventos, formulário de criação de evento, página de reservas.
Gerenciamento de Estado: Utilizar o Context API ou Redux para gerenciar o estado global.
Backend:

Endpoints da API:
/api/auth/register - Registrar um novo usuário.
/api/auth/login - Fazer login de um usuário.
/api/events - CRUD para eventos.
/api/reservations - CRUD para reservas.
/api/users - Gerenciar informações dos usuários.
Banco de Dados:

Tabelas:
users - Informações dos usuários (organizador e participante).
events - Detalhes dos eventos.
reservations - Reservas feitas para eventos.
Desafios e Aprendizado:
Gerenciamento de Permissões: Implementar diferentes tipos de usuários com permissões específicas.
Persistência e Sincronização: Gerenciar a persistência de dados com SQLite3 e garantir a consistência das reservas.
Interface e Experiência do Usuário: Projetar uma interface que suporte tanto organizadores quanto participantes e seja fácil de usar.

