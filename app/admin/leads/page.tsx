"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
} from "lucide-react";
import ViewLeads from "./components/ViewLeads";
import axios from "axios";

interface Lead {
  _id?: string;
  id: number;
  fullName?: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  projectDescription?: string;
  additionalRequirements?: string;
  status: "new" | "contacted" | "qualified" | "converted" | "closed";
  priority: "low" | "medium" | "high";
  formSource?: "quotation" | "contact" | "lead";
  submittedAt: string;
  lastUpdated: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function LeadManager() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [formSourceFilter, setFormSourceFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const itemsPerPage = 10;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [services, setServices] = useState<string[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

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
        setServices(activeServices);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to fetch services. Please try again.",
        variant: "destructive",
      });
      // Set empty array if API fails - no fallback services
      setServices([]);
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Fetch leads from API
  const fetchLeads = async () => {
    try {
      setIsLoadingLeads(true);
      // Add all=true parameter to get all leads without pagination
      const response = await fetch("/api/admin/lead?all=true");
      const result = await response.json();

      if (result.success) {
        // Transform API data to match component interface
        const transformedLeads = result.data.map(
          (lead: any, index: number) => ({
            id: index + 1,
            _id: lead._id,
            name: lead.fullName || lead.name,
            fullName: lead.fullName,
            email: lead.email,
            phone: lead.phone || "",
            company: lead.company || "",
            service: lead.service,
            message: lead.message,
            projectDescription: lead.projectDescription || "",
            additionalRequirements: lead.additionalRequirements || "",
            status: lead.status,
            priority: lead.priority,
            formSource: lead.formSource,
            submittedAt: lead.submittedAt,
            lastUpdated: lead.lastUpdated,
          })
        );
        setLeads(transformedLeads);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({
        title: "Error",
        description: "Failed to fetch leads. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingLeads(false);
    }
  };

  // Load leads and services on component mount
  useEffect(() => {
    fetchLeads();
    fetchServices();
  }, []);

  const [newLead, setNewLead] = useState<{
    name: string;
    email: string;
    phone: string;
    company: string;
    service: string;
    message: string;
    projectDescription: string;
    additionalRequirements: string;
    status: "new" | "contacted" | "qualified" | "converted" | "closed";
    priority: "low" | "medium" | "high";
  }>({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
    projectDescription: "",
    additionalRequirements: "",
    status: "new",
    priority: "medium",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "contacted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "qualified":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "converted":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFormSourceColor = (formSource: string) => {
    switch (formSource) {
      case "quotation":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "contact":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "lead":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="h-4 w-4" />;
      case "contacted":
        return <Clock className="h-4 w-4" />;
      case "qualified":
        return <Star className="h-4 w-4" />;
      case "converted":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || lead.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || lead.priority === priorityFilter;
    const matchesFormSource =
      formSourceFilter === "all" || lead.formSource === formSourceFilter;

    return (
      matchesSearch && matchesStatus && matchesPriority && matchesFormSource
    );
  });

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const handleDeleteLead = (leadId: number) => {
    const leadToDelete = leads.find((lead) => lead.id === leadId);
    if (!leadToDelete) return;

    setLeadToDelete(leadToDelete);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return;

    try {
      setIsLoading(true);

      // Call API to delete the lead
      const response = await fetch(`/api/admin/lead/${leadToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete lead");
      }

      // Remove from local state
      setLeads(leads.filter((lead) => lead.id !== leadToDelete.id));

      toast({
        title: "Lead Deleted",
        description: `${leadToDelete.name}'s lead has been successfully deleted.`,
      });

      // Close modal and reset state
      setIsDeleteModalOpen(false);
      setLeadToDelete(null);
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast({
        title: "Error",
        description: "Failed to delete lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLead = async (updatedLead: Lead) => {
    if (!updatedLead._id) {
      toast({
        title: "Error",
        description: "Lead ID is missing. Cannot update lead.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Prepare data for API
      const updateData = {
        fullName: updatedLead.name,
        email: updatedLead.email,
        phone: updatedLead.phone,
        company: updatedLead.company,
        service: updatedLead.service,
        message: updatedLead.message,
        projectDescription: updatedLead.projectDescription,
        additionalRequirements: updatedLead.additionalRequirements,
        status: updatedLead.status,
        priority: updatedLead.priority,
      };

      // Call API to update the lead
      const response = await fetch(`/api/admin/lead/${updatedLead._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update lead");
      }

      // Update local state
      setLeads(
        leads.map((lead) =>
          lead._id === updatedLead._id
            ? { ...updatedLead, lastUpdated: new Date().toISOString() }
            : lead
        )
      );

      setIsEditModalOpen(false);
      setSelectedLead(null);

      toast({
        title: "Lead Updated",
        description: `${updatedLead.name}'s information has been updated successfully.`,
      });
    } catch (error) {
      console.error("Error updating lead:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLead = async () => {
    setIsFormSubmitted(true);

    if (
      !newLead.name ||
      !newLead.email ||
      !newLead.service ||
      !newLead.message
    ) {
      toast({
        title: "Validation Error",
        description:
          "Please fill in all required fields (Name, Email, Service, Message).",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newLead.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API
      const submissionData = {
        fullName: newLead.name,
        email: newLead.email,
        phone: newLead.phone,
        company: newLead.company,
        service: newLead.service,
        message: newLead.message,
        projectDescription: newLead.projectDescription,
        additionalRequirements: newLead.additionalRequirements,
        formSource: "lead",
      };

      // Submit to API
      const response = await fetch("/api/admin/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add lead");
      }

      // Refresh leads list
      await fetchLeads();

      setNewLead({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        message: "",
        projectDescription: "",
        additionalRequirements: "",
        status: "new" as const,
        priority: "medium" as const,
      });
      setIsAddModalOpen(false);

      toast({
        title: "Lead Added Successfully",
        description: `${newLead.name} has been added to your leads.`,
      });
    } catch (error) {
      console.error("Error adding lead:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to add lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = [
    {
      title: "Total Leads",
      value: leads.length.toString(),
      icon: <Users className="h-6 w-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "New Leads",
      value: leads.filter((l) => l.status === "new").length.toString(),
      icon: <AlertCircle className="h-6 w-6" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Converted",
      value: leads.filter((l) => l.status === "converted").length.toString(),
      icon: <CheckCircle className="h-6 w-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "High Priority",
      value: leads.filter((l) => l.priority === "high").length.toString(),
      icon: <Star className="h-6 w-6" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-full mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl font-bold bg-admin-gradient bg-clip-text text-transparent">
              Lead Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and track your customer inquiries
            </p>
          </div>

          <Dialog
            open={isAddModalOpen}
            onOpenChange={(open) => {
              setIsAddModalOpen(open);
              if (!open) {
                setIsFormSubmitted(false);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-admin-gradient  text-white shadow-lg hover:shadow-2xl transition-all duration-300">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl text-admin-primary font-bold flex items-center gap-2">
                  <UserPlus className="h-6 w-6 text-admin-primary" />
                  Add New Lead
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={newLead.name}
                    onChange={(e) =>
                      setNewLead({ ...newLead, name: e.target.value })
                    }
                    placeholder="Enter full name"
                    className={
                      isFormSubmitted && !newLead.name
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }
                  />
                  {isFormSubmitted && !newLead.name && (
                    <p className="text-xs text-red-500 mt-1">
                      Name is required
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newLead.email}
                    onChange={(e) =>
                      setNewLead({ ...newLead, email: e.target.value })
                    }
                    placeholder="Enter email address"
                    className={
                      isFormSubmitted && !newLead.email
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }
                  />
                  {isFormSubmitted && !newLead.email && (
                    <p className="text-xs text-red-500 mt-1">
                      Email is required
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={newLead.phone}
                    onChange={(e) =>
                      setNewLead({ ...newLead, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={newLead.company}
                    onChange={(e) =>
                      setNewLead({ ...newLead, company: e.target.value })
                    }
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service" className="text-sm font-medium">
                    Service <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={newLead.service}
                    onValueChange={(value) =>
                      setNewLead({ ...newLead, service: value })
                    }
                  >
                    <SelectTrigger
                      className={
                        isFormSubmitted && !newLead.service
                          ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-medium">
                    Priority
                  </Label>
                  <Select
                    value={newLead.priority}
                    onValueChange={(value) =>
                      setNewLead({
                        ...newLead,
                        priority: value as "low" | "medium" | "high",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    value={newLead.message}
                    onChange={(e) =>
                      setNewLead({ ...newLead, message: e.target.value })
                    }
                    placeholder="Enter lead message or requirements"
                    rows={3}
                    className={
                      isFormSubmitted && !newLead.message
                        ? "ring-1 ring-red-500 focus:ring-2 focus:ring-red-500"
                        : ""
                    }
                  />
                  {isFormSubmitted && !newLead.message && (
                    <p className="text-xs text-red-500 mt-1">
                      Message is required
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label
                    htmlFor="projectDescription"
                    className="text-sm font-medium"
                  >
                    Project Description
                  </Label>
                  <Textarea
                    id="projectDescription"
                    value={newLead.projectDescription}
                    onChange={(e) =>
                      setNewLead({
                        ...newLead,
                        projectDescription: e.target.value,
                      })
                    }
                    placeholder="Describe the project details and scope"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label
                    htmlFor="additionalRequirements"
                    className="text-sm font-medium"
                  >
                    Additional Requirements (Optional)
                  </Label>
                  <Textarea
                    id="additionalRequirements"
                    value={newLead.additionalRequirements}
                    onChange={(e) =>
                      setNewLead({
                        ...newLead,
                        additionalRequirements: e.target.value,
                      })
                    }
                    placeholder="Any additional requirements or special considerations"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddLead}
                  disabled={isLoading}
                  className="bg-admin-gradient"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Lead
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="initial"
          animate="animate"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                    >
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">
                        {stat.title}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search leads by name, email, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={priorityFilter}
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger className="w-40">
                      <Star className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={formSourceFilter}
                    onValueChange={setFormSourceFilter}
                  >
                    <SelectTrigger className="w-40">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="quotation">Quotation</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="lead">Lead Form</SelectItem>
                      <SelectItem value="brochure">Brochure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leads Table */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="flex items-center gap-2 text-admin-primary">
                <Users className="h-5 w-5" />
                Leads ({filteredLeads.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="font-semibold text-gray-700">
                        Lead Info
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Contact
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Service
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Source
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Priority
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        Date
                      </TableHead>
                      <TableHead className="font-semibold  text-gray-700">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((lead) => (
                        <TableRow
                          key={lead.id}
                          className="hover:bg-blue-50/50 transition-colors"
                        >
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-900">
                                {lead.name}
                              </div>
                              {lead.company && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Building className="h-3 w-3 mr-1" />
                                  {lead.company}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-3 w-3 mr-1" />
                                {lead.email}
                              </div>
                              {lead.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {lead.phone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {lead.service}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getFormSourceColor(
                                lead.formSource || "lead"
                              )} w-fit capitalize`}
                            >
                              {lead.formSource || "lead"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getStatusColor(
                                lead.status
                              )} flex items-center gap-1 w-fit`}
                            >
                              {getStatusIcon(lead.status)}
                              {lead.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getPriorityColor(
                                lead.priority
                              )} w-fit`}
                            >
                              {lead.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className=" text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(lead.submittedAt)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setIsViewModalOpen(true);
                                }}
                                className="hover:bg-green-50 hover:border-green-200 hover:text-green-600 bg-transparent"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditLead(lead)}
                                className="hover:bg-blue-50 hover:border-blue-200 bg-transparent"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteLead(lead.id)}
                                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 bg-transparent"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              {isLoadingLeads ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-500 text-lg">Loading leads...</p>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No leads found</p>
                  <p className="text-gray-400">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <div className="py-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          className={`hover:bg-admin-gradient hover:text-white transition-all ${
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }`}
                        />
                      </PaginationItem>

                      {Array.from({
                        length: Math.ceil(filteredLeads.length / itemsPerPage),
                      }).map((_, index) => {
                        const pageNumber = index + 1;
                        // Show first page, last page, current page, and one page before and after current
                        if (
                          pageNumber === 1 ||
                          pageNumber ===
                            Math.ceil(filteredLeads.length / itemsPerPage) ||
                          (pageNumber >= currentPage - 1 &&
                            pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                onClick={() => setCurrentPage(pageNumber)}
                                isActive={currentPage === pageNumber}
                                className={
                                  currentPage === pageNumber
                                    ? "bg-admin-gradient text-white hover:text-white"
                                    : "hover:bg-admin-gradient hover:text-white"
                                }
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        // Show ellipsis for gaps
                        if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(
                                Math.ceil(filteredLeads.length / itemsPerPage),
                                prev + 1
                              )
                            )
                          }
                          className={`hover:bg-admin-gradient hover:text-white transition-all ${
                            currentPage ===
                            Math.ceil(filteredLeads.length / itemsPerPage)
                              ? "pointer-events-none opacity-50"
                              : ""
                          }`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Lead Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-admin-gradient bg-clip-text text-transparent flex items-center gap-2">
                <Edit className="h-6 w-6 text-admin-primary" />
                Edit Lead
              </DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-sm font-medium">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={selectedLead.name}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, name: e.target.value })
                    }
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedLead.email}
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        email: e.target.value,
                      })
                    }
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone" className="text-sm font-medium">
                    Phone
                  </Label>
                  <Input
                    id="edit-phone"
                    value={selectedLead.phone}
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        phone: e.target.value,
                      })
                    }
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-company" className="text-sm font-medium">
                    Company
                  </Label>
                  <Input
                    id="edit-company"
                    value={selectedLead.company}
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        company: e.target.value,
                      })
                    }
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-service" className="text-sm font-medium">
                    Service
                  </Label>
                  <Select
                    value={selectedLead.service}
                    onValueChange={(value) =>
                      setSelectedLead({ ...selectedLead, service: value })
                    }
                  >
                    <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-sm font-medium">
                    Status
                  </Label>
                  <Select
                    value={selectedLead.status}
                    onValueChange={(
                      value:
                        | "new"
                        | "contacted"
                        | "qualified"
                        | "converted"
                        | "closed"
                    ) => setSelectedLead({ ...selectedLead, status: value })}
                  >
                    <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-priority"
                    className="text-sm font-medium"
                  >
                    Priority
                  </Label>
                  <Select
                    value={selectedLead.priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setSelectedLead({ ...selectedLead, priority: value })
                    }
                  >
                    <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="edit-message" className="text-sm font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="edit-message"
                    value={selectedLead.message}
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        message: e.target.value,
                      })
                    }
                    rows={3}
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label
                    htmlFor="edit-projectDescription"
                    className="text-sm font-medium"
                  >
                    Project Description
                  </Label>
                  <Textarea
                    id="edit-projectDescription"
                    value={selectedLead.projectDescription || ""}
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        projectDescription: e.target.value,
                      })
                    }
                    rows={3}
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label
                    htmlFor="edit-additionalRequirements"
                    className="text-sm font-medium"
                  >
                    Additional Requirements (Optional)
                  </Label>
                  <Textarea
                    id="edit-additionalRequirements"
                    value={selectedLead.additionalRequirements || ""}
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        additionalRequirements: e.target.value,
                      })
                    }
                    rows={2}
                    className="focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedLead && handleUpdateLead(selectedLead)}
                className="bg-admin-gradient text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Confirm Deletion
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete the lead for{" "}
                <span className="font-semibold text-gray-900">
                  {leadToDelete?.name}
                </span>
                ?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-800 text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  This action cannot be undone
                </p>
                <p className="text-red-700 text-sm mt-1">
                  All lead information and history will be permanently deleted.
                </p>
              </div>
              {leadToDelete && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {leadToDelete.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Service:</strong> {leadToDelete.service}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong> {leadToDelete.status}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setLeadToDelete(null);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteLead}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Lead
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Lead Modal */}
        <ViewLeads
          lead={selectedLead}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedLead(null);
          }}
        />
      </div>
    </div>
  );
}
