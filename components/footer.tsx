"use client";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  Clock,
  Award,
  Users,
  Globe,
  Youtube,
  MessageCircle,
  Send,
  Github,
  Palette,
  Dribbble,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "./providers/theme";
import Image from "next/image";

interface Service {
  _id: string;
  title: string;
  status: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  whatsapp?: string;
  telegram?: string;
  github?: string;
  behance?: string;
  dribbble?: string;
}

export default function Footer() {
  const [services, setServices] = useState<Service[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const { themeData } = useTheme();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/admin/services");
        const data = await response.json();

        if (data.success) {
          // Filter active services - no limit, auto-responsive UI will handle any number
          const activeServices = data.data.filter(
            (service: Service) => service.status === "active"
          );
          setServices(activeServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

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

    fetchServices();
    fetchContactInfo();
  }, []);

  // Helper function to get social media links with icons
  const getSocialMediaLinks = () => {
    if (!contactInfo) return [];

    const socialLinks = [
      {
        name: "Facebook",
        url: contactInfo.facebook,
        icon: Facebook,
        hoverColor: "hover:text-blue-500",
        bgColor: "hover:bg-blue-600/20",
        borderColor: "hover:border-blue-500/50"
      },
      {
        name: "Twitter",
        url: contactInfo.twitter,
        icon: Twitter,
        hoverColor: "hover:text-blue-400",
        bgColor: "hover:bg-blue-600/20",
        borderColor: "hover:border-blue-500/50"
      },
      {
        name: "LinkedIn",
        url: contactInfo.linkedin,
        icon: Linkedin,
        hoverColor: "hover:text-blue-600",
        bgColor: "hover:bg-blue-600/20",
        borderColor: "hover:border-blue-500/50"
      },
      {
        name: "Instagram",
        url: contactInfo.instagram,
        icon: Instagram,
        hoverColor: "hover:text-pink-500",
        bgColor: "hover:bg-pink-600/20",
        borderColor: "hover:border-pink-500/50"
      },
      {
        name: "YouTube",
        url: contactInfo.youtube,
        icon: Youtube,
        hoverColor: "hover:text-red-500",
        bgColor: "hover:bg-red-600/20",
        borderColor: "hover:border-red-500/50"
      },
      {
        name: "WhatsApp",
        url: contactInfo.whatsapp,
        icon: MessageCircle,
        hoverColor: "hover:text-green-500",
        bgColor: "hover:bg-green-600/20",
        borderColor: "hover:border-green-500/50"
      },
      {
        name: "Telegram",
        url: contactInfo.telegram,
        icon: Send,
        hoverColor: "hover:text-blue-500",
        bgColor: "hover:bg-blue-600/20",
        borderColor: "hover:border-blue-500/50"
      },
      {
        name: "GitHub",
        url: contactInfo.github,
        icon: Github,
        hoverColor: "hover:text-gray-300",
        bgColor: "hover:bg-gray-600/20",
        borderColor: "hover:border-gray-500/50"
      },
      {
        name: "Behance",
        url: contactInfo.behance,
        icon: Palette,
        hoverColor: "hover:text-blue-500",
        bgColor: "hover:bg-blue-600/20",
        borderColor: "hover:border-blue-500/50"
      },
      {
        name: "Dribbble",
        url: contactInfo.dribbble,
        icon: Dribbble,
        hoverColor: "hover:text-pink-500",
        bgColor: "hover:bg-pink-600/20",
        borderColor: "hover:border-pink-500/50"
      }
    ];

    // Filter out social links that don't have URLs
    return socialLinks.filter(link => link.url && link.url.trim() !== "");
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
          
          {/* Company Info - Enhanced */}
          <div className="space-y-6 sm:col-span-2 lg:col-span-2">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-3 group">
              {themeData?.logo ? (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20">
                  <Image 
                    src={themeData.logo} 
                    alt="Filigree Solutions Logo" 
                    width={56} 
                    height={56} 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-admin-gradient rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl sm:text-2xl">F</span>
                </div>
              )}
              <div>
                <div className="font-bold text-xl sm:text-2xl bg-admin-gradient bg-clip-text text-transparent">
                  Filigree
                </div>
                <div className="text-sm sm:text-base font-medium">Solutions</div>
              </div>
            </Link>

            {/* Company Description */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md">
              Leading provider of advanced CAD & CAE solutions, delivering precision engineering services across India with cutting-edge technology and expertise.
            </p>

           
            {/* Dynamic Social Media */}
            {getSocialMediaLinks().length > 0 && (
              <div className="space-y-3">
                <h4 className="text-white font-semibold text-sm">Follow Us</h4>
                <div className="flex flex-wrap gap-3">
                  {getSocialMediaLinks().map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group p-2 bg-white/10 ${social.bgColor} rounded-lg transition-all duration-300 border border-white/20 ${social.borderColor}`}
                        title={`Follow us on ${social.name}`}
                      >
                        <IconComponent className={`h-4 w-4 text-gray-400 ${social.hoverColor} transition-colors`} />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="font-semibold text-lg text-white flex items-center">
              <Globe className="h-5 w-5 mr-2 text-admin-primary" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Services", href: "/services" },
                { name: "Portfolio", href: "/portfolio" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 py-1"
                  >
                    <ArrowRight className="h-3 w-3 text-admin-primary group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base sm:text-lg text-white">
                Our Services
              </h3>
             
            </div>

            {/* Mobile: Clean card-style layout */}
            <div className="block sm:hidden">
              <div className="space-y-3">
                {services.length > 0 ? (
                  <>
                    {services.slice(0, 6).map((service) => (
                      <Link
                        key={service._id}
                        href={`/services/${service.title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "")}`}
                        className="block p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-300 hover:text-white text-sm font-medium line-clamp-2">
                            {service.title}
                          </span>
                        </div>
                      </Link>
                    ))}
                    {services.length > 6 && (
                      <Link
                        href="/services"
                        className="block p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 rounded-lg transition-all duration-200 border border-blue-500/30"
                      >
                        <div className="flex items-center justify-center space-x-2">
                         
                          <svg
                            className="w-4 h-4 text-admin-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                            
                          </svg>
                          All Services
                        </div>
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 text-center">
                    <span className="text-gray-400 text-sm">
                      No services available
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tablet and Desktop: Enhanced grid layout */}
            <div className="hidden sm:block">
              {services.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    {services.slice(0, 8).map((service) => (
                      <Link
                        key={service._id}
                        href={`/services/${service.title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "")}`}
                        className="group flex items-center space-x-3 p-2 hover:bg-gray-800/50 rounded-md transition-all duration-200"
                        title={service.title}
                      >
                        <div className="w-1.5 h-1.5 bg-admin-primary rounded-full flex-shrink-0 group-hover:bg-blue-300 transition-colors"></div>
                        <span className="text-gray-300 group-hover:text-white text-sm leading-tight line-clamp-4">
                          {service.title}
                        </span>
                      </Link>
                    ))}
                  </div>

                  {services.length > 8 && (
                    <div className="pt-2 border-t border-gray-700/50">
                      <Link
                        href="/services"
                        className="group flex items-center justify-between p-3 bg-admin-gradient text-white rounded-lg transition-all duration-200 border border-blue-500/20 hover:border-blue-500/40"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span className="text-admin-primaty  text-sm ">
                            Explore All Services
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-white text-xs">
                            +{services.length - 8} more
                          </span>
                          
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 text-center">
                  <span className="text-gray-400 text-sm">
                    No services available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Contact Info */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
              Contact Info
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-admin-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  {contactInfo ? (
                    `${contactInfo.address}, ${contactInfo.city}, ${contactInfo.state}-${contactInfo.pincode}, ${contactInfo.country}`
                  ) : (
                    "88/153, East Street, Pandiyan Nagar, South Madurai, Madurai-625006, Tamil Nadu"
                  )}
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-admin-primary flex-shrink-0" />
                <a
                  href={`tel:${contactInfo?.phone || "9158549166"}`}
                  className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  {contactInfo?.phone || "9158549166"}
                </a>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-admin-primary flex-shrink-0" />
                <a
                  href={`mailto:${contactInfo?.email || "info@filigreesolutions.com"}`}
                  className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm break-all"
                >
                  {contactInfo?.email || "info@filigreesolutions.com"}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed px-2">
            © 2024 Filigree Solutions. All rights reserved.
            <span className="block sm:inline sm:ml-1">
              | Developed by MnT Magizh NexGen Technologies
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
