This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Banco de dados permanente (Neon / Postgres)

Os dados do site continuam no `localStorage` do navegador, mas agora também são
copiados para um banco Postgres na nuvem, que não apaga. Ao fazer login (em
qualquer navegador/computador) os dados voltam do banco.

1. Crie um projeto grátis em https://neon.tech e copie a *connection string*.
2. Local: crie `.env.local` com `DATABASE_URL=...` (veja `.env.example`).
   Vercel: Settings > Environment Variables > `DATABASE_URL`, e faça redeploy.
3. Rode `pnpm install` e `pnpm dev`. A tabela `kv_store` é criada sozinha.
4. Se o primeiro usuário já existia no navegador, entre com ele: os dados
   locais sobem para o banco. Sem `DATABASE_URL`, o site funciona como antes.

**Quem acessa o banco:** só quem tem a `DATABASE_URL` ou acesso ao projeto na
Neon. Para dar acesso a outras pessoas ao banco, convide-as pelo painel da Neon
(Project > Settings > Collaborators). Para dar acesso ao *site*, o
administrador cadastra usuários na tela Usuários.

**Recuperar senha do admin:** no SQL Editor da Neon, edite a linha
`auth:usuarios` da tabela `kv_store`.
