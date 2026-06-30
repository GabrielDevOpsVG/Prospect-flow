# SECURITY.md - Prospect Flow MVP

## Boas Práticas e Proteções Implementadas

O projeto foi construído desde o MVP considerando requisitos robustos de segurança:

### 1. Autenticação e Autorização Segura
- Utilizamos **Supabase Auth**, delegando o gerenciamento de credenciais e senhas a um provedor certificado.
- As senhas dos usuários nunca são armazenadas em texto puro ou manipuladas diretamente pela nossa aplicação.
- Todas as rotas internas da aplicação Next.js estão protegidas pelo **Middleware de Autenticação**. Se o usuário não possuir um cookie de sessão válido, ele será redirecionado imediatamente para o `/login`.

### 2. Controle de Acesso (Row Level Security - RLS)
- O banco de dados PostgreSQL do Supabase possui **Row Level Security (RLS)** habilitado em todas as tabelas contendo dados de negócios (Campanhas, Empresas, Contatos, Leads, Mensagens, etc).
- **Políticas Restritivas:** As políticas garantem que a condição `user_id = auth.uid()` seja sempre aplicada. Assim, é impossível um cliente listar ou modificar registros de outro inquilino (tenant), prevenindo Insecure Direct Object Reference (IDOR).
- Apenas a tabela `users` permite inserção inicial vinculada à criação da conta, sendo o restante estritamente isolado por usuário.

### 3. Proteção das Variáveis e Segredos
- Chaves de API sensíveis não são expostas para o Frontend. A comunicação com APIs externas (Google Places, Apollo, Hunter, etc) ocorrerá exclusivamente através de **Next.js API Routes** ou **Server Actions**, rodando de forma segura no ambiente Server.
- Configurações privadas devem residir em um arquivo `.env.local`, que é automaticamente ignorado pelo `.gitignore`.

### 4. Sanitização e Validações de Entrada (Anti-XSS e Anti-SQLi)
- Validações rigorosas de dados do cliente estão sendo modeladas no lado cliente e servidor. Recomenda-se o uso intenso de bibliotecas de validação de schemas (como Zod) antes de realizar inserções no banco.
- Ao usar o `@supabase/supabase-js`, previne-se o SQL Injection porque as consultas são devidamente parametrizadas por trás dos panos pela biblioteca do PostgREST.

### 5. Audit Logging (Trilha de Auditoria)
- Preparamos uma tabela `audit_logs` no esquema de dados que tem o objetivo de monitorar e gravar eventos críticos (ex: *criação de campanha*, *exportação de dados*, *edições em integrações*).
- Isso facilita o rastreamento em caso de incidentes de segurança.

## Recomendações Futuras (Para Produção)
- **HTTPS/SSL:** Certifique-se de que a aplicação está rodando sob HTTPS na Vercel (Padrão).
- **Rate Limiting:** Implementar limitações de requisição utilizando *Vercel KV* ou o *Upstash* nas rotas de disparo de campanhas para prevenir abusos ou ataques de brute-force nos endpoints.
- **Criptografia Simétrica em Integrações:** Caso o usuário forneça chaves de API próprias de outros serviços (Ex: Twilio, Resend), armazená-las de forma encriptada no banco utilizando a extensão `pgsodium` do Supabase ou similar.
- **Configuração Completa do CSP (Content Security Policy):** Ajustar os headers de segurança do Next.js via `next.config.mjs` para limitar a execução de scripts em ambiente cliente.
