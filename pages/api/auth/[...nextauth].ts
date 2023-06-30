import NextAuth, { NextAuthOptions } from 'next-auth';
import { NextApiHandler } from 'next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { logger } from '../../../lib/logger';

const prisma = new PrismaClient();

export const options: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'sign in with',
      credentials: {
        username: {
          label: 'UserName',
          type: 'text',
          placeholder: 'user name',
        },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (credentials == undefined) {
          return null;
        }
        const user = await fetch(
          `${process.env.NEXTAUTH_URL}/api/user/check-credentials`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              accept: 'application/json',
            },
            body: Object.entries(credentials)
              .map((e) => e.join('='))
              .join('&'),
          }
        )
          .then((res) => res.json())
          .catch((err) => {
            logger.error(err);
            return null;
          });

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {},
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error: (code, metadata) => {
      logger.error(code, metadata);
    },
    warn: (code) => {
      logger.warn(code);
    },
    debug: (code, metadata) => {
      logger.debug(code, metadata);
    },
  },
  session: { strategy: 'jwt' },
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
