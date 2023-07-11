import './globals.css'
import { Inter } from 'next/font/google'

import Navbar from './components/navbar/Navbar'
import ClientOnly from './components/ClientOnly'
import ToasterProvider from './providers/ToasterProvider'
import getCurrentUser from './actions/getCurrentUser'

import RegisterModal from './components/modals/RegisterModal'
import LoginModal from './components/modals/LoginModal'
import RentModal from './components/modals/RentModal'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Airbnb',
  description: 'Airbnb Clone',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RentModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        {children}
      </body>
    </html>
  )
}
