"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import RichTextEditor from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Settings,
  Upload,
  ImageIcon,
} from "lucide-react";
import "@/styles/quill.css";

interface ProcessStep {
  title: string;
  description: string;
}

interface Service {
  _id?: string;
  title: string;
  heading: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  applications: string[];
  technologies: string[];
  image: string;
  gallery: string[];
  status: string;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  process: ProcessStep[];
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalServices: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// RichTextEditor component handles dynamic import of react-quill on the client

export default function ServicesPage() {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  

  // Quill configuration - only allow paragraph, bullet list, and numbered list
  const quillModules = {
    toolbar: {
      container: [[{ list: "ordered" }, { list: "bullet" }], ["clean"]],
    },
  };

  const quillFormats = ["list", "bullet"];

  // Helper function to check if ReactQuill content is empty
  const isQuillContentEmpty = (content: string) => {
    if (!content) return true;
    // Remove HTML tags and check if there's actual text content
    const textContent = content.replace(/<[^>]*>/g, "").trim();
    return textContent === "";
  };

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalServices: 0,
    limit: 6,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [formData, setFormData] = useState({
    title: "",
    heading: "",
    shortDescription: "",
    fullDescription: "",
    features: "",
    applications: "",
    technologies: "",
    image: "",
    gallery: [] as string[],
    status: "active",
    featured: false,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  // Check if maximum featured services limit reached (3 featured services max)
  const maxFeaturedReached =
    services.filter((service) => service.featured).length >= 3;

  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([
    { title: "", description: "" },
  ]);

  // Fetch services from API
  const fetchServices = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/services?page=${page}&limit=6&isAdmin=true`
      );
      const data = await response.json();

      if (data.success) {
        setServices(data.data);
        setPagination(data.pagination);
        setCurrentPage(page);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch services",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage]);

  const handleEdit = (service: Service) => {
    setEditingId(service._id || null);
    setFormData({
      title: service.title,
      heading: service.heading,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      features: service.features.join(", "),
      applications: service.applications.join(", "),
      technologies: service.technologies.join(", "),
      image: service.image,
      gallery: service.gallery || [],
      status: service.status,
      featured: service.featured,
      seoTitle: service.seoTitle,
      seoDescription: service.seoDescription,
      seoKeywords: service.seoKeywords,
    });
    setProcessSteps(service.process || [{ title: "", description: "" }]);
    setSelectedFiles({
      mainImage: null,
      galleryImages: [],
    });
    setIsAddModalOpen(true);
  };

  const handleSave = async () => {
    setIsFormSubmitted(true);

    // Validate required fields
    if (
      !formData.title ||
      !formData.heading ||
      !formData.shortDescription ||
      isQuillContentEmpty(formData.fullDescription) ||
      !formData.features ||
      !formData.applications ||
      !formData.technologies ||
      !formData.image ||
      !formData.seoTitle ||
      !formData.seoDescription ||
      !formData.seoKeywords ||
      processSteps.some((step) => !step.title || !step.description)
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      let finalImagePath = formData.image;
      let finalGalleryPaths = [...formData.gallery];

      // Upload main image if a new file is selected
      if (selectedFiles.mainImage) {
        const serviceTitle = formData.title || "untitled";
        const serviceTitleSlug = serviceTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFiles.mainImage);
        uploadFormData.append("type", "main");
        uploadFormData.append("serviceTitle", serviceTitleSlug);
        uploadFormData.append("action", "upload");

        const response = await fetch("/api/admin/services", {
          method: "POST",
          body: uploadFormData,
        });

        const result = await response.json();
        if (result.success) {
          finalImagePath = result.filePath;
        } else {
          throw new Error(result.message);
        }
      }

      // Upload gallery images if new files are selected
      if (selectedFiles.galleryImages.length > 0) {
        const serviceTitle = formData.title || "untitled";
        const serviceTitleSlug = serviceTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const uploadPromises = selectedFiles.galleryImages.map(async (file) => {
          const uploadFormData = new FormData();
          uploadFormData.append("file", file);
          uploadFormData.append("type", "gallery");
          uploadFormData.append("serviceTitle", serviceTitleSlug);
          uploadFormData.append("action", "upload");

          const response = await fetch("/api/admin/services", {
            method: "POST",
            body: uploadFormData,
          });

          const result = await response.json();
          if (result.success) {
            return result.filePath;
          } else {
            throw new Error(result.message);
          }
        });

        const uploadedPaths = await Promise.all(uploadPromises);

        // Replace blob URLs with actual file paths
        finalGalleryPaths = formData.gallery.map((url) => {
          if (url.startsWith("blob:")) {
            const index = formData.gallery
              .filter((u) => u.startsWith("blob:"))
              .indexOf(url);
            return uploadedPaths[index] || url;
          }
          return url;
        });
      }

      const serviceData = {
        ...formData,
        image: finalImagePath,
        gallery: finalGalleryPaths,
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
        applications: formData.applications
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
        technologies: formData.technologies
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
        process: processSteps
          .filter((step) => step.title.trim() && step.description.trim())
          .map((step, index) => ({
            step: String(index + 1).padStart(2, "0"),
            title: step.title.trim(),
            description: step.description.trim(),
          })),
      };

      const url = editingId
        ? `/api/admin/services/${editingId}`
        : "/api/admin/services";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: editingId ? "Service Updated" : "Service Added",
          description: `Service has been successfully ${
            editingId ? "updated" : "added"
          }.`,
        });
        fetchServices(currentPage);
        handleCancel();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save service",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive",
      });
    }
  };

  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(
    null
  );

  const handleDeleteClick = (id: string) => {
    setDeletingServiceId(id);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Service Deleted",
          description: "Service has been successfully deleted.",
        });
        setDeletingServiceId(null);

        // Check if we need to go back to previous page
        const remainingServices = services.filter((s) => s._id !== id);
        if (remainingServices.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchServices(currentPage);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to delete service",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    // Store current scroll position
    const currentScroll = window.scrollY;

    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingId(null);
    setFormData({
      title: "",
      heading: "",
      shortDescription: "",
      fullDescription: "",
      features: "",
      applications: "",
      technologies: "",
      image: "",
      gallery: [],
      status: "active",
      featured: false,
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    });
    setProcessSteps([{ title: "", description: "" }]);
    setSelectedFiles({
      mainImage: null,
      galleryImages: [],
    });

    // Restore scroll position after state updates
    setTimeout(
      () =>
        window.scrollTo({
          top: currentScroll,
          behavior: "instant",
        }),
      0
    );
  };

  const addProcessStep = () => {
    setProcessSteps([...processSteps, { title: "", description: "" }]);
  };

  const removeProcessStep = (index: number) => {
    if (processSteps.length > 1) {
      setProcessSteps(processSteps.filter((_, i) => i !== index));
    }
  };

  const updateProcessStep = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const updatedSteps = [...processSteps];
    updatedSteps[index][field] = value;
    setProcessSteps(updatedSteps);
  };

  const [selectedFiles, setSelectedFiles] = useState<{
    mainImage: File | null;
    galleryImages: File[];
  }>({
    mainImage: null,
    galleryImages: [],
  });

  const handleImageUpload = (type: "main" | "gallery") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = type === "gallery";
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        if (type === "main") {
          setSelectedFiles((prev) => ({ ...prev, mainImage: files[0] }));
          // Create preview URL
          const previewUrl = URL.createObjectURL(files[0]);
          setFormData((prev) => ({ ...prev, image: previewUrl }));
        } else {
          setSelectedFiles((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, ...files],
          }));
          // Create preview URLs
          const previewUrls = files.map((file) => URL.createObjectURL(file));
          setFormData((prev) => ({
            ...prev,
            gallery: [...prev.gallery, ...previewUrls],
          }));
        }

        toast({
          title: "Images Selected",
          description: `${files.length} image(s) selected. Click Save to upload.`,
        });
      }
    };
    input.click();
  };

  const removeGalleryImage = (index: number) => {
    const removedUrl = formData.gallery[index];

    // If it's a blob URL (newly selected file), also remove from selectedFiles
    if (removedUrl && removedUrl.startsWith("blob:")) {
      const blobIndex = formData.gallery
        .filter((url) => url.startsWith("blob:"))
        .indexOf(removedUrl);
      if (blobIndex !== -1) {
        setSelectedFiles((prev) => ({
          ...prev,
          galleryImages: prev.galleryImages.filter((_, i) => i !== blobIndex),
        }));
      }
    }

    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const { currentPage, totalPages } = pagination;

    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          onClick={() => handlePageChange(currentPage - 1)}
          className={
            !pagination.hasPrevPage
              ? "pointer-events-none opacity-50"
              : "cursor-pointer"
          }
        />
      </PaginationItem>
    );

    // Page numbers
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={`cursor-pointer ${
                currentPage === i
                  ? "bg-admin-gradient text-white border-0 hover:bg-admin-gradient"
                  : ""
              }`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className={`cursor-pointer ${
              currentPage === 1
                ? "bg-admin-gradient text-white border-0 hover:bg-admin-gradient"
                : ""
            }`}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show current page and surrounding pages
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className={`cursor-pointer ${
                currentPage === i
                  ? "bg-admin-gradient text-white border-0 hover:bg-admin-gradient"
                  : ""
              }`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            className={`cursor-pointer ${
              currentPage === totalPages
                ? "bg-admin-gradient text-white border-0 hover:bg-admin-gradient"
                : ""
            }`}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={() => handlePageChange(currentPage + 1)}
          className={
            !pagination.hasNextPage
              ? "pointer-events-none opacity-50"
              : "cursor-pointer"
          }
        />
      </PaginationItem>
    );

    return items;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-admin-gradient bg-clip-text text-transparent">
            Services Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your service offerings with detailed content and images
          </p>
        </div>

        <Dialog
          open={isAddModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsFormSubmitted(false);
              handleCancel();
              // Preserve scroll position when closing modal
              const currentScroll = window.scrollY;
              setTimeout(
                () =>
                  window.scrollTo({
                    top: currentScroll,
                    behavior: "instant",
                  }),
                0
              );
            }
            setIsAddModalOpen(open);
            if (!open) {
              setEditingId(null);
              setFormData({
                title: "",
                heading: "",
                shortDescription: "",
                fullDescription: "",
                features: "",
                applications: "",
                technologies: "",
                image: "",
                gallery: [],
                status: "active",
                featured: false,
                seoTitle: "",
                seoDescription: "",
                seoKeywords: "",
              });
              setProcessSteps([{ title: "", description: "" }]);
              setSelectedFiles({
                mainImage: null,
                galleryImages: [],
              });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  title: "",
                  heading: "",
                  shortDescription: "",
                  fullDescription: "",
                  features: "",
                  applications: "",
                  technologies: "",
                  image: "",
                  gallery: [],
                  status: "active",
                  featured: false,
                  seoTitle: "",
                  seoDescription: "",
                  seoKeywords: "",
                });
                setProcessSteps([{ title: "", description: "" }]);
                setSelectedFiles({
                  mainImage: null,
                  galleryImages: [],
                });
                setIsAddModalOpen(true);
              }}
              className="bg-admin-gradient text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle className="text-2xl bg-admin-gradient bg-clip-text text-transparent">
                {editingId ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-8 p-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title" className="text-base font-semibold">
                      Service Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter service title"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.title
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.title && (
                      <p className="text-sm text-red-500 mt-1">
                        Title is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="heading"
                      className="text-base font-semibold"
                    >
                      Service Heading (Detail Page){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="heading"
                      value={formData.heading}
                      onChange={(e) =>
                        setFormData({ ...formData, heading: e.target.value })
                      }
                      placeholder="Enter heading for service detail page"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.heading
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.heading && (
                      <p className="text-sm text-red-500 mt-1">
                        Heading is required
                      </p>
                    )}
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <Label
                    htmlFor="shortDescription"
                    className="text-base font-semibold"
                  >
                    Short Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shortDescription: e.target.value,
                      })
                    }
                    placeholder="Brief description for service cards and listings"
                    rows={3}
                    className={`mt-2 ${
                      isFormSubmitted && !formData.shortDescription
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {isFormSubmitted && !formData.shortDescription && (
                    <p className="text-sm text-red-500 mt-1">
                      Short description is required
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="fullDescription"
                    className="text-base font-semibold"
                  >
                    Full Description <span className="text-red-500">*</span>
                  </Label>
                  <div className={`mt-2 ${isFormSubmitted && isQuillContentEmpty(formData.fullDescription) ? "quill-error" : ""}`}>
  <RichTextEditor
    value={formData.fullDescription}
    onChange={(content: string) => setFormData({
      ...formData,
      fullDescription: content,
    })}
    modules={quillModules}
    formats={quillFormats}
    placeholder="Detailed description for service detail page. Use the toolbar to add bullet points and numbered lists."
  />
</div>
                  {isFormSubmitted &&
                    isQuillContentEmpty(formData.fullDescription) && (
                      <p className="text-sm text-red-500 mt-1">
                        Full description is required
                      </p>
                    )}
                  <p className="text-sm text-gray-500 mt-1">
                    Use the toolbar above to format your text with bullet points
                    and numbered lists.
                  </p>
                </div>
              </div>

              {/* Features and Applications */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Features & Applications
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="features"
                      className="text-base font-semibold"
                    >
                      Key Features (comma-separated){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="features"
                      value={formData.features}
                      onChange={(e) =>
                        setFormData({ ...formData, features: e.target.value })
                      }
                      placeholder="Feature 1, Feature 2, Feature 3"
                      rows={4}
                      className={`mt-2 ${
                        isFormSubmitted && !formData.features
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.features && (
                      <p className="text-sm text-red-500 mt-1">
                        At least one feature is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="applications"
                      className="text-base font-semibold"
                    >
                      Applications (comma-separated){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="applications"
                      value={formData.applications}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          applications: e.target.value,
                        })
                      }
                      placeholder="Application 1, Application 2, Application 3"
                      rows={4}
                      className={`mt-2 ${
                        isFormSubmitted && !formData.applications
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.applications && (
                      <p className="text-sm text-red-500 mt-1">
                        At least one application is required
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="technologies"
                    className="text-base font-semibold"
                  >
                    Technologies (comma-separated){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="technologies"
                    value={formData.technologies}
                    onChange={(e) =>
                      setFormData({ ...formData, technologies: e.target.value })
                    }
                    placeholder="Technology 1, Technology 2, Technology 3"
                    rows={3}
                    className={`mt-2 ${
                      isFormSubmitted && !formData.technologies
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {isFormSubmitted && !formData.technologies && (
                    <p className="text-sm text-red-500 mt-1">
                      At least one technology is required
                    </p>
                  )}
                </div>
              </div>

              {/* Process Steps */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                    Process Steps
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addProcessStep}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>

                <div className="space-y-4">
                  {processSteps.map((step, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">
                          Step {index + 1}
                        </Label>
                        {processSteps.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeProcessStep(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor={`step-title-${index}`}
                            className="text-sm font-medium"
                          >
                            Step Title <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`step-title-${index}`}
                            value={step.title}
                            onChange={(e) =>
                              updateProcessStep(index, "title", e.target.value)
                            }
                            placeholder="Enter step title"
                            className={`mt-1 ${
                              isFormSubmitted && !step.title
                                ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                                : ""
                            }`}
                          />
                          {isFormSubmitted && !step.title && (
                            <p className="text-sm text-red-500 mt-1">
                              Step title is required
                            </p>
                          )}
                        </div>
                        <div>
                          <Label
                            htmlFor={`step-description-${index}`}
                            className="text-sm font-medium"
                          >
                            Step Description{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`step-description-${index}`}
                            value={step.description}
                            onChange={(e) =>
                              updateProcessStep(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Enter step description"
                            className={`mt-1 ${
                              isFormSubmitted && !step.description
                                ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                                : ""
                            }`}
                          />
                          {isFormSubmitted && !step.description && (
                            <p className="text-sm text-red-500 mt-1">
                              Step description is required
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Management */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Image Management
                </h3>

                {/* Main Service Image */}
                <div>
                  <Label className="text-base font-semibold">
                    Main Service Image <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-gray-500 mt-1 mb-2">
                    Recommended resolution: 1200x800 pixels (3:2 aspect ratio)
                    for optimal display across all devices
                  </p>
                  <div
                    className={`mt-2 space-y-4 ${
                      isFormSubmitted && !formData.image
                        ? "ring-1 ring-red-500 rounded-lg p-4"
                        : ""
                    }`}
                  >
                    {formData.image && (
                      <div className="relative">
                        <img
                          src={formData.image || "/placeholder.svg"}
                          alt="Service preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            setFormData({ ...formData, image: "" })
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleImageUpload("main")}
                        className="flex items-center"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Main Image
                      </Button>
                      <Input
                        placeholder="Or paste image URL"
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Gallery Images */}
                <div
                  className={`mt-2 space-y-4 ${
                    isFormSubmitted && !formData.image
                      ? "ring-1 ring-red-500 rounded-lg p-4"
                      : ""
                  }`}
                >
                  <Label className="text-base font-semibold">
                    Gallery Images
                  </Label>
                  <div className="mt-2 space-y-4">
                    {formData.gallery.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.gallery.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url || "/placeholder.svg"}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 h-6 w-6 rounded-full p-0"
                              onClick={() => removeGalleryImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleImageUpload("gallery")}
                      className="flex items-center w-full"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Upload Gallery Images
                    </Button>
                    <p className="text-sm text-gray-500">
                      You can select multiple images at once for the gallery.
                    </p>
                  </div>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  SEO Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="seoTitle"
                      className="text-base font-semibold"
                    >
                      SEO Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="seoTitle"
                      value={formData.seoTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, seoTitle: e.target.value })
                      }
                      placeholder="SEO optimized title for search engines"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.seoTitle
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.seoTitle && (
                      <p className="text-sm text-red-500 mt-1">
                        SEO title is required
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Recommended: 50-60 characters
                    </p>
                  </div>
                  <div>
                    <Label
                      htmlFor="seoDescription"
                      className="text-base font-semibold"
                    >
                      SEO Meta Description{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="seoDescription"
                      value={formData.seoDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seoDescription: e.target.value,
                        })
                      }
                      placeholder="Brief description that appears in search results"
                      rows={3}
                      className={`mt-2 ${
                        isFormSubmitted && !formData.seoDescription
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.seoDescription && (
                      <p className="text-sm text-red-500 mt-1">
                        SEO description is required
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Recommended: 150-160 characters
                    </p>
                  </div>
                  <div>
                    <Label
                      htmlFor="seoKeywords"
                      className="text-base font-semibold"
                    >
                      SEO Keywords <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="seoKeywords"
                      value={formData.seoKeywords}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seoKeywords: e.target.value,
                        })
                      }
                      placeholder="keyword1, keyword2, keyword3"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.seoKeywords
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.seoKeywords && (
                      <p className="text-sm text-red-500 mt-1">
                        SEO keywords are required
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Separate keywords with commas
                    </p>
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Settings
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-base font-semibold">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 mt-8">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      disabled={maxFeaturedReached && !formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      title={
                        maxFeaturedReached && !formData.featured
                          ? "Maximum 3 featured services allowed"
                          : ""
                      }
                    />
                    <Label
                      htmlFor="featured"
                      className={`text-base font-semibold ${
                        maxFeaturedReached && !formData.featured
                          ? "text-gray-400"
                          : ""
                      }`}
                    >
                      Featured Service
                    </Label>
                    {maxFeaturedReached && !formData.featured && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Max 3 featured services)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  onClick={handleSave}
                  className="bg-admin-gradient text-white border-0"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Service
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingServiceId}
        onOpenChange={(open) => !open && setDeletingServiceId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingServiceId && handleDelete(deletingServiceId)
              }
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Services List */}
      <div className="grid gap-8">
        {services.map((service) => (
          <Card
            key={service._id}
            className="shadow-xl border-0 overflow-hidden"
          >
            <div className="grid lg:grid-cols-3 gap-0">
              {/* Service Image */}
              <div className="relative h-[500px] w-full">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge
                    variant={
                      service.status === "active" ? "default" : "secondary"
                    }
                    className="bg-white/90 text-gray-900"
                  >
                    {service.status}
                  </Badge>
                  {service.featured && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              {/* Service Content */}
              <div className="lg:col-span-2 p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {service.title}
                    </h3>
                    <h4 className="text-lg text-admin-primary mb-3 font-semibold">
                      {service.heading}
                    </h4>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {service.shortDescription}
                    </p>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Key Features:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {service.features.slice(0, 4).map((feature, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                        {service.features.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{service.features.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Technologies:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech, index) => (
                          <Badge
                            key={index}
                            className="bg-admin-gradient text-white"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Gallery Preview */}
                    {service.gallery.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Gallery ({service.gallery.length} images):
                        </h4>
                        <div className="flex gap-2">
                          {service.gallery.slice(0, 3).map((img, index) => (
                            <img
                              key={index}
                              src={img || "/placeholder.svg"}
                              alt={`Gallery ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg border"
                            />
                          ))}
                          {service.gallery.length > 3 && (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center text-xs text-gray-500">
                              +{service.gallery.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-6">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteClick(service._id!)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* SEO Info */}
                <div className="border-t pt-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-900">
                        SEO Title:{" "}
                      </span>
                      <span className="text-gray-600">
                        {service.seoTitle || "Not set"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">
                        Process Steps:{" "}
                      </span>
                      <span className="text-gray-600">
                        {service.process.length} steps
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4">
          <Pagination>
            <PaginationContent>{renderPaginationItems()}</PaginationContent>
          </Pagination>
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
            {Math.min(currentPage * pagination.limit, pagination.totalServices)}{" "}
            of {pagination.totalServices} services
          </div>
        </div>
      )}

      {services.length === 0 && !loading && (
        <Card className="shadow-xl border-0">
          <CardContent className="p-16 text-center">
            <div className="w-20 h-20 bg-admin-gradient rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Settings className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No services found
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first service to get started with your service offerings.
            </p>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  title: "",
                  heading: "",
                  shortDescription: "",
                  fullDescription: "",
                  features: "",
                  applications: "",
                  technologies: "",
                  image: "",
                  gallery: [],
                  status: "active",
                  featured: false,
                  seoTitle: "",
                  seoDescription: "",
                  seoKeywords: "",
                });
                setProcessSteps([{ title: "", description: "" }]);
                setSelectedFiles({
                  mainImage: null,
                  galleryImages: [],
                });
                setIsAddModalOpen(true);
              }}
              className="bg-admin-gradient text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
