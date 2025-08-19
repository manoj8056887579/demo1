"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Users,
  Upload,
  Star,
  Quote,
  Eye,
} from "lucide-react";

interface Testimonial {
  _id?: string;
  name: string;
  location: string;
  avatar: string;
  content: string;
  rating: number;
  servicesType: string;
  date: string;
  status: string;
}

export default function TestimonialsPage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    content: "",
    rating: 5,
    avatar: "",
    status: "published",
    date: "",
    servicesType: "",
  });

  // Fetch services from API
  const fetchServices = async () => {
    try {
      setIsLoadingServices(true);
      // Use 'all=true' parameter to get all services without pagination
      const response = await axios.get("/api/admin/services?all=true");

      if (response.data.success) {
        // Filter only active services and extract titles
        const activeServices = response.data.data
          .filter((service: any) => service.status === "active")
          .map((service: any) => service.title);

        const allServices = [...activeServices];

        // Remove duplicates
        const uniqueServices = Array.from(new Set(allServices));
        setServices(uniqueServices);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to fetch services. Using default services.",
        variant: "destructive",
      });
      // Fallback to default services if API fails
      setServices([
        "CAD Services",
        "Structural Analysis",
        "EV Simulation",
        "3D Modeling",
        "GD&T Application",
        "Research Support",
        "Consulting",
        "Training",
      ]);
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Fetch testimonials from API
  const fetchTestimonials = async () => {
    try {
      setIsLoadingTestimonials(true);
      const response = await axios.get("/api/admin/testimonial");

      if (response.data.success) {
        setTestimonials(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonials. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTestimonials(false);
    }
  };

  // Fetch services and testimonials when component mounts
  useEffect(() => {
    fetchServices();
    fetchTestimonials();
  }, []);

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial._id || null);
    // Reset any previous file selection state
    setSelectedFile(null);
    setPreviewUrl("");

    // Set form data with all fields from the testimonial
    setFormData({
      name: testimonial.name || "",
      location: testimonial.location || "",
      content: testimonial.content || "",
      rating: testimonial.rating || 5,
      avatar: testimonial.avatar || "",
      status: testimonial.status || "published",
      date: testimonial.date
        ? new Date(testimonial.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      servicesType: testimonial.servicesType || "",
    });

    // If there's an existing avatar, set it as preview
    if (testimonial.avatar) {
      setPreviewUrl(testimonial.avatar);
    }

    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsFormSubmitted(true);
    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.location ||
        !formData.content ||
        !formData.servicesType
      ) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      // Prepare data for submission
      let requestData: any;
      let requestConfig: any = {};

      // If there's a selected file, use FormData for multipart upload
      if (selectedFile) {
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("location", formData.location);
        formDataToSend.append("content", formData.content);
        formDataToSend.append("rating", formData.rating.toString());
        formDataToSend.append("servicesType", formData.servicesType);
        formDataToSend.append(
          "date",
          formData.date || new Date().toISOString().split("T")[0]
        );
        formDataToSend.append("status", formData.status);
        formDataToSend.append("avatar", selectedFile);

        requestData = formDataToSend;
        requestConfig = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      } else {
        // Use JSON data if no file is selected
        requestData = {
          name: formData.name,
          location: formData.location,
          content: formData.content,
          rating: formData.rating,
          avatar: formData.avatar,
          servicesType: formData.servicesType,
          date: formData.date || new Date().toISOString().split("T")[0],
          status: formData.status,
        };
        requestConfig = {
          headers: {
            "Content-Type": "application/json",
          },
        };
      }

      if (editingId) {
        // Update existing testimonial
        const response = await axios.put(
          `/api/admin/testimonial/${editingId}`,
          requestData,
          requestConfig
        );

        if (response.data.success) {
          toast({
            title: "Testimonial Updated",
            description: "Testimonial has been successfully updated.",
          });
          fetchTestimonials(); // Refresh the list
        }
      } else {
        // Create new testimonial
        const response = await axios.post(
          "/api/admin/testimonial",
          requestData,
          requestConfig
        );

        if (response.data.success) {
          toast({
            title: "Testimonial Added",
            description: "New testimonial has been successfully added.",
          });
          fetchTestimonials(); // Refresh the list
        }
      }

      handleCancel();
    } catch (error: any) {
      console.error("Error saving testimonial:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to save testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`/api/admin/testimonial/${id}`);

      if (response.data.success) {
        toast({
          title: "Testimonial Deleted",
          description: "Testimonial has been successfully deleted.",
        });
        setDeletingId(null);
        fetchTestimonials(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Error deleting testimonial:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to delete testimonial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    // Reset modal state
    setIsEditing(false);
    setEditingId(null);

    // Reset file upload state
    setSelectedFile(null);
    setPreviewUrl("");

    // Reset form data with default values
    setFormData({
      name: "",
      location: "",
      content: "",
      rating: 5,
      avatar: "",
      status: "published",
      date: new Date().toISOString().split("T")[0], // Set current date as default
      servicesType: "",
    });
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleAvatarUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Validate file type
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
          toast({
            title: "Invalid File Type",
            description: "Only JPEG, PNG, and WebP images are allowed.",
            variant: "destructive",
          });
          return;
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          toast({
            title: "File Too Large",
            description: "File size must be less than 5MB.",
            variant: "destructive",
          });
          return;
        }

        // Store the selected file and create preview
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        toast({
          title: "Image Selected",
          description: `${file.name} selected. Click Save to upload.`,
        });
      }
    };
    input.click();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold  bg-admin-gradient bg-clip-text text-transparent">
            Testimonials Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage client testimonials and reviews
          </p>
        </div>
        <Dialog
          open={isEditing}
          onOpenChange={(open) => {
            setIsEditing(open);
            if (!open) {
              handleCancel();
              setIsFormSubmitted(false);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  location: "",
                  content: "",
                  rating: 5,
                  avatar: "",
                  status: "published",
                  date: new Date().toISOString().split("T")[0],
                  servicesType: "",
                });
                setSelectedFile(null);
                setPreviewUrl("");
                setIsEditing(true);
              }}
              className="bg-admin-gradient text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-admin-gradient bg-clip-text text-transparent">
                {editingId ? "Edit Testimonial" : "Add New Testimonial"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-8 p-6">
              {/* Client Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Client Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-base font-semibold">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter client name"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.name
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.name && (
                      <p className="text-xs text-red-500 mt-1">
                        Name is required
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="location"
                      className="text-base font-semibold"
                    >
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="City, Country"
                      className={`mt-2 ${
                        isFormSubmitted && !formData.location
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }`}
                    />
                    {isFormSubmitted && !formData.location && (
                      <p className="text-xs text-red-500 mt-1">
                        Location is required
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Avatar Upload */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Profile Picture
                </h3>
                <div>
                  <Label className="text-base font-semibold">
                    Client Avatar
                  </Label>
                  <div className="mt-2 space-y-4">
                    {(formData.avatar || previewUrl) && (
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            previewUrl || formData.avatar || "/placeholder.svg"
                          }
                          alt="Client avatar"
                          className="w-20 h-20 rounded-full border object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setFormData({ ...formData, avatar: "" });
                            setSelectedFile(null);
                            setPreviewUrl("");
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAvatarUpload}
                        className="flex items-center bg-transparent"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {selectedFile ? "Change Avatar" : "Upload Avatar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Testimonial Content
                </h3>
                <div>
                  <Label htmlFor="content" className="text-base font-semibold">
                    Testimonial Text (minimum 10 character)
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Enter the client's testimonial..."
                    rows={6}
                    className={`mt-2 ${
                      isFormSubmitted && !formData.content
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {isFormSubmitted && !formData.content && (
                    <p className="text-xs text-red-500 mt-1">
                      Testimonial text is required
                    </p>
                  )}
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label className="text-base font-semibold">Rating *</Label>
                    <Select
                      value={formData.rating.toString()}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          rating: Number.parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            <div className="flex items-center gap-2">
                              <span>{rating}</span>
                              <div className="flex">{renderStars(rating)}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-base font-semibold">
                      Services Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.servicesType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, servicesType: value })
                      }
                    >
                      <SelectTrigger
                        className={`mt-2 ${
                          isFormSubmitted && !formData.servicesType
                            ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                            : ""
                        }`}
                      >
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isFormSubmitted && !formData.servicesType && (
                      <p className="text-xs text-red-500 mt-1">
                        Service type is required
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-base font-semibold">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
                  Settings
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
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
                  className="bg-admin-gradient text-white border-0"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Testimonial
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
        open={!!deletingId}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this testimonial? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingId) {
                  handleDelete(deletingId);
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Testimonials List */}
      <div className="grid gap-6">
        {isLoadingTestimonials ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <Card
              key={testimonial._id}
              className="shadow-xl border-0 overflow-hidden"
            >
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Avatar and Rating */}
                  <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-2 flex-shrink-0">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-4 border-gradient-to-r from-blue-400 to-purple-500 object-cover"
                    />
                    <div className="lg:text-center">
                      <div className="flex justify-center mb-2">
                        {renderStars(testimonial.rating)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(testimonial.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {testimonial.location}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            testimonial.status === "published"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            testimonial.status === "published"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : ""
                          }
                        >
                          {testimonial.status}
                        </Badge>
                        {testimonial.servicesType && (
                          <Badge variant="outline" className="text-xs">
                            {testimonial.servicesType}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Testimonial Quote */}
                    <div className="relative mb-6">
                      <Quote className="h-8 w-8 text-blue-200 absolute -top-2 -left-2" />
                      <blockquote className="text-gray-700 italic text-lg leading-relaxed pl-6">
                        "{testimonial.content}"
                      </blockquote>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex lg:flex-col gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(testimonial)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteClick(testimonial._id!)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {testimonials.length === 0 && (
        <Card className="shadow-xl border-0">
          <CardContent className="p-16 text-center">
            <div className="w-20 h-20 bg-admin-gradient rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No testimonials found
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first testimonial to showcase client feedback.
            </p>
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-admin-gradient text-white border-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Testimonial
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
