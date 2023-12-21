import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner';
import Header from './index-components/Header';
import { cn } from '@/lib/utils';
import currentProfile from '@/lib/current-profile';
import { Role } from '@prisma/client';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aljannat orders dashboard',
  description: 'Created by Baidar Gul.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const profile = await currentProfile()

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn(inter.className, "min-h-screen w-full")}>
          {profile && profile.role !== Role.UNVERIFIED && <Header />}
          <div className=''>
            {children}
          </div>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  )
}