"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Phone,
  X,
  Mail,
  MapPin,
  ChevronDown,
  ArrowRight,
  Download,
  FileText,
  Loader2,
  Send,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuotation } from "@/components/quotation-provider";
import { useTheme } from "./providers/theme";
import Image from "next/image";

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface Brochure {
  _id: string;
  title: string;
  fileName: string;
  filePath: string;
  uploadDate: string;
}

interface DownloadFormData {
  fullName: string;
  email: string;
  phone: string;
}

// Separate client component for pathname functionality
function NavbarContent() {
  const { themeData } = useTheme();
  const pathname = usePathname();
  const { openQuotationForm } = useQuotation();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [brochures, setBrochures] = useState<Brochure[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [formData, setFormData] = useState<DownloadFormData>({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch contact information, services, and brochures
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch("/api/admin/contact");
        const data = await response.json();

        if (data.success) {
          setContactInfo(data.data);
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    const fetchServices = async () => {
      try {
        // Fixed the API call - removed isAdmin parameter that was causing issues
        const response = await fetch(
          "/api/admin/services?all=true&status=active"
        );
        const data = await response.json();

        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchBrochures = async () => {
      try {
        const response = await fetch("/api/admin/broucher");
        const data = await response.json();

        if (data.brochures) {
          setBrochures(data.brochures);
        }
      } catch (error) {
        console.error("Error fetching brochures:", error);
      }
    };

    fetchContactInfo();
    fetchServices();
    fetchBrochures();
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Contact", href: "/contact" },
  ];

  const handleGetQuote = () => {
    openQuotationForm();
    setIsOpen(false);
  };

  const handleDownloadBrochure = () => {
    setIsDownloadModalOpen(true);
    setIsOpen(false);
    // Reset form state when opening modal
    setIsEmailSent(false);
    setSubmitMessage("");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // For phone field, only allow numeric input
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    // Check if brochures are available
    if (brochures.length === 0) {
      setSubmitMessage("No brochures available at the moment.");
      setIsSubmitting(false);
      return;
    }

    try {
      // First, save lead data to API
      const leadResponse = await fetch("/api/admin/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          service: "Brochure Request",
          message: "User requested brochure download via email",
          formSource: "brochure",
        }),
      });

      const leadResult = await leadResponse.json();

      if (!leadResult.success) {
        throw new Error(leadResult.message || "Failed to save lead information");
      }

      // Then, send email with brochures
      const emailResponse = await fetch("/api/admin/broucher/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
        }),
      });

      const emailResult = await emailResponse.json();

      if (emailResult.success) {
        setIsEmailSent(true);
        setSubmitMessage(
          `🎉 Success! Your brochures have been sent to ${formData.email}. ${
            emailResult.attachedCount > 0 
              ? `${emailResult.attachedCount} file${emailResult.attachedCount !== 1 ? 's' : ''} attached directly.` 
              : 'Download links included in the email.'
          }`
        );

        // Auto-close modal after success
        setTimeout(() => {
          setIsDownloadModalOpen(false);
          setFormData({ fullName: "", email: "", phone: "" });
          setSubmitMessage("");
          setIsEmailSent(false);
        }, 4000);

      } else {
        throw new Error(emailResult.error || "Failed to send email");
      }

    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitMessage(
        `❌ Error: ${error instanceof Error ? error.message : "Failed to process request. Please try again."}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Bar with Dynamic Contact Info - Responsive */}
      <div className="bg-admin-gradient text-white py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm">
        <div className="container mx-auto flex flex-col sm:flex-row lg:flex-row justify-between items-center gap-1 sm:gap-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-center lg:justify-start gap-2 sm:gap-4 lg:gap-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <Phone className="h-3 w-3 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
              <a
                href={`tel:${contactInfo?.phone || "9158549166"}`}
                className="font-medium text-xs sm:text-xs lg:text-sm hover:text-white/80 transition-colors"
              >
                {contactInfo?.phone || "9158549166"}
              </a>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Mail className="h-3 w-3 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
              <a
                href={`mailto:${
                  contactInfo?.email || "info@filigreesolutions.com"
                }`}
                className="font-medium text-xs sm:text-xs lg:text-sm hover:text-white/80 transition-colors truncate max-w-[200px] sm:max-w-none"
              >
                {contactInfo?.email || "info@filigreesolutions.com"}
              </a>
            </div>
          </div>
          <div className="hidden lg:flex xl:flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="font-medium text-sm">
              {contactInfo
                ? `${contactInfo.address}, ${contactInfo.city}, ${contactInfo.state}-${contactInfo.pincode}`
                : "88/153, East Street, Pandiyan Nagar, South Madurai, Madurai-625006"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation - Responsive */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-100"
            : "bg-white/98 backdrop-blur-sm shadow-lg"
        }`}
      >
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
            {/* Logo - Responsive */}
            <Link
              href="/"
              className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3 group"
            >
              {themeData?.logo ? (
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center">
                  <Image
                    src={themeData.logo}
                    alt="Website Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl bg-admin-gradient overflow-hidden flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg lg:text-2xl">
                    F
                  </span>
                </div>
              )}
              <div>
                <div className="font-bold text-sm sm:text-lg lg:text-xl xl:text-2xl bg-admin-gradient bg-clip-text text-transparent">
                  Filigree
                </div>
                <div className="text-xs sm:text-xs lg:text-sm text-gray-600 font-medium">
                  Solutions
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navItems.map((item) => {
                if (item.name === "Services") {
                  return (
                    <div
                      key={item.name}
                      className="relative group"
                      onMouseEnter={() => setIsServicesDropdownOpen(true)}
                      onMouseLeave={() => setIsServicesDropdownOpen(false)}
                    >
                      <Link
                        href={item.href}
                        className={`transition-all font-semibold text-base xl:text-lg relative group flex items-center gap-1 ${
                          isActive(item.href)
                            ? "text-transparent bg-clip-text bg-admin-gradient"
                            : "text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-admin-gradient"
                        }`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-4 w-4 text-admin-primary transition-transform duration-200 ${
                            isServicesDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                        <span
                          className={`absolute -bottom-1 left-0 h-0.5 bg-admin-gradient transition-all duration-300 ${
                            isActive(item.href)
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          }`}
                        ></span>
                      </Link>

                      {/* Services Dropdown */}
                      <AnimatePresence>
                        {isServicesDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto"
                          >
                            {/* Services List - Vertical */}
                            {services.length > 0 ? (
                              <div>
                                {services.map((service) => (
                                  <Link
                                    key={service._id}
                                    href={`/services/${service.title
                                      .toLowerCase()
                                      .replace(/[^a-z0-9]+/g, "-")
                                      .replace(/(^-|-$)/g, "")}`}
                                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-admin-primary transition-colors text-sm font-medium border-b border-gray-100 last:border-b-0"
                                    onClick={() =>
                                      setIsServicesDropdownOpen(false)
                                    }
                                  >
                                    {service.title}
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <div className="px-4 py-3 text-gray-500 text-sm text-center">
                                No services available
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`transition-all font-semibold text-base xl:text-lg relative group ${
                      isActive(item.href)
                        ? "text-transparent bg-clip-text bg-admin-gradient"
                        : "text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-admin-gradient"
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-admin-gradient transition-all duration-300 ${
                        isActive(item.href)
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                );
              })}

              <Button
                onClick={handleGetQuote}
                className="bg-admin-gradient text-white border-0 px-4 xl:px-6 py-2 font-semibold text-sm xl:text-base transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Get Quote
              </Button>
              {/* Download Brochure Button */}
              <Button
                onClick={handleDownloadBrochure}
                variant="outline"
                className="border-admin-primary text-admin-primary hover:bg-admin-gradient hover:text-white px-4 xl:px-6 py-2 font-semibold text-sm xl:text-base transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <Mail className="h-4 w-4 mr-2" />
                Get Brochure
              </Button>
            </div>

            {/* Mobile Menu Button - Responsive */}
            <button
              className="lg:hidden p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Responsive */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-gray-100 shadow-xl"
            >
              <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`block transition-all font-semibold text-base sm:text-lg py-2.5 sm:py-3 px-2 rounded-lg hover:bg-gray-50 ${
                        isActive(item.href)
                          ? "text-transparent bg-clip-text bg-admin-gradient"
                          : "text-gray-700 hover:text-transparent hover:bg-clip-text hover:bg-admin-gradient"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (navItems.length + 1) * 0.1 }}
                >
                  <Button
                    onClick={handleGetQuote}
                    className="w-full bg-admin-gradient hover:opacity-90 text-white border-0 py-2.5 sm:py-3 font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg"
                  >
                    Get Quote
                  </Button>
                </motion.div>

                {/* Mobile Get Brochure Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="pt-3 sm:pt-4 border-t border-gray-200"
                >
                  <Button
                    onClick={handleDownloadBrochure}
                    variant="outline"
                    className="w-full border-admin-primary text-admin-primary hover:bg-admin-gradient hover:text-white py-2.5 sm:py-3 font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg mb-3"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Get Brochure
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Get Brochure Modal */}
      <AnimatePresence>
        {isDownloadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsDownloadModalOpen(false);
                setFormData({ fullName: "", email: "", phone: "" });
                setSubmitMessage("");
                setIsEmailSent(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-admin-gradient px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-white" />
                    <h3 className="text-xl font-bold text-white">
                      Get Our Brochures
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsDownloadModalOpen(false);
                      setFormData({ fullName: "", email: "", phone: "" });
                      setSubmitMessage("");
                      setIsEmailSent(false);
                    }}
                    className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
                <p className="text-white/80 text-sm mt-2">
                  {isEmailSent
                    ? "✅ Brochures sent successfully!"
                    : `Enter your details to receive ${brochures.length} brochure${brochures.length !== 1 ? 's' : ''} via email`
                  }
                </p>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-6">
                {!isEmailSent ? (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email address"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={formData.phone}
                        onChange={handleFormChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent transition-all duration-200"
                        placeholder="Enter your phone number"
                        disabled={isSubmitting}
                      />
                    </div>

                    {submitMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg text-sm font-medium ${
                          submitMessage.includes("Success") || submitMessage.includes("🎉")
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                      >
                        {submitMessage}
                      </motion.div>
                    )}

                    {brochures.length === 0 && (
                      <div className="p-4 rounded-lg text-sm font-medium bg-yellow-50 text-yellow-800 border border-yellow-200">
                        ⚠️ No brochures available at the moment.
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                      <p className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        <span>
                          We'll send you {brochures.length} high-quality PDF brochure{brochures.length !== 1 ? 's' : ''} 
                          {brochures.length > 0 && ' directly to your email inbox.'}
                        </span>
                      </p>
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDownloadModalOpen(false);
                          setFormData({ fullName: "", email: "", phone: "" });
                          setSubmitMessage("");
                          setIsEmailSent(false);
                        }}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting || brochures.length === 0}
                        className="flex-1 bg-admin-gradient text-white hover:opacity-90 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send to Email
                            {brochures.length > 0 && ` (${brochures.length})`}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      Brochures Sent Successfully!
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Check your email ({formData.email}) for our comprehensive brochures.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                      📧 Email may take a few minutes to arrive. Don't forget to check your spam folder!
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Main Navbar component wrapper
export default function Navbar() {
  return <NavbarContent />;
}