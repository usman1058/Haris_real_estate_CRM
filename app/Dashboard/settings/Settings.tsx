"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/user-auth"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface GeneralSettings {
  theme: "light" | "dark" | "system"
  notificationsEnabled: boolean
  emailPreferences: boolean
}

interface AdminSettings {
  systemName: string
  apiKey: string
  defaultCurrency: string
  maxUsers: number
}

interface SettingsData {
  general: GeneralSettings
  admin: AdminSettings
}

export default function SettingsPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/settings")
        const data: SettingsData = await res.json()
        setSettings(data)
      } catch (error) {
        console.error("Failed to fetch settings:", error)
        toast("Error", {
          description: "Failed to load settings. Please try again."
        })

      } finally {
        setIsLoading(false)
      }
    }

    if (!isAuthLoading) {
      fetchSettings()
    }
  }, [isAuthLoading])

  const handleSaveSettings = async (category: "general" | "admin") => {
    if (!settings) return
    setIsSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [category]: settings[category] }),
      })
      if (res.ok) {
        toast("Success", {
          description: `${category} settings saved successfully.`
        })

      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast("Error", {
  description: `Failed to save ${category} settings. Please try again.`,
  className: "bg-red-500 text-white"
})

    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast({ title: "Error", description: "All fields are required.", variant: "destructive" })
    }
    if (newPassword !== confirmPassword) {
      return toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" })
    }

    setIsChangingPassword(true)
    try {
      const res = await fetch("/api/settings/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          currentPassword,
          newPassword
        })
      })

      const result = await res.json()
      if (res.ok) {
        toast({ title: "Success", description: result.message })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toast({ title: "Error", description: result.error || "Failed to change password", variant: "destructive" })
      }
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" })
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isAuthLoading || isLoading || !settings) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  const isAdmin = user?.role === "Admin"

  return (
    <div className="flex-1 space-y-6 p-6 pt-20 pl-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences and configurations.</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Preferences</CardTitle>
              <CardDescription>Configure application-wide settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.general.theme}
                  onValueChange={(value: "light" | "dark" | "system") =>
                    setSettings((prev) => (prev ? { ...prev, general: { ...prev.general, theme: value } } : null))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <Switch
                  id="notifications"
                  checked={settings.general.notificationsEnabled}
                  onCheckedChange={(checked) =>
                    setSettings((prev) =>
                      prev ? { ...prev, general: { ...prev.general, notificationsEnabled: checked } } : null,
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-preferences">Email Preferences</Label>
                <Switch
                  id="email-preferences"
                  checked={settings.general.emailPreferences}
                  onCheckedChange={(checked) =>
                    setSettings((prev) =>
                      prev ? { ...prev, general: { ...prev.general, emailPreferences: checked } } : null,
                    )
                  }
                />
              </div>
              <Button onClick={() => handleSaveSettings("general")} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your personal account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleChangePassword} disabled={isChangingPassword}>
                {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin */}
        {isAdmin && (
          <TabsContent value="admin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Administration</CardTitle>
                <CardDescription>Manage global application settings and configurations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="system-name">System Name</Label>
                  <Input
                    id="system-name"
                    value={settings.admin.systemName}
                    onChange={(e) =>
                      setSettings((prev) =>
                        prev ? { ...prev, admin: { ...prev.admin, systemName: e.target.value } } : null,
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={settings.admin.apiKey}
                    onChange={(e) =>
                      setSettings((prev) =>
                        prev ? { ...prev, admin: { ...prev.admin, apiKey: e.target.value } } : null,
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="default-currency">Default Currency</Label>
                  <Select
                    value={settings.admin.defaultCurrency}
                    onValueChange={(value) =>
                      setSettings((prev) =>
                        prev ? { ...prev, admin: { ...prev.admin, defaultCurrency: value } } : null,
                      )
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max-users">Maximum Users</Label>
                  <Input
                    id="max-users"
                    type="number"
                    value={settings.admin.maxUsers}
                    onChange={(e) =>
                      setSettings((prev) =>
                        prev ? { ...prev, admin: { ...prev.admin, maxUsers: Number.parseInt(e.target.value) } } : null,
                      )
                    }
                  />
                </div>
                <Button onClick={() => handleSaveSettings("admin")} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Admin Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
