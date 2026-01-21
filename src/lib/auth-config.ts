import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/src/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // تسجيل الدخول بالهاتف (Credentials)
    CredentialsProvider({
      name: 'Phone',
      credentials: {
        phone: { label: 'Phone', type: 'tel' },
        code: { label: 'Verification Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) {
          return null
        }

        // TODO: التحقق من رمز التحقق هنا
        // يجب تنفيذ منطق التحقق من رمز SMS
        
        // مثال بسيط (يجب استبداله بمنطق حقيقي):
        // const isValidCode = await verifySMSCode(credentials.phone, credentials.code)
        // if (!isValidCode) return null

        // البحث عن المستخدم أو إنشاؤه
        let user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              phone: credentials.phone,
              role: 'PATIENT',
            },
          })
        }

        return {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
        }
      },
    }),

    // تسجيل الدخول بـ Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        ;(session.user as any).id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET,
}

