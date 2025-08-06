"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, User, Shield, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Profile {
  id: string
  name: string
  email: string
  role: "admin" | "user" | "dealer"
  bio: string
  avatar: string
  phone: string
  location: string
  joinDate: string
  status: "active" | "inactive"
  lastLogin: string
}

// Mock current user from auth
const currentUser = {
  id: "1",
  role: "admin", // change to "user" to test
}

function getRoleColor(role: string) {
  switch (role) {
    case "admin": return "bg-red-100 text-red-800"
    case "dealer": return "bg-blue-100 text-blue-800"
    case "user": return "bg-green-100 text-green-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

function getStatusColor(status: string) {
  return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
}

export default function ProfilePage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const isAdmin = currentUser.role === "admin"

  // Fetch profiles
  useEffect(() => {
    async function loadProfiles() {
      setLoading(true)
      try {
        const res = await fetch(`/api/profile?userId=${currentUser.id}&role=${currentUser.role}`)
        if (!res.ok) throw new Error("Failed to fetch profiles")
        const data = await res.json()

        setProfiles(data)

        if (isAdmin) {
          setCurrentProfile(data.find((p: Profile) => p.id === currentUser.id) || data[0])
        } else {
          setCurrentProfile(data[0] || null)
        }
      } catch {
        toast.error("Error loading profiles")
      } finally {
        setLoading(false)
      }
    }
    loadProfiles()
  }, [])

  // Save profile (Add/Edit)
  const handleSaveProfile = async (profile: Profile) => {
    try {
      const method = profile.id ? "PUT" : "POST"
      const res = await fetch("/api/profile", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, currentUser }),
      })
      if (!res.ok) throw new Error("Save failed")
      const updated = await res.json()

      if (method === "POST") {
        setProfiles((prev) => [...prev, updated])
      } else {
        setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
        if (currentProfile?.id === updated.id) setCurrentProfile(updated)
      }

      toast.success("Profile saved successfully")
      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)
      setEditingProfile(null)
    } catch {
      toast.error("Error saving profile")
    }
  }

  // Delete profile
  const handleDeleteProfile = async (profileId: string) => {
    if (profileId === currentUser.id) {
      toast.error("Cannot delete your own profile")
      return
    }
    try {
      const res = await fetch(`/api/profile?id=${profileId}&currentUserId=${currentUser.id}&role=${currentUser.role}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Delete failed")

      setProfiles((prev) => prev.filter((p) => p.id !== profileId))
      toast.success("Profile deleted successfully")
    } catch {
      toast.error("Error deleting profile")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    )
  }

  if (!currentProfile && !isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
            <p className="text-gray-600">Your profile information is not available.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile Management</h1>
        {isAdmin && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Profile
          </Button>
        )}
      </div>

      {isAdmin ? (
        <Tabs defaultValue="my-profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="my-profile">My Profile</TabsTrigger>
            <TabsTrigger value="all-profiles">All Profiles</TabsTrigger>
          </TabsList>

          <TabsContent value="my-profile">
            <ProfileCard profile={currentProfile!} onEdit={() => {
              setEditingProfile(currentProfile!)
              setIsEditDialogOpen(true)
            }} showActions={true} />
          </TabsContent>

          <TabsContent value="all-profiles">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" /> All User Profiles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{profile.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{profile.name}</div>
                              <div className="text-sm text-gray-500">{profile.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge className={getRoleColor(profile.role)}>{profile.role}</Badge></TableCell>
                        <TableCell><Badge className={getStatusColor(profile.status)}>{profile.status}</Badge></TableCell>
                        <TableCell>{profile.location}</TableCell>
                        <TableCell>{profile.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => {
                              setEditingProfile(profile)
                              setIsEditDialogOpen(true)
                            }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {profile.id !== currentUser.id && (
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteProfile(profile.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <ProfileCard profile={currentProfile!} onEdit={() => {
          setEditingProfile(currentProfile!)
          setIsEditDialogOpen(true)
        }} showActions={true} />
      )}

      <ProfileDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onSave={handleSaveProfile} title="Add New Profile" />
      <ProfileDialog isOpen={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} onSave={handleSaveProfile} profile={editingProfile} title="Edit Profile" />
    </div>
  )
}

function ProfileCard({ profile, onEdit, showActions = false }: { profile: Profile, onEdit: () => void, showActions?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" /> Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar || "/placeholder.svg"} />
            <AvatarFallback>{profile.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-bold">{profile.name}</h3>
              <p className="text-gray-600">{profile.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={getRoleColor(profile.role)}>{profile.role}</Badge>
              <Badge className={getStatusColor(profile.status)}>{profile.status}</Badge>
            </div>
          </div>
          {showActions && (
            <Button onClick={onEdit}><Edit className="h-4 w-4 mr-2" /> Edit</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ProfileDialog({ isOpen, onClose, onSave, profile, title }: { isOpen: boolean, onClose: () => void, onSave: (p: Profile) => void, profile?: Profile | null, title: string }) {
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: "", email: "", role: "user", bio: "", phone: "", location: "",
    status: "active", avatar: "", joinDate: new Date().toISOString().split("T")[0],
    lastLogin: new Date().toLocaleString()
  })

  useEffect(() => {
    if (profile) setFormData(profile)
    else setFormData({
      name: "", email: "", role: "user", bio: "", phone: "", location: "",
      status: "active", avatar: "", joinDate: new Date().toISOString().split("T")[0],
      lastLogin: new Date().toLocaleString()
    })
  }, [profile, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error("Name and email required")
      return
    }
    onSave(formData as Profile)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Name *</Label><Input value={formData.name || ""} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} /></div>
            <div><Label>Email *</Label><Input type="email" value={formData.email || ""} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Phone</Label><Input value={formData.phone || ""} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} /></div>
            <div><Label>Location</Label><Input value={formData.location || ""} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Role</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData(prev => ({ ...prev, role: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="dealer">Dealer</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as any }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Bio</Label><Textarea rows={3} value={formData.bio || ""} onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))} /></div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit"><Save className="h-4 w-4 mr-2" /> Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
