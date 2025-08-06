"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState, useContext } from "react"
import { usePathname } from "next/navigation"
import { ThemeContext } from "@/context/ThemeContext"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Monitor,
  Plus,
  HelpCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function AppHeader() {
  const { data: session } = useSession()
  const { toggleTheme, isDark } = useContext(ThemeContext)
  const pathname = usePathname()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{ dealers: any[]; properties: any[] }>({
    dealers: [],
    properties: [],
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        fetch(`/api/search?q=${searchQuery}`)
          .then((res) => res.json())
          .then((data) => setSearchResults(data))
          .catch(console.error)
      } else {
        setSearchResults({ dealers: [], properties: [] })
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchQuery])

  const breadcrumbs = [{ label: "Home", href: "/" }].concat(
    pathname
      .split("/")
      .filter(Boolean)
      .map((segment, index, arr) => ({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: "/" + arr.slice(0, index + 1).join("/"),
      }))
  )

  const openQuickAdd = () => {
    document.getElementById("open-add-property")?.click()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex-1" />

        {/* Search Input */}
        {/* <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search dealers, properties..."
            className="w-64 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery && (
            <div className="absolute z-50 mt-1 w-64 rounded-md border bg-white shadow-md p-2 text-sm max-h-80 overflow-y-auto">
              <div className="font-semibold mb-1 text-muted-foreground">Properties</div>
              {searchResults?.properties?.length === 0 ? (
                <p className="text-xs text-muted-foreground">No matches found.</p>
              ) : (
                searchResults.properties.map((p) => (
                  <div key={p.id} className="py-1">{p.title} – {p.location}</div>
                ))
              )}

              <div className="font-semibold mt-2 mb-1 text-muted-foreground">Dealers</div>
              {searchResults?.dealers?.length === 0 ? (
                <p className="text-xs text-muted-foreground">No matches found.</p>
              ) : (
                searchResults.dealers.map((d) => (
                  <div key={d.id} className="py-1">{d.name}</div>
                ))
              )}
            </div>
          )}
        </div> */}

        {/* Add Property
        <Button size="sm" className="hidden lg:flex" onClick={openQuickAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Button> */}

        {/* Notifications */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2 p-2 text-xs text-muted-foreground">
              <div className="p-2 hover:bg-muted rounded">🏡 New property added: Luxury Villa</div>
              <div className="p-2 hover:bg-muted rounded">✅ Deal closed: 3BR Apartment</div>
              <div className="p-2 hover:bg-muted rounded">📨 New buyer inquiry: 2BR Apartment</div>
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" className="w-full justify-center text-sm">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu> */}

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>

        {/* User Menu */}
        {session?.user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                  <AvatarFallback>{session.user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{session.user.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
