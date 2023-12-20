import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner';
import Header from './index-components/Header';
import { cn } from '@/lib/utils';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aljannat orders dashboard',
  description: 'Created by Baidar Gul.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn(inter.className, "min-h-screen w-full")}>
          <Header />
          <div className=''>
            {children}
          </div>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  )
}