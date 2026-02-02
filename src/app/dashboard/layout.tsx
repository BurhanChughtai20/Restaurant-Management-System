"use client"

import * as React from "react"
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { SideMenu } from "@/components/admin-dashboard/SideMenu"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen>
      <SideMenu />
      <SidebarInset>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
