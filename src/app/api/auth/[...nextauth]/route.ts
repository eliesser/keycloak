import NextAuth, { TokenSet } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { JWT } from 'next-auth/jwt';
import { Session, User } from 'next-auth';

interface CustomUser extends User {
  id: string;
  name: string;
  idToken: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

function requestRefreshOfAccessToken(token: JWT) {
  if (!token.refreshToken || typeof token.refreshToken !== 'string') {
    throw new Error('Refresh token is missing or invalid');
  }

  const clientId = process.env.KEYCLOAK_CLIENT_ID;
  const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Client ID or Client Secret is missing');
  }

  return fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken,
    }).toString(),
    cache: 'no-store',
  });
}

export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID as string,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET as string,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (
          !credentials ||
          !process.env.KEYCLOAK_CLIENT_ID ||
          !process.env.KEYCLOAK_CLIENT_SECRET
        ) {
          console.error('The required environment variables are not defined.');
          return null;
        }

        try {
          const res = await fetch(
            `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                client_id: process.env.KEYCLOAK_CLIENT_ID,
                client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
                grant_type: 'password',
                username: credentials.username,
                password: credentials.password,
                scope: 'openid',
              }).toString(),
            }
          );

          const data = await res.json();

          if (res.ok && data.access_token) {
            return {
              id: credentials.username,
              name: credentials.username,
              idToken: data.id_token || '',
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              expiresIn: data.expires_in,
            } as CustomUser;
          } else {
            console.error('Authentication error:', data);
            return null;
          }
        } catch (error) {
          console.error('Error in the request to Keycloak:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.idToken = user.id;
        token.idToken = user.name;
        token.idToken = user.idToken;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresIn = user.expiresIn;
      }

      if (
        typeof token.expiresAt === 'number' &&
        Date.now() < token.expiresAt! * 1000 - 60 * 1000
      ) {
        return token;
      } else {
        try {
          const response = await requestRefreshOfAccessToken(token);

          const tokens: TokenSet = await response.json();

          if (!response.ok) throw tokens;

          const updatedToken: JWT = {
            ...token,
            idToken: tokens.id_token,
            accessToken: tokens.access_token,
            expiresAt: Math.floor(
              Date.now() / 1000 + (tokens.expires_in as number)
            ),
            refreshToken: tokens.refresh_token ?? token.refreshToken,
          };

          return updatedToken;
        } catch (error) {
          console.error('Error refreshing access token', error);
          return { ...token, error: 'RefreshAccessTokenError' };
        }
      }
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.expiresIn = token.expiresIn as number;

      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
