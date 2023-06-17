# sandbox-nextauth

## using

- Next.js
- Prisma
- PostgreSQL on Docker

## launch db

```terminal
cd db
docker compose up -d
```

## run development server

```teminal
npm ci
npx prisma generate
npx prisma db push
npm run dev
```
