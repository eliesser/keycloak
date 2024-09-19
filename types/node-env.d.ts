import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
  }

  interface User {
    idToken: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
  }
}

declare namespace NodeJS {
  export interface ProcessEnv {
    KEYCLOAK_CLIENT_ID: string;
    KEYCLOAK_CLIENT_SECRET: string;
    KEYCLOAK_ISSUER: string;
  }
}
