"use client"

import type * as React from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  Users,
  LayoutDashboard,
  LogOut,
  Settings,
  HelpCircle,
  BarChart3,
  FileText,
  Calendar,
  MessageSquare,
  Star,
  TrendingUp,
  PlusCircle,
  Search,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useEffect, useState } from "react"

// Navigation data
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/Dashboard",
      icon: LayoutDashboard,
      badge: "New",
    },
    {
      title: "Properties",
      url: "/inventory",
      icon: Building2,
      items: [
        {
          title: "All Properties",
          url: "/inventory",
        },
        {
          title: "Add Property",
          url: "/inventory/add",
        },
        {
          title: "Property in Detail",
          url: "/inventory/detail-view",
        },
      ],
    },
    {
      title: "Dealers",
      url: "/dealers",
      icon: Users,
      items: [
        {
          title: "All Dealers",
          url: "/dealers",
        },
        {
          title: "Add Dealer",
          url: "/dealers/add",
        },
      ],
    },
    {
      title: "Buyer Demands",
      url: "/demand",
      icon: Search,
      badge: "12",
    },
    {
      title: "Total Matches",
      url: "/matches",
      icon: BarChart3,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
    },
  ],
  navSecondary: [
    {
      title: "Profile",
      url: "/Dashboard/profile",
      icon: Calendar,
    },
    {
      title: "Messages",
      url: "/messages",
      icon: MessageSquare,
      badge: "5",
    },
    {
      title: "Settings",
      url: "/Dashboard/settings",
      icon: Settings,
    },
    {
      title: "Help & Support",
      url: "/help",
      icon: HelpCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const [stats, setStats] = useState({ activeProperties: 0, totalDealers: 0, thisMonth: 0 })

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to load stats", err))
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Building2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Haris CRM</span>
                    <span className="truncate text-xs">Real Estate</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>
                <DropdownMenuItem>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Building2 className="size-4 shrink-0" />
                  </div>
                  Haris Real Estate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <PlusCircle className="size-4 shrink-0" />
                  </div>
                  Add workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const isActive = pathname === item.url || pathname.startsWith(item.url + "/")

              // If the menu has sub-items, use collapsible
              if (item.items?.length) {
                return (
                  <Collapsible key={item.title} defaultOpen={isActive}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          {item.badge && <Badge variant="secondary" className="ml-auto">{item.badge}</Badge>}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                <Link href={subItem.url}>{subItem.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              }

              // If no sub-items, make it a direct link
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      {item.badge && <Badge variant="secondary" className="ml-auto">{item.badge}</Badge>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarMenu>
            {data.navSecondary.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Quick Stats */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
          <div className="px-3 py-2 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active Properties</span>
              <span className="font-medium">{stats.activeProperties}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Dealers</span>
              <span className="font-medium">{stats.totalDealers}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">This Month</span>
              <div className="flex items-center text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                <span className="font-medium">+{stats.thisMonth}%</span>
              </div>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                    <AvatarFallback className="rounded-lg">
                      {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{session?.user?.name || "User"}</span>
                    <span className="truncate text-xs">{session?.user?.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                      <AvatarFallback className="rounded-lg">
                        {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{session?.user?.name || "User"}</span>
                      <span className="truncate text-xs">{session?.user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
