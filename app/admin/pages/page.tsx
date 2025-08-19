"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Save, X, FileText, Upload, ExternalLink, Globe } from "lucide-react"

export default function PagesPage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [pages, setPages] = useState([
    {
      id: 1,
      title: "Home",
      slug: "/",
      type: "main",
      status: "published",
      sections: [
        {
          id: 1,
          name: "Hero Section",
          title: "Engineering Excellence Redefined",
          subtitle: "Transform your engineering challenges into innovative solutions",
          content: "With our advanced CAD, CAE, and structural analysis services powered by cutting-edge technology.",
          image: "/placeholder.svg?height=600&width=1200",
          buttonText: "Get Started",
          buttonLink: "/contact",
        },
        {
          id: 2,
          name: "About Section",
          title: "Engineering Excellence Since 2019",
          subtitle: "",
          content:
            "Filigree Solutions is a leading provider of advanced CAD and CAE services, specializing in precision engineering solutions that drive innovation across industries.",
          image: "/placeholder.svg?height=400&width=600",
          buttonText: "",
          buttonLink: "",
        },
        {
          id: 3,
          name: "Stats Section",
          title: "Our Achievements",
          subtitle: "",
          content: "500+ Projects Completed, 50+ Happy Clients, 5+ Years Experience, 99% Client Satisfaction",
          image: "",
          buttonText: "",
          buttonLink: "",
        },
      ],
      seoTitle: "Filigree Solutions - Advanced CAD & CAE Services",
      seoDescription:
        "Leading provider of CAD, CAE, structural analysis, and engineering simulation services across India.",
      seoKeywords: "CAD services, CAE analysis, structural analysis, 3D modeling, engineering simulation",
      lastModified: "2024-01-15",
    },
    {
      id: 2,
      title: "About Us",
      slug: "/about",
      type: "main",
      status: "published",
      sections: [
        {
          id: 1,
          name: "Hero Section",
          title: "Engineering Excellence Redefined",
          subtitle: "Discover the story behind our commitment",
          content: "Learn about our journey, values, and the team that makes engineering excellence possible.",
          image: "/placeholder.svg?height=600&width=1200",
          buttonText: "Our Story",
          buttonLink: "#story",
        },
        {
          id: 2,
          name: "Company Story",
          title: "Our Story",
          subtitle: "Engineering Excellence Since 2019",
          content:
            "Founded in 2019, Filigree Solutions emerged from a vision to bridge the gap between complex engineering challenges and innovative solutions.",
          image: "/placeholder.svg?height=400&width=600",
          buttonText: "",
          buttonLink: "",
        },
        {
          id: 3,
          name: "Mission & Vision",
          title: "Our Foundation",
          subtitle: "The principles that guide our work",
          content:
            "Our mission is to empower industries with innovative engineering solutions. Our vision is to be the most trusted partner for engineering services.",
          image: "",
          buttonText: "",
          buttonLink: "",
        },
      ],
      seoTitle: "About Filigree Solutions - Our Story & Mission",
      seoDescription:
        "Learn about Filigree Solutions' journey, mission, vision, and the expert team behind our engineering excellence.",
      seoKeywords: "about filigree solutions, engineering company, CAD services company, mission vision",
      lastModified: "2024-01-12",
    },
    {
      id: 3,
      title: "Contact Us",
      slug: "/contact",
      type: "main",
      status: "published",
      sections: [
        {
          id: 1,
          name: "Hero Section",
          title: "Let's Discuss Your Engineering Needs",
          subtitle: "Ready to transform your engineering challenges?",
          content: "Contact our expert team today for professional CAD and CAE services.",
          image: "/placeholder.svg?height=600&width=1200",
          buttonText: "",
          buttonLink: "",
        },
        {
          id: 2,
          name: "Contact Information",
          title: "Get In Touch",
          subtitle: "We're here to help",
          content:
            "Phone: 9158549166, Email: info@filigreesolutions.com, Address: 88/153, East Street, Pandiyan Nagar, South Madurai, Madurai-625006",
          image: "/placeholder.svg?height=300&width=400",
          buttonText: "",
          buttonLink: "",
        },
      ],
      seoTitle: "Contact Filigree Solutions - Get Expert Engineering Services",
      seoDescription:
        "Contact Filigree Solutions for professional CAD, CAE, and engineering services. Get in touch with our expert team today.",
      seoKeywords: "contact filigree solutions, engineering services contact, CAD services quote",
      lastModified: "2024-01-10",
    },
  ])

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    type: "main",
    status: "published",
    sections: [],
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  })

  const [currentSection, setCurrentSection] = useState({
    id: 0,
    name: "",
    title: "",
    subtitle: "",
    content: "",
    image: "",
    buttonText: "",
    buttonLink: "",
  })

  const [editingSection, setEditingSection] = useState(false)

  const pageTypes = ["main", "landing", "blog", "custom"]
  const statusOptions = ["published", "draft", "archived"]

  const handleEdit = (page: any) => {
    setEditingId(page.id)
    setFormData({
      title: page.title,
      slug: page.slug,
      type: page.type,
      status: page.status,
      sections: page.sections,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      seoKeywords: page.seoKeywords,
    })
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editingId) {
      setPages(
        pages.map((page) =>
          page.id === editingId
            ? {
                ...page,
                ...formData,
                lastModified: new Date().toISOString().split("T")[0],
              }
            : page,
        ),
      )
      toast({
        title: "Page Updated",
        description: "Page has been successfully updated.",
      })
    } else {
      const newPage = {
        id: Math.max(...pages.map((p) => p.id)) + 1,
        ...formData,
        sections: [],
        lastModified: new Date().toISOString().split("T")[0],
      }
      setPages([...pages, newPage])
      toast({
        title: "Page Added",
        description: "New page has been successfully added.",
      })
    }

    handleCancel()
  }

  const handleDelete = (id: number) => {
    setPages(pages.filter((page) => page.id !== id))
    toast({
      title: "Page Deleted",
      description: "Page has been successfully deleted.",
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingId(null)
    setFormData({
      title: "",
      slug: "",
      type: "main",
      status: "published",
      sections: [],
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    })
    setCurrentSection({
      id: 0,
      name: "",
      title: "",
      subtitle: "",
      content: "",
      image: "",
      buttonText: "",
      buttonLink: "",
    })
    setEditingSection(false)
  }

  const handleSectionEdit = (section: any) => {
    setCurrentSection(section)
    setEditingSection(true)
  }

  const handleSectionSave = () => {
    if (currentSection.id === 0) {
      // Add new section
      const newSection = {
        ...currentSection,
        id: Math.max(...(formData.sections as any[]).map((s: any) => s.id), 0) + 1,
      }
      setFormData({
        ...formData,
        sections: [...(formData.sections as any[]), newSection],
      })
    } else {
      // Update existing section
      setFormData({
        ...formData,
        sections: (formData.sections as any[]).map((section: any) =>
          section.id === currentSection.id ? currentSection : section,
        ),
      })
    }
    setEditingSection(false)
    setCurrentSection({
      id: 0,
      name: "",
      title: "",
      subtitle: "",
      content: "",
      image: "",
      buttonText: "",
      buttonLink: "",
    })
  }

  const handleSectionDelete = (sectionId: number) => {
    setFormData({
      ...formData,
      sections: (formData.sections as any[]).filter((section: any) => section.id !== sectionId),
    })
  }

  const handleImageUpload = (field: string) => {
    const imageUrl = `/placeholder.svg?height=400&width=600&query=${currentSection.name || "section"} image`
    setCurrentSection({ ...currentSection, [field]: imageUrl })
    toast({
      title: "Image Uploaded",
      description: "Image has been successfully uploaded.",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Page Management</h1>
          <p className="text-gray-600 mt-2">Manage website pages and their content</p>
        </div>
        <Button onClick={() => setIsEditing(true)} className="btn-gradient text-white border-0">
          <Plus className="h-4 w-4 mr-2" />
          Add New Page
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total Pages",
            value: pages.length.toString(),
            gradient: "from-blue-500 to-purple-600",
          },
          {
            title: "Published",
            value: pages.filter((p) => p.status === "published").length.toString(),
            gradient: "from-green-500 to-teal-600",
          },
          {
            title: "Draft",
            value: pages.filter((p) => p.status === "draft").length.toString(),
            gradient: "from-orange-500 to-red-600",
          },
          {
            title: "Main Pages",
            value: pages.filter((p) => p.type === "main").length.toString(),
            gradient: "from-purple-500 to-pink-600",
          },
        ].map((stat, index) => (
          <Card key={index} className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}
              >
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-gray-600 text-sm font-medium">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Form */}
      {isEditing && (
        <Card className="shadow-xl border-0">
          <CardHeader className="gradient-card">
            <CardTitle className="text-2xl gradient-text">{editingId ? "Edit Page" : "Add New Page"}</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Basic Page Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold gradient-text">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title" className="text-base font-semibold">
                    Page Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter page title"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className="text-base font-semibold">
                    Page URL Slug *
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="/page-url"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-base font-semibold">Page Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pageTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-base font-semibold">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Page Sections */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold gradient-text">Page Sections</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCurrentSection({
                      id: 0,
                      name: "",
                      title: "",
                      subtitle: "",
                      content: "",
                      image: "",
                      buttonText: "",
                      buttonLink: "",
                    })
                    setEditingSection(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>

              {/* Sections List */}
              <div className="space-y-4">
                {(formData.sections as any[]).map((section: any, index: number) => (
                  <Card key={section.id} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{section.name}</h4>
                          <p className="text-gray-600 mb-2">{section.title}</p>
                          {section.subtitle && <p className="text-sm text-gray-500 mb-2">{section.subtitle}</p>}
                          <p className="text-sm text-gray-500 line-clamp-2">{section.content}</p>
                          {section.image && (
                            <div className="mt-2">
                              <img
                                src={section.image || "/placeholder.svg"}
                                alt={section.name}
                                className="w-20 h-12 object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline" onClick={() => handleSectionEdit(section)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleSectionDelete(section.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* SEO Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold gradient-text">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle" className="text-base font-semibold">
                    SEO Title
                  </Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="SEO optimized title"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="seoDescription" className="text-base font-semibold">
                    SEO Description
                  </Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    placeholder="SEO meta description"
                    rows={3}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="seoKeywords" className="text-base font-semibold">
                    SEO Keywords
                  </Label>
                  <Input
                    id="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                    placeholder="keyword1, keyword2, keyword3"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Button onClick={handleSave} className="btn-gradient text-white border-0">
                <Save className="h-4 w-4 mr-2" />
                Save Page
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Edit Modal */}
      {editingSection && (
        <Card className="shadow-xl border-0">
          <CardHeader className="gradient-card">
            <CardTitle className="text-xl gradient-text">
              {currentSection.id === 0 ? "Add New Section" : "Edit Section"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="sectionName" className="text-base font-semibold">
                  Section Name *
                </Label>
                <Input
                  id="sectionName"
                  value={currentSection.name}
                  onChange={(e) => setCurrentSection({ ...currentSection, name: e.target.value })}
                  placeholder="Hero Section"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="sectionTitle" className="text-base font-semibold">
                  Section Title
                </Label>
                <Input
                  id="sectionTitle"
                  value={currentSection.title}
                  onChange={(e) => setCurrentSection({ ...currentSection, title: e.target.value })}
                  placeholder="Section title"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="sectionSubtitle" className="text-base font-semibold">
                  Section Subtitle
                </Label>
                <Input
                  id="sectionSubtitle"
                  value={currentSection.subtitle}
                  onChange={(e) => setCurrentSection({ ...currentSection, subtitle: e.target.value })}
                  placeholder="Section subtitle"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="buttonText" className="text-base font-semibold">
                  Button Text
                </Label>
                <Input
                  id="buttonText"
                  value={currentSection.buttonText}
                  onChange={(e) => setCurrentSection({ ...currentSection, buttonText: e.target.value })}
                  placeholder="Get Started"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="sectionContent" className="text-base font-semibold">
                Section Content
              </Label>
              <Textarea
                id="sectionContent"
                value={currentSection.content}
                onChange={(e) => setCurrentSection({ ...currentSection, content: e.target.value })}
                placeholder="Section content..."
                rows={4}
                className="mt-2"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="buttonLink" className="text-base font-semibold">
                  Button Link
                </Label>
                <Input
                  id="buttonLink"
                  value={currentSection.buttonLink}
                  onChange={(e) => setCurrentSection({ ...currentSection, buttonLink: e.target.value })}
                  placeholder="/contact"
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-base font-semibold">Section Image</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleImageUpload("image")}
                    className="flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Input
                    placeholder="Or paste image URL"
                    value={currentSection.image}
                    onChange={(e) => setCurrentSection({ ...currentSection, image: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {currentSection.image && (
              <div>
                <img
                  src={currentSection.image || "/placeholder.svg"}
                  alt="Section preview"
                  className="w-full h-32 object-cover rounded-lg border"
                />
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t">
              <Button onClick={handleSectionSave} className="btn-gradient text-white border-0">
                <Save className="h-4 w-4 mr-2" />
                Save Section
              </Button>
              <Button variant="outline" onClick={() => setEditingSection(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pages List */}
      <div className="grid gap-6">
        {pages.map((page) => (
          <Card key={page.id} className="shadow-xl border-0">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-semibold text-gray-900">{page.title}</h3>
                    <Badge
                      variant={page.status === "published" ? "default" : "secondary"}
                      className={page.status === "published" ? "gradient-success text-white" : ""}
                    >
                      {page.status}
                    </Badge>
                    <Badge variant="outline">{page.type}</Badge>
                  </div>
                  <p className="text-gray-600 mb-4">
                    <Globe className="h-4 w-4 inline mr-2" />
                    {page.slug}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="font-semibold text-gray-900">Sections: </span>
                      <span className="text-gray-600">{page.sections.length}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Last Modified: </span>
                      <span className="text-gray-600">{page.lastModified}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">SEO Title:</h4>
                    <p className="text-gray-600 text-sm">{page.seoTitle}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">SEO Description:</h4>
                    <p className="text-gray-600 text-sm">{page.seoDescription}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-6">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(page)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(page.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Sections Preview */}
              {page.sections.length > 0 && (
                <div className="border-t pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Page Sections:</h4>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {page.sections.map((section: any) => (
                      <div key={section.id} className="p-4 border rounded-lg bg-gray-50">
                        <h5 className="font-medium text-gray-900">{section.name}</h5>
                        <p className="text-sm text-gray-600 mt-1">{section.title}</p>
                        {section.image && (
                          <img
                            src={section.image || "/placeholder.svg"}
                            alt={section.name}
                            className="w-full h-16 object-cover rounded mt-2"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {pages.length === 0 && (
        <Card className="shadow-xl border-0">
          <CardContent className="p-16 text-center">
            <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No pages found</h3>
            <p className="text-gray-600 mb-6">Add your first page to get started.</p>
            <Button onClick={() => setIsEditing(true)} className="btn-gradient text-white border-0">
              <Plus className="h-4 w-4 mr-2" />
              Add First Page
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
