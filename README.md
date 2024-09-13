# Next.js and Keycloak

## Objective of this app

this is an app made with nextjs v14.2.11 and next-auth v4.24.7 that integrates keycloak authentication v22.0.4.

## Prerequisites

Make sure you have the following tools installed on your machine:

- [Node.js](https://nodejs.org/) (version 20.14.0)
- [npm](https://www.npmjs.com/) (version 10.7.0)
- [Docker](https://www.docker.com/) (version 27.1.2)

## Bootstrapping keycloak server

- Setup a keycloak server

```
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:22.0.4 start-dev
```

- Login to Keycloak security admin console: [http://localhost:8080/admin](http://localhost:8080/admin)

- Create a new realm: [http://localhost:8080/admin/master/console/#/master/add-realm](http://localhost:8080/admin/master/console/#/master/add-realm)

  - Make sure to change from master realm to myrealm for subsequent steps

- Create a client under myrealm with OpenID Connect: [http://localhost:8080/admin/master/console/#/myrealm/clients/add-client](http://localhost:8080/admin/master/console/#/myrealm/clients/add-client)
  - Choose the client type as OpenID Connect and set the client id as “nextjs”. Click “Next” to proceed further.
  - To enable client authentication, select the standard flow for the authentication process. Then, click “Next” to configure the login settings.
  - set "Valid post logout redirect URIs" with "http://localhost:3000/api/auth/callback/keycloak" and set "Valid post logout redirect URIs" with "http://localhost:3000" and set "Web origins" with "http://localhost:3000"
  - Click save to create client.
- Get the client secret of the nextjs client id from Credentials tab.
- Create a user in myrealm: [http://localhost:8080/admin/master/console/#/myrealm/users/add-user](http://localhost:8080/admin/master/console/#/myrealm/users/add-user)

  - Create a user with the given username
  - Also go to credentials tab of the created user and set the password

- The initial setup of keycloak is done

## Environment variables

- Create the following .env and .env.local files at the root of the project
- Copies the contents of the .env.template file into the 2 previously created .env and .env.local files.
- Replace the environment variables

## Getting Started

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## References

This app was made with reference to the following tutorials:

- [`Implementing Authentication in Next.js v13 Application with Keycloak(Part — 1)`](https://medium.com/inspiredbrilliance/implementing-authentication-in-next-js-v13-application-with-keycloak-part-1-f4817c53c7ef)

- [`Implementing Authentication in Next.js v13 Application with Keycloak(Part — 2)`](https://medium.com/inspiredbrilliance/implementing-authentication-in-next-js-v13-application-with-keycloak-part-2-6f68406bb3b5)
