"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Upload, Search, ImageIcon, FileText, Video, Music, Download, Trash2, Eye, Copy, Filter } from "lucide-react"

export default function MediaLibraryPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [mediaItems, setMediaItems] = useState([
    {
      id: 1,
      name: "hero-banner-engineering.jpg",
      type: "image",
      size: "2.4 MB",
      dimensions: "1920x1080",
      url: "/placeholder.svg?height=400&width=600",
      uploadDate: "2024-01-15",
      category: "banners",
      alt: "Engineering hero banner",
      tags: ["hero", "banner", "engineering", "main"],
    },
    {
      id: 2,
      name: "about-company-image.jpg",
      type: "image",
      size: "1.8 MB",
      dimensions: "1200x800",
      url: "/placeholder.svg?height=400&width=600",
      uploadDate: "2024-01-14",
      category: "company",
      alt: "About company image",
      tags: ["about", "company", "team", "office"],
    },
    {
      id: 3,
      name: "cad-services-showcase.jpg",
      type: "image",
      size: "1.5 MB",
      dimensions: "1000x750",
      url: "/placeholder.svg?height=400&width=600",
      uploadDate: "2024-01-13",
      category: "services",
      alt: "CAD services showcase",
      tags: ["cad", "services", "3d", "modeling"],
    },
    {
      id: 4,
      name: "structural-analysis-demo.jpg",
      type: "image",
      size: "2.1 MB",
      dimensions: "1400x900",
      url: "/placeholder.svg?height=400&width=600",
      uploadDate: "2024-01-12",
      category: "services",
      alt: "Structural analysis demonstration",
      tags: ["structural", "analysis", "fea", "simulation"],
    },
    {
      id: 5,
      name: "portfolio-telecom-tower.jpg",
      type: "image",
      size: "1.9 MB",
      dimensions: "1200x900",
      url: "/placeholder.svg?height=400&width=600",
      uploadDate: "2024-01-11",
      category: "portfolio",
      alt: "Telecom tower project",
      tags: ["portfolio", "telecom", "tower", "analysis"],
    },
    {
      id: 6,
      name: "ev-battery-simulation.jpg",
      type: "image",
      size: "1.7 MB",
      dimensions: "1100x800",
      url: "/placeholder.svg?height=400&width=600",
      uploadDate: "2024-01-10",
      category: "portfolio",
      alt: "EV battery simulation project",
      tags: ["ev", "battery", "simulation", "automotive"],
    },
    {
      id: 7,
      name: "company-presentation.pdf",
      type: "document",
      size: "5.2 MB",
      dimensions: "PDF Document",
      url: "/placeholder.svg?height=200&width=150",
      uploadDate: "2024-01-09",
      category: "documents",
      alt: "Company presentation PDF",
      tags: ["presentation", "company", "brochure"],
    },
    {
      id: 8,
      name: "service-overview-video.mp4",
      type: "video",
      size: "25.6 MB",
      dimensions: "1920x1080",
      url: "/placeholder.svg?height=300&width=400",
      uploadDate: "2024-01-08",
      category: "videos",
      alt: "Service overview video",
      tags: ["video", "services", "overview", "demo"],
    },
  ])

  const categories = ["all", "banners", "company", "services", "portfolio", "documents", "videos"]
  const mediaTypes = ["all", "image", "document", "video", "audio"]

  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.alt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || item.type === filterType
    return matchesSearch && matchesType
  })

  const handleUpload = () => {
    // Simulate file upload
    const newItem = {
      id: Math.max(...mediaItems.map((item) => item.id)) + 1,
      name: `uploaded-image-${Date.now()}.jpg`,
      type: "image",
      size: "1.2 MB",
      dimensions: "800x600",
      url: "/placeholder.svg?height=400&width=600",
      uploadDate: new Date().toISOString().split("T")[0],
      category: "uploads",
      alt: "Newly uploaded image",
      tags: ["new", "upload"],
    }

    setMediaItems([newItem, ...mediaItems])
    toast({
      title: "File Uploaded",
      description: "File has been successfully uploaded to media library.",
    })
  }

  const handleDelete = (id: number) => {
    setMediaItems(mediaItems.filter((item) => item.id !== id))
    setSelectedItems(selectedItems.filter((selectedId) => selectedId !== id))
    toast({
      title: "File Deleted",
      description: "File has been successfully deleted from media library.",
    })
  }

  const handleBulkDelete = () => {
    setMediaItems(mediaItems.filter((item) => !selectedItems.includes(item.id)))
    setSelectedItems([])
    toast({
      title: "Files Deleted",
      description: `${selectedItems.length} files have been successfully deleted.`,
    })
  }

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((selectedId) => selectedId !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => item.id))
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "URL Copied",
      description: "File URL has been copied to clipboard.",
    })
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-6 w-6" />
      case "document":
        return <FileText className="h-6 w-6" />
      case "video":
        return <Video className="h-6 w-6" />
      case "audio":
        return <Music className="h-6 w-6" />
      default:
        return <FileText className="h-6 w-6" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "from-green-500 to-teal-600"
      case "document":
        return "from-blue-500 to-purple-600"
      case "video":
        return "from-purple-500 to-pink-600"
      case "audio":
        return "from-orange-500 to-red-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Media Library</h1>
          <p className="text-gray-600 mt-2">Manage your website images, documents, and media files</p>
        </div>
        <Button onClick={handleUpload} className="btn-gradient text-white border-0">
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total Files",
            value: mediaItems.length.toString(),
            gradient: "from-blue-500 to-purple-600",
          },
          {
            title: "Images",
            value: mediaItems.filter((item) => item.type === "image").length.toString(),
            gradient: "from-green-500 to-teal-600",
          },
          {
            title: "Documents",
            value: mediaItems.filter((item) => item.type === "document").length.toString(),
            gradient: "from-purple-500 to-pink-600",
          },
          {
            title: "Videos",
            value: mediaItems.filter((item) => item.type === "video").length.toString(),
            gradient: "from-orange-500 to-red-600",
          },
        ].map((stat, index) => (
          <Card key={index} className="shadow-lg border-0">
            <CardContent className="p-6 text-center">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}
              >
                <ImageIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-gray-600 text-sm font-medium">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="File Type" />
                </SelectTrigger>
                <SelectContent>
                  {mediaTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedItems.length > 0 && (
                <div className="flex gap-2">
                  <Badge variant="secondary">{selectedItems.length} selected</Badge>
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                    Delete Selected
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="shadow-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Media Files</h3>
          <p className="text-gray-600 mb-6">Drag and drop files here or click to upload</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleUpload} className="btn-gradient text-white border-0">
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
            <Button variant="outline">
              <ImageIcon className="h-4 w-4 mr-2" />
              Upload from URL
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Supported formats: JPG, PNG, GIF, PDF, MP4, MP3. Max file size: 10MB
          </p>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className={`card-hover shadow-lg border-0 overflow-hidden cursor-pointer ${
              selectedItems.includes(item.id) ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <div className="relative">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {item.type === "image" ? (
                  <img src={item.url || "/placeholder.svg"} alt={item.alt} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${getTypeColor(item.type)} rounded-2xl flex items-center justify-center`}
                  >
                    <div className="text-white">{getFileIcon(item.type)}</div>
                  </div>
                )}
              </div>
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  className="rounded"
                />
              </div>
              <div className="absolute top-2 right-2">
                <Badge className={`bg-gradient-to-r ${getTypeColor(item.type)} text-white text-xs`}>{item.type}</Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 truncate" title={item.name}>
                {item.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{item.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimensions:</span>
                  <span>{item.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{item.uploadDate}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(item.url)} className="flex-1">
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="shadow-xl border-0">
          <CardContent className="p-16 text-center">
            <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No media files found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? "Try adjusting your search criteria." : "Upload your first media file to get started."}
            </p>
            <Button onClick={handleUpload} className="btn-gradient text-white border-0">
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
