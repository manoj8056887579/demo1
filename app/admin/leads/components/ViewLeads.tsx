"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  Star,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  MapPin,
  Globe,
  Briefcase,
  Target,
  TrendingUp,
  Activity,
  Copy,
  ExternalLink,
  Edit,
  X
} from "lucide-react"

interface Lead {
  _id?: string
  id: number
  fullName?: string
  name: string
  email: string
  phone: string
  company: string
  service: string
  message: string
  projectDescription?: string
  additionalRequirements?: string
  status: "new" | "contacted" | "qualified" | "converted" | "closed"
  priority: "low" | "medium" | "high"
  formSource?: "quotation" | "contact" | "lead"
  submittedAt: string
  lastUpdated: string
}

interface ViewLeadsProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
}

export default function ViewLeads({ lead, isOpen, onClose }: ViewLeadsProps) {
  if (!lead) return null


  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4" />
      case "contacted":
        return <Clock className="h-4 w-4" />
      case "qualified":
        return <Star className="h-4 w-4" />
      case "converted":
        return <CheckCircle className="h-4 w-4" />
      case "closed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusGradient = (status: string) => {
    switch (status) {
      case "new":
        return "from-blue-500 to-cyan-500"
      case "contacted":
        return "from-yellow-500 to-orange-500"
      case "qualified":
        return "from-purple-500 to-pink-500"
      case "converted":
        return "from-green-500 to-emerald-500"
      case "closed":
        return "from-gray-500 to-slate-500"
      default:
        return "from-gray-500 to-slate-500"
    }
  }

  const getPriorityGradient = (priority: string) => {
    switch (priority) {
      case "high":
        return "from-red-500 to-rose-500"
      case "medium":
        return "from-orange-500 to-amber-500"
      case "low":
        return "from-green-500 to-teal-500"
      default:
        return "from-gray-500 to-slate-500"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0 bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Header Section */}
        <div className="relative bg-admin-gradient p-8 text-white">
         
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{lead.name}</h1>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{lead.email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-white/20"
                      onClick={() => copyToClipboard(lead.email)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{lead.phone}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-white/20"
                        onClick={() => copyToClipboard(lead.phone)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
           
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-3 mt-6">
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getStatusGradient(lead.status)} text-white font-medium flex items-center gap-2 shadow-lg`}>
              {getStatusIcon(lead.status)}
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </div>
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getPriorityGradient(lead.priority)} text-white font-medium flex items-center gap-2 shadow-lg`}>
              <TrendingUp className="h-4 w-4" />
              {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)} Priority
            </div>
            {lead.formSource && (
              <div className="px-4 py-2 rounded-full bg-white/20 text-white font-medium flex items-center gap-2 backdrop-blur-sm">
                <Globe className="h-4 w-4" />
                {lead.formSource.charAt(0).toUpperCase() + lead.formSource.slice(1)} Form
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            
            {/* Left Column - Contact & Company Info */}
            <div className="space-y-6 ">
              {/* Contact Information */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Full Name</span>
                      <Button
                        variant="ghost"
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => copyToClipboard(lead.name)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="font-semibold text-gray-900 text-lg">{lead.name}</p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Email Address</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(lead.email)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => window.open(`mailto:${lead.email}`)}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="font-semibold text-blue-600 text-sm">{lead.email}</p>
                  </div>

                  {lead.phone && (
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Phone Number</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(lead.phone)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => window.open(`tel:${lead.phone}`)}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900 text-lg">{lead.phone}</p>
                    </div>
                  )}

                  {lead.company && (
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Company</span>
                        <Building className="h-4 w-4 text-gray-400" />
                      </div>
                      <p className="font-semibold text-gray-900 text-lg">{lead.company}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Service & Timeline */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    Service & Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Requested Service</span>
                      <Target className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="font-semibold text-indigo-600 text-lg">{lead.service}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-600">Submitted</span>
                      </div>
                      <p className="font-semibold text-gray-900">{formatDate(lead.submittedAt)}</p>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-600">Last Updated</span>
                      </div>
                      <p className="font-semibold text-gray-900">{formatDate(lead.lastUpdated)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Messages & Details */}
            <div className=" space-y-6">
              {/* Initial Message */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    Initial Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {lead.message || "No initial message provided."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Project Description */}
              {lead.projectDescription && (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      Project Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {lead.projectDescription}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Additional Requirements */}
              {lead.additionalRequirements && (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Star className="h-5 w-5 text-white" />
                      </div>
                      Additional Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {lead.additionalRequirements}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg flex items-center justify-center">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      className="h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium shadow-lg"
                      onClick={() => window.open(`mailto:${lead.email}`)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    {lead.phone && (
                      <Button
                        className="h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium shadow-lg"
                        onClick={() => window.open(`tel:${lead.phone}`)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}