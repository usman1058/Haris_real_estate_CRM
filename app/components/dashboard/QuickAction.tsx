"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Users, Home, Landmark, Search, BarChart3, MessageCircle } from "lucide-react"

const QuickActions = () => {
  const router = useRouter()

  const [openRecentDealers, setOpenRecentDealers] = useState(false)
  const [openRecentProperties, setOpenRecentProperties] = useState(false)
  const [openRecentDemands, setOpenRecentDemands] = useState(false)

  const [recentDealers, setRecentDealers] = useState<any[]>([])
  const [recentProperties, setRecentProperties] = useState<any[]>([])
  const [recentDemands, setRecentDemands] = useState<any[]>([])

  // Fetch recent lists when popups open
  useEffect(() => {
    if (openRecentDealers) {
      fetch("/api/dashboard?type=recent_dealers")
        .then((res) => res.json())
        .then((data) => setRecentDealers(Array.isArray(data) ? data : []))
    }
    if (openRecentProperties) {
      fetch("/api/dashboard?type=recent_properties")
        .then((res) => res.json())
        .then((data) => setRecentProperties(Array.isArray(data) ? data : []))
    }
    if (openRecentDemands) {
      fetch("/api/dashboard?type=recent_demands")
        .then((res) => res.json())
        .then((data) => setRecentDemands(Array.isArray(data) ? data : []))
    }
  }, [openRecentDealers, openRecentProperties, openRecentDemands])

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Navigate to Add Property */}
      <Button
        variant="outline"
        className="h-16 flex-col space-y-2 bg-transparent"
        onClick={() => router.push("/inventory/add")}
      >
        <Plus className="h-5 w-5" />
        <span className="text-xs">Add Property</span>
      </Button>

      {/* Navigate to Add Dealer */}
      <Button
        variant="outline"
        className="h-16 flex-col space-y-2 bg-transparent"
        onClick={() => router.push("/dealers/add")}
      >
        <Users className="h-5 w-5" />
        <span className="text-xs">Add Dealer</span>
      </Button>

      {/* Recent Properties Popup */}
      <Dialog open={openRecentProperties} onOpenChange={setOpenRecentProperties}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-16 flex-col space-y-2 bg-transparent">
            <Home className="h-5 w-5" />
            <span className="text-xs">Recent Properties</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recently Added Properties</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2 text-sm">
            {recentProperties.length === 0 ? (
              <p>No recent properties found.</p>
            ) : (
              recentProperties.map((p) => (
                <div key={p.id} className="border p-2 rounded-md">
                  <div><strong>{p.title}</strong> - {p.size} - Rs.{p.price}</div>
                  <div className="text-muted-foreground">{p.location}</div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Recent Dealers Popup */}
      <Dialog open={openRecentDealers} onOpenChange={setOpenRecentDealers}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-16 flex-col space-y-2 bg-transparent">
            <Landmark className="h-5 w-5" />
            <span className="text-xs">Recent Dealers</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recently Added Dealers</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2 text-sm">
            {recentDealers.length === 0 ? (
              <p>No recent dealers found.</p>
            ) : (
              recentDealers.map((d) => (
                <div key={d.id} className="border p-2 rounded-md">
                  <div><strong>{d.name}</strong></div>
                  {d.email && <div className="text-muted-foreground">{d.email}</div>}
                  {d.phone && <div className="text-muted-foreground">{d.phone}</div>}
                  {d.location && <div className="text-muted-foreground">{d.location}</div>}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Recent Demands Popup */}
      <Dialog open={openRecentDemands} onOpenChange={setOpenRecentDemands}>
        <DialogTrigger asChild>
          <Button variant="outline" className="h-16 flex-col space-y-2 bg-transparent">
            <Search className="h-5 w-5" />
            <span className="text-xs">Recent Demands</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recently Added Demands</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2 text-sm">
            {recentDemands.length === 0 ? (
              <p>No recent demands found.</p>
            ) : (
              recentDemands.map((d) => (
                <div key={d.id} className="border p-2 rounded-md">
                  <div><strong>{d.size}</strong> - {d.location}</div>
                  <div className="text-muted-foreground">Budget: Rs.{d.budget}</div>
                  {d.clientName && <div className="text-muted-foreground">Client: {d.clientName}</div>}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Go to Matches */}
      <Button
        variant="outline"
        className="h-16 flex-col space-y-2 bg-transparent"
        onClick={() => router.push("/matches")}
      >
        <BarChart3 className="h-5 w-5" />
        <span className="text-xs">View Matches</span>
      </Button>

      {/* Reports */}
      <Button
        variant="outline"
        className="h-16 flex-col space-y-2 bg-transparent"
        onClick={() => router.push("/reports")}
      >
        <BarChart3 className="h-5 w-5" />
        <span className="text-xs">Reports</span>
      </Button>

      {/* WhatsApp Campaign */}
      <Button
        variant="outline"
        className="h-16 flex-col space-y-2 bg-transparent"
        onClick={() => router.push("/whatsapp-campaign")}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-xs">WhatsApp Campaign</span>
      </Button>
    </div>
  )
}

export default QuickActions
