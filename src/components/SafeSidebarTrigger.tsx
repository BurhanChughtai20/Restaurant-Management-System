"use client"

import React, { useContext } from 'react'
import { SidebarContext } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PanelLeft, Menu } from 'lucide-react'

export function SafeSidebarTrigger({ className, ...props }: React.ComponentProps<'button'>) {
  const context = useContext(SidebarContext)
  
  // ✅ NO Provider = Simple Menu button (no crash)
  if (!context) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7 sm:hidden", className)}
        {...props}
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">Menu</span>
      </Button>
    )
  }

  const { toggleSidebar } = context
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 sm:hidden", className)}
      onClick={(e) => {
        e.stopPropagation()
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
