"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logout } from "@/app/login/actions"
import { Button } from "@/components/ui/button"

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Campanhas", href: "/campaigns", icon: Target },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Mensagens", href: "/messages", icon: MessageSquare },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Configurações", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
            P
          </div>
          <span className="text-lg font-bold text-foreground">Prospect Flow</span>
        </Link>
      </div>

      {/* Menu Principal */}
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Action Button (Nova Campanha) e Logout */}
      <div className="p-4 border-t border-border space-y-4">
        <Link href="/campaigns/new">
          <Button className="w-full justify-start gap-2">
            <Target className="w-4 h-4" />
            Nova Campanha
          </Button>
        </Link>
        <form action={logout}>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </form>
      </div>
    </div>
  )
}
