"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Search,
  Filter,
  Loader2,
  Star,
  Sparkles,
} from "lucide-react";
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

interface Service {
  _id: string;
  title: string;
  shortDescription: string;
  features: string[];
  applications: string[];
  image: string;
  status: string;
  featured: boolean;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalServices: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PaginatedServicesProps {
  initialServices?: Service[];
  initialPagination?: PaginationInfo;
}

export const PaginatedServices = ({
  initialServices = [],
  initialPagination,
}: PaginatedServicesProps) => {
  // Get initial page from URL or localStorage
  const getInitialPage = () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const pageFromUrl = urlParams.get("page");
      if (pageFromUrl) return parseInt(pageFromUrl);

      const savedPage = localStorage.getItem("servicesCurrentPage");
      if (savedPage) return parseInt(savedPage);
    }
    return initialPagination?.currentPage || 1;
  };

  const [services, setServices] = useState<Service[]>(initialServices);
  const [pagination, setPagination] = useState<PaginationInfo>(
    initialPagination || {
      currentPage: getInitialPage(),
      totalPages: 1,
      totalServices: 0,
      limit: 6,
      hasNextPage: false,
      hasPrevPage: false,
    }
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  const fetchServices = async (page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (featuredFilter !== "all") params.append("featured", featuredFilter);

      const response = await fetch(`/api/admin/services?${params}`);
      const data = await response.json();

      if (data.success) {
        setServices(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialServices.length === 0) {
      fetchServices();
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchServices(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, featuredFilter]);

  const handlePageChange = (page: number) => {
    // Save current page to localStorage for when user returns
    if (typeof window !== "undefined") {
      localStorage.setItem("servicesCurrentPage", page.toString());
      // Update URL without page reload
      const url = new URL(window.location.href);
      url.searchParams.set("page", page.toString());
      window.history.replaceState({}, "", url.toString());
    }

    fetchServices(page);
    // Scroll to top of services section
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  const renderPaginationItems = () => {
    const items = [];
    const { currentPage, totalPages } = pagination;

    // For mobile: show fewer page numbers
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const maxVisiblePages = isMobile ? 1 : 2;

    // Previous button
    if (pagination.hasPrevPage) {
      items.push(
        <PaginationItem key="prev">
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            className="h-9 px-2 sm:px-4 text-sm"
          />
        </PaginationItem>
      );
    }

    // Page numbers - responsive logic
    const startPage = Math.max(1, currentPage - maxVisiblePages);
    const endPage = Math.min(totalPages, currentPage + maxVisiblePages);

    // Show first page if not in range
    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
            className="h-9 w-9 text-sm"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis className="h-9 w-9" />
          </PaginationItem>
        );
      }
    }

    // Current page range
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            isActive={page === currentPage}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(page);
            }}
            className={`h-9 w-9 text-sm ${
              page === currentPage
                ? "bg-admin-gradient text-white border-0 hover:bg-admin-gradient"
                : ""
            }`}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show last page if not in range
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis className="h-9 w-9" />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
            className="h-9 w-9 text-sm"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    if (pagination.hasNextPage) {
      items.push(
        <PaginationItem key="next">
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            className="h-9 px-2 sm:px-4 text-sm"
          />
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <section
      id="services"
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 sm:mb-16 md:mb-20"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <Badge className="mb-4 sm:mb-6 bg-admin-gradient text-white px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Core Services
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 leading-tight px-2">
            Our Engineering
            <span className="block text-transparent bg-clip-text bg-admin-gradient">
              Expertise
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2 leading-relaxed">
            Explore our comprehensive range of engineering services designed to
            meet your specific project requirements with precision and
            innovation
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading services...</span>
          </div>
        )}

        {!loading && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-7xl mx-auto"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {services.map((service, index) => (
              <motion.div key={service._id} variants={fadeInUp} className="h-full">
                <div className="card-hover h-full border-0 shadow-xl overflow-hidden group bg-white rounded-2xl flex flex-col">
                  {/* Service Image with Gradient Overlay */}
                  <div className="aspect-video overflow-hidden relative flex-shrink-0">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-4 sm:p-6 md:p-8 flex flex-col flex-1 min-h-0">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900 group-hover:text-admin-primary transition-all duration-300 flex-shrink-0">
                      {service.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed line-clamp-2 flex-shrink-0">
                      {service.shortDescription}
                    </p>

                    {/* Key Features */}
                    <div className="mb-4 sm:mb-6 flex-shrink-0">
                      <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                        Key Features:
                      </h4>
                      <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                        {service.features.slice(0, 4).map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center text-xs sm:text-sm text-gray-600"
                          >
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1.5 sm:mr-2 flex-shrink-0" />
                            <span className="leading-tight">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Applications */}
                    <div className="mb-6 flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                        Applications:
                      </h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {service.applications.slice(0, 3).map((app, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs px-2 py-1"
                          >
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Button - Always at bottom */}
                    <div className="flex-shrink-0">
                      <Button
                        asChild
                        className="w-full bg-admin-gradient text-white border-0 group-hover:shadow-lg text-sm sm:text-base py-2 sm:py-3"
                      >
                        <Link
                          href={`/services/${service.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, "")}`}
                        >
                          Learn More{" "}
                          <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && services.length > 0 && pagination.totalPages > 1 && (
          <motion.div
            className="mt-12 sm:mt-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Mobile-friendly pagination wrapper */}
            <div className="flex flex-col items-center space-y-4">
              <Pagination className="w-full">
                <PaginationContent className="flex-wrap justify-center gap-1 sm:gap-2">
                  {renderPaginationItems()}
                </PaginationContent>
              </Pagination>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
