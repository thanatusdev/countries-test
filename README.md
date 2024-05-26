# Build a NextJS application with GraphQL and Typescript

## Technologies

- NextJS
- TypeScript
- ChakraUI
- GraphQL
- Apollo
- Zod validation

## Requirements

Have a welcome modal with two separate slides:

- On the first modal slide, have the user set a username.
- On the second modal slide, have the user set their job title.
- Save the user’s username and job title information in the way you best see fit.
- You should be able to view this information somewhere once you log in, and be able to change it.
- The user’s information should also be persisted
  Use Apollo client to query a public GraphQL API.
- Display the GraphQL API data as items on an “Information Page” that is mobile and tablet compatible.
- Users should not be able to view the “Information Page” until the user has set their information.
- Have it so when you click a listed item on the “Information Page”, it should open a modal that displays the information about that item.
- Deploy on Vercel free tier.

## How to run the run the project?

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## What next?

- Testing the API with Jest
- Build a React.js user interface
- Add Prometheus metrics to the API
- Deploy the API with Caddy & Docker
- Add Google OAuth

## Concepts

- REST API principals
  - CRUD
  - HTTP methods
- JWT & refresh tokens
- Request validation

## Video structure

1. What are we going to build (Postman demo)
2. Code walk-through
3. Bootstrap application
   1. Setup express JS
   2. Create routes function
   3. Setup database connection
   4. Setup logger
   5. Validate request middleware
4. Registration
   1. Create user model
   2. Create user endpoint
   3. Create user session
   4. Deserialize user middleware (refresh tokens)
   5. Get sessions
   6. Delete session
   7. Require user middleware
5. Product resource
   1. Create product model
   2. Create product
   3. Read product
   4. Update product
   5. Delete product

## Data flow

![](./diagrams/data-flow.png)

## Access & refresh token flow

![](./diagrams/refresh-token-flow.png)

# Deployment

## What will we use

- Docker (image)
- docker-compose (container)
- Caddy - Web server
- DigitalOcean

Note: You will need Docker installed locally if you want to test your Docker configutation

## Let's keep in touch

- [Subscribe on YouTube](https://www.youtube.com/TomDoesTech)
- [Discord](https://discord.gg/4ae2Esm6P7)
- [Twitter](https://twitter.com/tomdoes_tech)
- [TikTok](https://www.tiktok.com/@tomdoestech)
- [Facebook](https://www.facebook.com/tomdoestech)
- [Instagram](https://www.instagram.com/tomdoestech)

[Buy me a Coffee](https://www.buymeacoffee.com/tomn)

[Sign up to DigitalOcean 💖](https://m.do.co/c/1b74cb8c56f4)
