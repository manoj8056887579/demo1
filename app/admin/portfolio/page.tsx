"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Briefcase,
  Upload,
  ImageIcon,
  Edit2,
  Loader2,
} from "lucide-react";
import "@/styles/quill.css";

interface KeyMetric {
  label: string;
  value: string;
}

interface PortfolioItem {
  _id?: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  challenges: string;
  solution: string;
  results: string;
  client: string;
  duration: string;
  year: string;
  technologies: string[];
  image: string;
  gallery: string[];
  tags: string[];
  status: string;
  methodology: string[];
  keyMetrics: KeyMetric[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalPortfolioItems: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function PortfolioPage() {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [deletingButtonId, setDeletingButtonId] = useState<string | null>(null);
  const scrollPositionRef = useRef<number>(0);
 
  

  // Quill configuration - only allow paragraph, bullet list, and numbered list
  const quillModules = {
    toolbar: [[{ list: "ordered" }, { list: "bullet" }], ["clean"]],
  };

  const quillFormats = ["list", "bullet"];

  // Helper function to check if RichTextEditor content is empty
  const isQuillContentEmpty = (content: string) => {
    if (!content) return true;
    // Remove HTML tags and check if there's actual text content
    const textContent = content.replace(/<[^>]*>/g, "").trim();
    return textContent === "";
  };

  // Memoized onChange handlers to prevent infinite re-renders
  const handleFullDescriptionChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      fullDescription: value,
    }));
  }, []);

  const handleChallengesChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      challenges: value,
    }));
  }, []);

  const handleSolutionChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      solution: value,
    }));
  }, []);

  const handleResultsChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      results: value,
    }));
  }, []);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalPortfolioItems: 0,
    limit: 6,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null
  );

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [explicitlyClosing, setExplicitlyClosing] = useState(false);

  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    shortDescription: string;
    fullDescription: string;
    challenges: string;
    solution: string;
    results: string;
    client: string;
    duration: string;
    year: string;
    technologies: string;
    image: string;
    gallery: string[];
    tags: string;
    status: string;
    methodology: string;
    keyMetrics: KeyMetric[];
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
  }>({
    title: "",
    category: "",
    shortDescription: "",
    fullDescription: "",
    challenges: "",
    solution: "",
    results: "",
    client: "",
    duration: "",
    year: "",
    technologies: "",
    image: "",
    gallery: [],
    tags: "",
    status: "published", // Default status
    methodology: "",
    keyMetrics: [],
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  // Key Metrics state with separate input fields
  const [keyMetrics, setKeyMetrics] = useState<KeyMetric[]>([
    { label: "", value: "" },
  ]);

  const [selectedFiles, setSelectedFiles] = useState<{
    mainImage: File | null;
    galleryImages: File[];
  }>({
    mainImage: null,
    galleryImages: [],
  });

  const fetchPortfolioItems = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/portfolio?page=${page}&limit=6`);
      const data = await response.json();

      if (data.success) {
        setPortfolioItems(data.data);
        setPagination(data.pagination);
        setCurrentPage(page);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch portfolio items",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch portfolio items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/portfolio/categories");
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/admin/portfolio/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Category Added",
          description: "New category has been successfully added.",
        });
        setNewCategoryName("");
        setShowAddCategory(false);
        setExplicitlyClosing(true);
        setCategoryDropdownOpen(false);
        fetchCategories();
        // Auto-select the newly added category
        setFormData({ ...formData, category: data.data.name });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to add category",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = async () => {
    if (!editCategoryName.trim() || !editingCategory) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/portfolio/categories/${editingCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: editCategoryName.trim() }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Category Updated",
          description: "Category has been successfully updated.",
        });
        setEditingCategory(null);
        setEditCategoryName("");
        setExplicitlyClosing(true);
        setCategoryDropdownOpen(false);
        fetchCategories();
        // Update form data if the edited category was selected
        if (formData.category === editingCategory.name) {
          setFormData({ ...formData, category: editCategoryName.trim() });
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update category",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(
        `/api/admin/portfolio/categories/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Category Deleted",
          description: "Category has been successfully deleted.",
        });
        setDeletingCategoryId(null);
        fetchCategories();
        // Clear form category if the deleted category was selected
        const deletedCategory = categories.find(
          (cat) => cat._id === categoryId
        );
        if (deletedCategory && formData.category === deletedCategory.name) {
          setFormData({ ...formData, category: "" });
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete category",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPortfolioItems(currentPage);
    fetchCategories();
  }, [currentPage]);

  // Key Metrics functions
  const addKeyMetric = () => {
    setKeyMetrics([...keyMetrics, { label: "", value: "" }]);
  };

  const removeKeyMetric = (index: number) => {
    if (keyMetrics.length > 1) {
      setKeyMetrics(keyMetrics.filter((_, i) => i !== index));
    }
  };

  const updateKeyMetric = (
    index: number,
    field: "label" | "value",
    value: string
  ) => {
    const updatedMetrics = [...keyMetrics];
    updatedMetrics[index][field] = value;
    setKeyMetrics(updatedMetrics);
  };

  const handleEdit = (item: PortfolioItem) => {
    // Store current scroll position when opening modal
    scrollPositionRef.current = window.scrollY;
    
    setEditingId(item._id || null);
    setFormData({
      title: item.title,
      category: item.category,
      shortDescription: item.shortDescription,
      fullDescription: item.fullDescription,
      challenges: item.challenges,
      solution: item.solution,
      results: item.results,
      client: item.client,
      duration: item.duration,
      year: item.year,
      technologies: item.technologies.join(", "),
      image: item.image,
      gallery: item.gallery || [],
      tags: item.tags.join(", "),
      status: item.status,
      methodology: item.methodology.join(", "),
      keyMetrics: item.keyMetrics || [{ label: "", value: "" }],
      seoTitle: item.seoTitle,
      seoDescription: item.seoDescription,
      seoKeywords: item.seoKeywords,
    });
    setKeyMetrics(item.keyMetrics || [{ label: "", value: "" }]);
    setSelectedFiles({
      mainImage: null,
      galleryImages: [],
    });
    setIsAddModalOpen(true);
  };

  const handleSave = async () => {
    setIsFormSubmitted(true);
    setIsSaving(true);

    // Validate required fields
    if (
      !formData.title ||
      !formData.category ||
      !formData.year ||
      !formData.shortDescription ||
      isQuillContentEmpty(formData.fullDescription) ||
      !formData.challenges ||
      !formData.solution ||
      !formData.results ||
      !formData.methodology ||
      !formData.image ||
      !formData.seoTitle ||
      !formData.seoDescription ||
      !formData.seoKeywords
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    try {
      let finalImagePath = formData.image;
      let finalGalleryPaths = [...formData.gallery];

      // Upload main image if a new file is selected
      if (selectedFiles.mainImage) {
        const portfolioTitle = formData.title || "untitled";
        const portfolioTitleSlug = portfolioTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFiles.mainImage);
        uploadFormData.append("type", "main");
        uploadFormData.append("portfolioTitle", portfolioTitleSlug);
        uploadFormData.append("action", "upload");

        const response = await fetch("/api/admin/portfolio", {
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
        const portfolioTitle = formData.title || "untitled";
        const portfolioTitleSlug = portfolioTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const uploadPromises = selectedFiles.galleryImages.map(async (file) => {
          const uploadFormData = new FormData();
          uploadFormData.append("file", file);
          uploadFormData.append("type", "gallery");
          uploadFormData.append("portfolioTitle", portfolioTitleSlug);
          uploadFormData.append("action", "upload");

          const response = await fetch("/api/admin/portfolio", {
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

      const portfolioData = {
        ...formData,
        image: finalImagePath,
        gallery: finalGalleryPaths,
        technologies: formData.technologies
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        methodology: formData.methodology
          .split(",")
          .map((m) => m.trim())
          .filter((m) => m),
        keyMetrics: keyMetrics.filter(
          (metric) => metric.label.trim() && metric.value.trim()
        ),
      };

      const url = editingId
        ? `/api/admin/portfolio/${editingId}`
        : "/api/admin/portfolio";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(portfolioData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: editingId ? "Portfolio Item Updated" : "Portfolio Item Added",
          description: `Portfolio item has been successfully ${
            editingId ? "updated" : "added"
          }.`,
        });
        fetchPortfolioItems(currentPage);
        handleCancel();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save portfolio item",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save portfolio item",
        variant: "destructive",
      });
    }
  };

  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    // Ensure the id is valid before setting it
    if (id) {
      setDeletingItemId(id);
    } else {
      toast({
        title: "Error",
        description: "Invalid portfolio item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingButtonId(id);
      const response = await fetch(`/api/admin/portfolio/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Portfolio Item Deleted",
          description: "Portfolio item has been successfully deleted.",
        });
        setDeletingItemId(null);

        // Check if we need to go back to previous page
        const remainingItems = portfolioItems.filter((item) => item._id !== id);
        if (remainingItems.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchPortfolioItems(currentPage);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to delete portfolio item",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete portfolio item",
        variant: "destructive",
      });
    } finally {
      setDeletingButtonId(null);
    }
  };

  const handleCancel = () => {
    // Prevent any scroll during state updates
    const savedScrollPosition = scrollPositionRef.current;
    
    setIsAddModalOpen(false);
    setEditingId(null);
    setFormData({
      title: "",
      category: "",
      shortDescription: "",
      fullDescription: "",
      challenges: "",
      solution: "",
      results: "",
      client: "",
      duration: "",
      year: "",
      technologies: "",
      image: "",
      gallery: [],
      tags: "",
      status: "published", // Reset to default status
      methodology: "",
      keyMetrics: [],
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    });
    setKeyMetrics([{ label: "", value: "" }]);
    setSelectedFiles({
      mainImage: null,
      galleryImages: [],
    });
    
    // Immediately restore scroll position
    requestAnimationFrame(() => {
      window.scrollTo({ 
        top: savedScrollPosition, 
        behavior: "instant" 
      });
    });
  };

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
                  ? "bg-admin-gradient text-white border-0 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600"
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
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600"
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
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600"
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
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio items...</p>
        </div>
      </div>
    );
  }

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditCategoryName("");
    setExplicitlyClosing(true);
    setCategoryDropdownOpen(false);
  };

  const handleCancelAdd = () => {
    setShowAddCategory(false);
    setNewCategoryName("");
    setExplicitlyClosing(true);
    setCategoryDropdownOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-admin-gradient bg-clip-text text-transparent">
            Portfolio Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your project portfolio and case studies
          </p>
        </div>
        <Dialog
          open={isAddModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsFormSubmitted(false);
              
              // Store the scroll position before any state changes
              const savedScrollPosition = scrollPositionRef.current;
              
              handleCancel();
              
              // Restore scroll position after modal closes with multiple attempts
              setTimeout(() => {
                window.scrollTo({ 
                  top: savedScrollPosition, 
                  behavior: "instant" 
                });
              }, 50);
              
              // Backup restoration in case the first one doesn't work
              setTimeout(() => {
                window.scrollTo({ 
                  top: savedScrollPosition, 
                  behavior: "instant" 
                });
              }, 200);
              
              // Final restoration attempt
              setTimeout(() => {
                window.scrollTo({ 
                  top: savedScrollPosition, 
                  behavior: "instant" 
                });
              }, 500);
            } else {
              // Store scroll position when opening modal
              scrollPositionRef.current = window.scrollY;
            }
            setIsAddModalOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                // Store current scroll position when opening modal
                scrollPositionRef.current = window.scrollY;
                
                setEditingId(null);
                setFormData({
                  title: "",
                  category: "",
                  shortDescription: "",
                  fullDescription: "",
                  challenges: "",
                  solution: "",
                  results: "",
                  client: "",
                  duration: "",
                  year: "",
                  technologies: "",
                  image: "",
                  gallery: [],
                  tags: "",
                  status: "published", // Default status
                  methodology: "",
                  keyMetrics: [],
                  seoTitle: "",
                  seoDescription: "",
                  seoKeywords: "",
                });
                setKeyMetrics([{ label: "", value: "" }]);
                setSelectedFiles({
                  mainImage: null,
                  galleryImages: [],
                });
                setIsAddModalOpen(true);
              }}
              className="bg-admin-gradient text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Portfolio Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-admin-gradient bg-clip-text text-transparent">
                {editingId ? "Edit Portfolio Item" : "Add New Portfolio Item"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-8 p-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Basic Information
                </h3>
                <div>
                  <Label htmlFor="title" className="text-base font-semibold">
                    Project Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter project title"
                    className={`mt-2 ${
                      isFormSubmitted && !formData.title
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {isFormSubmitted && !formData.title && (
                    <p className="text-xs text-red-500 mt-1">
                      Project title is required
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Label className="text-base font-semibold">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-2 space-y-2">
                      <Select
                        value={formData.category}
                        onValueChange={(value) => {
                          if (value === "add_new_category") {
                            // This case should not happen now since we're not using SelectItem for add new category
                            setEditingCategory(null);
                            setEditCategoryName("");
                            setShowAddCategory(true);
                            setNewCategoryName("");
                            setCategoryDropdownOpen(true);
                          } else {
                            setFormData({ ...formData, category: value });
                            setCategoryDropdownOpen(false);
                          }
                        }}
                        open={categoryDropdownOpen}
                        onOpenChange={(open) => {
                          if (
                            !open &&
                            (editingCategory || showAddCategory) &&
                            !explicitlyClosing
                          ) {
                            // Force it to stay open when we're in add/edit mode
                            setCategoryDropdownOpen(true);
                            return;
                          }
                          setCategoryDropdownOpen(open);
                          if (explicitlyClosing) {
                            setExplicitlyClosing(false);
                          }
                          // Reset states when dropdown closes naturally
                          if (!open && !explicitlyClosing) {
                            setShowAddCategory(false);
                            setEditingCategory(null);
                            setNewCategoryName("");
                            setEditCategoryName("");
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="z-50" data-no-search="true">
                          {categories.map((category) => (
                            <div
                              key={category._id}
                              className="flex items-center justify-between group"
                            >
                              <SelectItem
                                value={category.name}
                                className="flex-1"
                              >
                                {category.name}
                              </SelectItem>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-blue-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAddCategory(false);
                                    setNewCategoryName("");
                                    setEditingCategory({
                                      id: category._id,
                                      name: category.name,
                                    });
                                    setEditCategoryName(category.name);
                                    setCategoryDropdownOpen(true);
                                  }}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-red-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteCategory(category._id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ))}

                          <div
                            className="cursor-pointer hover:bg-gray-100 px-2 py-1.5 text-sm flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setEditingCategory(null);
                              setEditCategoryName("");
                              setShowAddCategory(true);
                              setNewCategoryName("");
                              // Don't change categoryDropdownOpen here - let it stay open
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Category
                          </div>

                          {showAddCategory && (
                            <div
                              className="p-4 border-t bg-gray-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <Label className="text-sm font-semibold">
                                  Add New Category
                                </Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCancelAdd}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  value={newCategoryName}
                                  onChange={(e) =>
                                    setNewCategoryName(e.target.value)
                                  }
                                  placeholder="Enter category name"
                                  className="flex-1"
                                  autoFocus
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleAddCategory();
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    // Prevent the Select component from capturing these key events
                                    e.stopPropagation();
                                  }}
                                  onFocus={(e) => {
                                    // Prevent Select from treating this as search input
                                    e.stopPropagation();
                                  }}
                                />
                                <Button
                                  type="button"
                                  onClick={handleAddCategory}
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          )}

                          {editingCategory && (
                            <div
                              className="p-4 border-t bg-gray-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <Label className="text-sm font-semibold">
                                  Edit Category
                                </Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingCategory(null);
                                    setEditCategoryName("");
                                    setExplicitlyClosing(true);
                                    setCategoryDropdownOpen(false);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  value={editCategoryName}
                                  onChange={(e) =>
                                    setEditCategoryName(e.target.value)
                                  }
                                  placeholder="Enter category name"
                                  className="flex-1"
                                  autoFocus
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      handleEditCategory();
                                    }
                                  }}
                                  onKeyDown={(e) => {
                                    // Prevent the Select component from capturing these key events
                                    e.stopPropagation();
                                  }}
                                  onFocus={(e) => {
                                    // Prevent Select from treating this as search input
                                    e.stopPropagation();
                                  }}
                                />
                                <Button
                                  type="button"
                                  onClick={handleEditCategory}
                                  size="sm"
                                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white"
                                >
                                  <Edit2 className="h-4 w-4 mr-1" />
                                  Update
                                </Button>
                              </div>
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="year" className="text-base font-semibold">
                      Project Year <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
                      placeholder="2024"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.year
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.year && (
                      <p className="text-xs text-red-500 mt-1">
                        Project year is required
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="client" className="text-base font-semibold">
                      Client Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="client"
                      value={formData.client}
                      onChange={(e) =>
                        setFormData({ ...formData, client: e.target.value })
                      }
                      placeholder="Client company name"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.client
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.client && (
                      <p className="text-xs text-red-500 mt-1">
                        Client name is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="duration"
                      className="text-base font-semibold"
                    >
                      Project Duration <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="3 months"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.duration
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.duration && (
                      <p className="text-xs text-red-500 mt-1">
                        Project duration is required
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Project Description
                </h3>
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
                    placeholder="Brief description for portfolio cards and listings"
                    rows={3}
                    className={`mt-2 ${
                      isFormSubmitted && !formData.shortDescription
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {isFormSubmitted && !formData.shortDescription && (
                    <p className="text-xs text-red-500 mt-1">
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
                  <div
                    className={`mt-2 ${
                      isFormSubmitted &&
                      isQuillContentEmpty(formData.fullDescription)
                        ? "quill-error"
                        : ""
                    }`}
                  >
                    <RichTextEditor
                      value={formData.fullDescription}
                      onChange={handleFullDescriptionChange}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Detailed description for project detail page. Use the toolbar to add bullet points and numbered lists."
                    />
                  </div>
                  {isFormSubmitted &&
                    isQuillContentEmpty(formData.fullDescription) && (
                      <p className="text-xs text-red-500 mt-1">
                        Full description is required
                      </p>
                    )}
                  <p className="text-sm text-gray-500 mt-1">
                    Use the toolbar above to format your text with bullet points
                    and numbered lists.
                  </p>
                </div>
              </div>

              {/* Challenge, Solution, Results */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Project Details
                </h3>
                <div>
                  <Label
                    htmlFor="challenges"
                    className="text-base font-semibold"
                  >
                    Challenges <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="challenges"
                    value={formData.challenges}
                    onChange={(e) =>
                      setFormData({ ...formData, challenges: e.target.value })
                    }
                    placeholder="What challenges did the project face?"
                    rows={4}
                    className={`mt-2 ${
                      isFormSubmitted && !formData.challenges
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {isFormSubmitted && !formData.challenges && (
                    <p className="text-xs text-red-500 mt-1">
                      Challenges are required
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="solution" className="text-base font-semibold">
                    Solution <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="solution"
                    value={formData.solution}
                    onChange={(e) =>
                      setFormData({ ...formData, solution: e.target.value })
                    }
                    placeholder="How did you solve the challenges?"
                    rows={4}
                    className={`mt-2 ${
                      isFormSubmitted && !formData.solution
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {isFormSubmitted && !formData.solution && (
                    <p className="text-xs text-red-500 mt-1">
                      Solution is required
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="results" className="text-base font-semibold">
                    Results <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="results"
                    value={formData.results}
                    onChange={(e) =>
                      setFormData({ ...formData, results: e.target.value })
                    }
                    placeholder="What were the outcomes and achievements?"
                    rows={4}
                    className={`mt-2 ${
                      isFormSubmitted && !formData.results
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {isFormSubmitted && !formData.results && (
                    <p className="text-xs text-red-500 mt-1">
                      Results are required
                    </p>
                  )}
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Technical Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="technologies"
                      className="text-base font-semibold"
                    >
                      Technologies Used (comma-separated){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="technologies"
                      value={formData.technologies}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          technologies: e.target.value,
                        })
                      }
                      placeholder="ANSYS, SolidWorks, AutoCAD"
                      rows={3}
                      className={`mt-2 ${
                        isFormSubmitted && !formData.technologies
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.technologies && (
                      <p className="text-xs text-red-500 mt-1">
                        Technologies are required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="tags" className="text-base font-semibold">
                      Tags (comma-separated)
                    </Label>
                    <Textarea
                      id="tags"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      placeholder="Structural Analysis, FEA, Safety Assessment"
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="methodology"
                    className="text-base font-semibold"
                  >
                    Methodology Steps (comma-separated){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="methodology"
                    value={formData.methodology}
                    onChange={(e) =>
                      setFormData({ ...formData, methodology: e.target.value })
                    }
                    placeholder="Step 1, Step 2, Step 3"
                    rows={4}
                    className={`mt-2 ${
                      isFormSubmitted && !formData.methodology
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {isFormSubmitted && !formData.methodology && (
                    <p className="text-xs text-red-500 mt-1">
                      Methodology steps are required
                    </p>
                  )}
                </div>
              </div>

              {/* Key Metrics with separate input fields */}
              <div
                className={`mt-2 space-y-4 ${
                  isFormSubmitted && !formData.image
                    ? "ring-1 ring-red-500 rounded-lg p-4"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                    Key Metrics
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addKeyMetric}
                    className="flex items-center bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Metric
                  </Button>
                </div>

                <div className="space-y-4">
                  {keyMetrics.map((metric, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">
                          Metric {index + 1}
                        </Label>
                        {keyMetrics.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeKeyMetric(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor={`metric-label-${index}`}
                            className="text-sm font-medium"
                          >
                            Metric Label *
                          </Label>
                          <Input
                            id={`metric-label-${index}`}
                            value={metric.label}
                            onChange={(e) =>
                              updateKeyMetric(index, "label", e.target.value)
                            }
                            placeholder="e.g., Cost Reduction"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`metric-value-${index}`}
                            className="text-sm font-medium"
                          >
                            Metric Value *
                          </Label>
                          <Input
                            id={`metric-value-${index}`}
                            value={metric.value}
                            onChange={(e) =>
                              updateKeyMetric(index, "value", e.target.value)
                            }
                            placeholder="e.g., 25%"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Images
                </h3>

                {/* Main Image */}
                <div>
                  <Label className="text-base font-semibold">
                    Main Project Image <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-gray-500 mt-1 mb-2">
                    Recommended resolution: 1200x800 pixels (3:2 aspect ratio)
                    for optimal display
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
                          alt="Project preview"
                          className="w-full h-64 object-cover rounded-lg border"
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
                    {isFormSubmitted && !formData.image && (
                      <p className="text-xs text-red-500 mt-1">
                        Main project image is required
                      </p>
                    )}
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <Label className="text-base font-semibold">
                    Project Gallery
                  </Label>
                  <div className="mt-2 space-y-4">
                    {formData.gallery.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    <p className="text-sm text-gray-500 mt-1">
                      Recommended: 50-60 characters
                    </p>
                    {isFormSubmitted && !formData.seoTitle && (
                      <p className="text-xs text-red-500 mt-1">
                        SEO title is required
                      </p>
                    )}
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
                    <p className="text-sm text-gray-500 mt-1">
                      Recommended: 150-160 characters
                    </p>
                    {isFormSubmitted && !formData.seoDescription && (
                      <p className="text-xs text-red-500 mt-1">
                        SEO description is required
                      </p>
                    )}
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
                    <p className="text-sm text-gray-500 mt-1">
                      Separate keywords with commas
                    </p>
                    {isFormSubmitted && !formData.seoKeywords && (
                      <p className="text-xs text-red-500 mt-1">
                        SEO keywords are required
                      </p>
                    )}
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
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-admin-gradient text-white border-0 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Portfolio Item
                    </>
                  )}
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

      {/* Portfolio Items List */}
      <AlertDialog
        open={!!deletingCategoryId}
        onOpenChange={() => setDeletingCategoryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot
              be undone. Any portfolio items using this category will need to be
              updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingCategoryId && handleDeleteCategory(deletingCategoryId)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deletingItemId}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingItemId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Portfolio Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this portfolio item? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingItemId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingItemId) {
                  handleDelete(deletingItemId);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="grid gap-8">
        {portfolioItems.map((item) => (
          <Card key={item._id} className="shadow-xl border-0 overflow-hidden">
            <div className="grid lg:grid-cols-3 gap-0">
              {/* Project Image */}
              <div className="relative h-[600px] w-full">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <Badge
                    variant={
                      item.status === "published" ? "default" : "secondary"
                    }
                    className="bg-white/90 text-gray-900"
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>

              {/* Project Content */}
              <div className="lg:col-span-2 p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {item.shortDescription}
                    </p>

                    {/* Project Details Grid */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <span className="font-semibold text-gray-900">
                          Client:{" "}
                        </span>
                        <span className="text-gray-600">{item.client}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">
                          Duration:{" "}
                        </span>
                        <span className="text-gray-600">{item.duration}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">
                          Year:{" "}
                        </span>
                        <span className="text-gray-600">{item.year}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">
                          Gallery:{" "}
                        </span>
                        <span className="text-gray-600">
                          {item.gallery.length} images
                        </span>
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Technologies:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.technologies.map((tech, index) => (
                          <Badge
                            key={index}
                            className="bg-admin-gradient text-white text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Tags:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Key Metrics Preview */}
                    {item.keyMetrics.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Key Metrics:
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {item.keyMetrics.slice(0, 4).map((metric, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-r from-blue-50 to-purple-50 p-2 rounded text-xs"
                            >
                              <span className="font-medium">
                                {metric.label}:
                              </span>{" "}
                              <span className="text-blue-600">
                                {metric.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Results Preview */}
                    <div className="flex flex-col-2 gap-2 ">
                      <h4 className="font-semibold text-gray-900">Results:</h4>
                      <p className="text-gray-700 text-sm">{item.results}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-6">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteClick(item._id!)}
                      disabled={deletingButtonId === item._id}
                    >
                      {deletingButtonId === item._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </>
                      )}
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
                        {item.seoTitle || "Not set"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">
                        Methodology Steps:{" "}
                      </span>
                      <span className="text-gray-600">
                        {item.methodology.length} steps
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
            {Math.min(
              currentPage * pagination.limit,
              pagination.totalPortfolioItems
            )}{" "}
            of {pagination.totalPortfolioItems} portfolio items
          </div>
        </div>
      )}

      {portfolioItems.length === 0 && !loading && (
        <Card className="shadow-xl border-0">
          <CardContent className="p-16 text-center">
            <div className="w-20 h-20 bg-admin-gradient rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No portfolio items found
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first portfolio item to showcase your work.
            </p>
            <Button
              onClick={() => {
                // Store current scroll position when opening modal
                scrollPositionRef.current = window.scrollY;
                
                setEditingId(null);
                setFormData({
                  title: "",
                  category: "",
                  shortDescription: "",
                  fullDescription: "",
                  challenges: "",
                  solution: "",
                  results: "",
                  client: "",
                  duration: "",
                  year: "",
                  technologies: "",
                  image: "",
                  gallery: [],
                  tags: "",
                  status: "published",
                  methodology: "",
                  keyMetrics: [],
                  seoTitle: "",
                  seoDescription: "",
                  seoKeywords: "",
                });
                setKeyMetrics([{ label: "", value: "" }]);
                setSelectedFiles({
                  mainImage: null,
                  galleryImages: [],
                });
                setIsAddModalOpen(true);
              }}
              className="bg-admin-gradient text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Portfolio Item
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
