import type { Metadata, Viewport } from "next"
import { Rubik } from "next/font/google"
import "./globals.css"

import Footer from "@/components/Footer"
import { Navbar } from "@/components/navbar-menu"
import ReduxProvider from "./providers/ReduxProvider"
import { AlertProvider } from "@/components/DynamicAlert"
import { baseMetadata } from "@/lib/metadata"
import { SidebarProvider } from "@/components/ui/sidebar"

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-rubik",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  ...baseMetadata,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${rubik.variable} font-sans antialiased`}>
        <ReduxProvider>
          <AlertProvider>
             <Navbar />
             {children}
             <Footer />
          </AlertProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}