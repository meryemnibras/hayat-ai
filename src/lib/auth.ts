import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth-config'

/**
 * الحصول على Session في Server Components
 */
export async function getSession() {
  return await getServerSession(authOptions)
}

/**
 * الحصول على المستخدم الحالي
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}


