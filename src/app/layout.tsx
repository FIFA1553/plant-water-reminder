import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Plant Water Reminder',
  description: 'ระบบช่วยเตือนรดน้ำต้นไม้',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className="dark">
      <head>
        {/* Google Font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&display=swap"
          rel="stylesheet"
        />

        {/* Material Symbols */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>

      <body className="font-display bg-background-light dark:bg-background-dark min-h-screen">
        {children}
      </body>
    </html>
  )
}
