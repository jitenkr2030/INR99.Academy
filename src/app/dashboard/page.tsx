import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session || !session.user) {
    redirect('/auth/login')
  }

  const userRole = (session.user as any).role || 'STUDENT'

  // Route to role-specific dashboard
  switch (userRole) {
    case 'ADMIN':
    case 'SUPER_ADMIN':
      redirect('/dashboard/admin/overview')
    case 'INSTRUCTOR':
      redirect('/dashboard/instructor/overview')
    case 'STUDENT':
    default:
      redirect('/dashboard/student/overview')
  }
}
