"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Save, Search, Edit } from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function SEOManagerPage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [seoPages, setSeoPages] = useState<any[]>([])

  const [formData, setFormData] = useState({
    pageName: "",
    title: "",
    description: "",
    keywords: "",
  })



  // API Functions
  const fetchSEOPages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/seo')
      const data = await response.json()
      
      if (data.success) {
        setSeoPages(data.data)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch SEO pages",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch SEO pages",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }



  const updateSEOPage = async (pageData: any) => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      })
      
      const data = await response.json()
      
      if (data.success) {
        await fetchSEOPages() // Refresh the list
        toast({
          title: "Success",
          description: "SEO page updated successfully",
        })
        return true
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update SEO page",
          variant: "destructive"
        })
        return false
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update SEO page",
        variant: "destructive"
      })
      return false
    } finally {
      setLoading(false)
    }
  }





  // Load SEO pages on component mount
  useEffect(() => {
    fetchSEOPages()
  }, [])

  const handleEdit = (page: any) => {
    setEditingId(page.id)
    setFormData({
      pageName: page.pageName,
      title: page.title,
      description: page.description,
      keywords: page.keywords,
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!formData.pageName || !formData.title || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    if (editingId) {
      const success = await updateSEOPage({
        id: editingId,
        ...formData
      })
      
      if (success) {
        handleCancel()
      }
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingId(null)
    setFormData({
      pageName: "",
      title: "",
      description: "",
      keywords: "",
    })
  }





  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-4xl font-bold bg-admin-gradient bg-clip-text text-transparent">
            SEO Manager
          </h1>
          <p className="text-gray-600 mt-2">Manage meta titles, descriptions, and keywords for all pages</p>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl  text-admin-primary">
                {editingId ? "Edit Page SEO" : "Add New Page SEO"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="pageName" className="text-base font-semibold">
                    Page Name *
                  </Label>
                  <Input
                    id="pageName"
                    value={formData.pageName}
                    onChange={(e) => setFormData({ ...formData, pageName: e.target.value })}
                    placeholder="e.g., Home Page"
                    className="mt-2"
                    disabled
                  />
                </div>
               
              </div>

              <div>
                <Label htmlFor="title" className="text-base font-semibold">
                  Meta Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="SEO optimized page title"
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">Length: {formData.title.length}/60 characters</p>
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-semibold">
                  Meta Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description for search engines"
                  rows={3}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">Length: {formData.description.length}/160 characters</p>
              </div>

              <div>
                <Label htmlFor="keywords" className="text-base font-semibold">
                  Keywords
                </Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                  className="mt-2"
                />
              </div>

             

              <div className="flex gap-4">
                <Button onClick={handleSave} className="bg-admin-gradient text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save SEO Settings
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>




      {/* SEO Pages List */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 bg-admin-gradient bg-clip-text text-transparent">
              <Search className="h-5 w-5 text-admin-primary" />
              Page SEO Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {seoPages.map((page) => (
                <div key={page.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">{page.pageName}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(page)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Title: </span>
                      <span className="text-sm text-gray-600">{page.title}</span>
                      <span className={`text-xs ml-2 ${page.title.length > 60 ? "text-red-500" : "text-green-500"}`}>
                        ({page.title.length}/60)
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Description: </span>
                      <span className="text-sm text-gray-600">{page.description}</span>
                      <span
                        className={`text-xs ml-2 ${page.description.length > 160 ? "text-red-500" : "text-green-500"}`}
                      >
                        ({page.description.length}/160)
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Keywords: </span>
                      <span className="text-sm text-gray-600">{page.keywords}</span>
                    </div>
                    <div className="text-xs text-gray-500">Last updated: {page.lastUpdated}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
