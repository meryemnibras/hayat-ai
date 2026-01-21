import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/src/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // تسجيل دخول بالهاتف (مبسط)
    CredentialsProvider({
      name: 'Phone',
      credentials: {
        phone: { label: "رقم الهاتف", type: "tel" },
        code: { label: "رمز التحقق", type: "text" }
      },
      async authorize(credentials) {
        // هنا يجب التحقق من رمز OTP
        // هذا مثال مبسط - يجب استخدام خدمة SMS حقيقية
        
        if (!credentials?.phone) return null
        
        // البحث عن المستخدم أو إنشاءه
        let user = await prisma.user.findUnique({
          where: { phone: credentials.phone }
        })
        
        if (!user) {
          user = await prisma.user.create({
            data: {
              phone: credentials.phone,
              role: 'PATIENT'
            }
          })
        }
        
        return {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub!
        ;(session.user as any).role = token.role as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    }
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 يوم
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
