db in .env

npm install

npx prisma generate

npx prisma migrate dev --name init

node prisma/seed.js

npx prisma studio

npm run dev