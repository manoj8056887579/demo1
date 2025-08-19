"use client";

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Send } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
interface ContactProps {
  services: string[];
  contactInfo?: {
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    pageTitle: string;
    pageDescription: string;
    officeTitle: string;
    officeDescription: string;
    mapEmbedCode?: string;
  };
}

export const Contact = ({ services, contactInfo }: ContactProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for API
      const submissionData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: "", // Contact form doesn't have company field
        service: formData.service,
        message: formData.message,
        projectDescription: formData.message, // Use message as project description
        additionalRequirements: "",
        formSource: "contact",
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
        throw new Error(result.message || "Failed to send message");
      }

      toast({
        title: "Message Sent Successfully!",
        description:
          "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use dynamic contact info or fallback to default values
  const dynamicContactInfo = [
    {
      icon: <Phone className="h-5 w-5 text-white" />,
      title: "Phone",
      details: contactInfo?.phone || "9158549166",
      description: "Mon-Fri 9AM-6PM IST",
    },
    {
      icon: <Mail className="h-5 w-5 text-white" />,
      title: "Email",
      details: contactInfo?.email || "info@filigreesolutions.com",
      description: "We'll respond within 24 hours",
    },
    {
      icon: <MapPin className="h-5 w-5 text-white" />,
      title: "Address",
      details: contactInfo?.address || "88/153, East Street, Pandiyan Nagar",
      description: `${contactInfo?.city || "South Madurai"}, ${
        contactInfo?.state || "Tamil Nadu"
      }-${contactInfo?.pincode || "625006"}`,
    },
  ];
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-admin-gradient"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-5 left-5 sm:top-10 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-white/10 rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-3 sm:mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Get In Touch
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              {contactInfo?.pageTitle || "Let's Discuss Your Engineering Needs"}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              {contactInfo?.pageDescription ||
                "Ready to transform your engineering challenges into innovative solutions? Contact our expert team today and start your journey to excellence."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section
        id="contact-form"
        className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 max-w-7xl mx-auto">
            {/* Contact Form */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="shadow-xl border-0">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Send Us a Message
                  </h2>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label
                          htmlFor="fullName"
                          className="text-gray-700 font-medium text-sm sm:text-base"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          placeholder="Enter your full name"
                          className="mt-1.5 sm:mt-2 h-10 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-gray-700 font-medium text-sm sm:text-base"
                        >
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="Enter your email"
                          className="mt-1.5 sm:mt-2 h-10 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-gray-700 font-medium text-sm sm:text-base"
                        >
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="Enter your phone number"
                          className="mt-1.5 sm:mt-2 h-10 sm:h-12 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="service"
                          className="text-gray-700 font-medium text-sm sm:text-base"
                        >
                          Service of Interest
                        </Label>
                        <Select
                          value={formData.service}
                          onValueChange={(value) =>
                            handleInputChange("service", value)
                          }
                        >
                          <SelectTrigger className="mt-1.5 sm:mt-2 h-10 sm:h-12 text-sm sm:text-base">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem
                                key={service}
                                value={service}
                                className="text-sm sm:text-base"
                              >
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="message"
                        className="text-gray-700 font-medium text-sm sm:text-base"
                      >
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        placeholder="Tell us about your project requirements..."
                        rows={4}
                        className="mt-1.5 sm:mt-2 text-sm sm:text-base resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-10 sm:h-12 bg-admin-gradient text-white text-sm sm:text-base lg:text-lg font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                          <span className="text-xs sm:text-sm lg:text-base">
                            Sending Message...
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs sm:text-sm lg:text-base">
                            Send Message
                          </span>
                          <Send className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="space-y-4 sm:space-y-6 lg:space-y-8"
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
                  Contact Information
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
                  Get in touch with our team of engineering experts. We're here
                  to help you with all your CAD and CAE requirements and provide
                  comprehensive solutions.
                </p>
              </motion.div>

              {dynamicContactInfo.map((info, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                    <CardContent className="p-4 sm:p-5 lg:p-6">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-admin-gradient rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                          <div className="text-white">{info.icon}</div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base lg:text-lg">
                            {info.title}
                          </h3>
                          <p className="text-gray-900 font-medium mb-1 text-sm sm:text-base break-words">
                            {info.details}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="mb-5 bg-white">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <motion.div
            className="text-center mb-8 sm:mb-12 lg:mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Badge className="mb-4 sm:mb-6 bg-admin-gradient text-white px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Visit Our Office
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 leading-tight px-2">
              {contactInfo?.officeTitle ||
                "Visit Our Office in Madurai, Tamil Nadu"}
            </h2>
            <p className="text-sm sm:text-base  text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
              {contactInfo?.officeDescription ||
                "Located in the heart of Madurai, our office is easily accessible and welcoming to all our clients"}
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl max-w-6xl mx-auto"
          >
            {contactInfo?.mapEmbedCode ? (
              <div
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px]"
                dangerouslySetInnerHTML={{ __html: contactInfo.mapEmbedCode }}
              />
            ) : (
              <div className="w-full h-64 justify-center  place-items-center content-center object-center  sm:h-80 md:h-96 bg-slate-500 lg:h-[500px]">
                <MapPin className="text-white" />
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
};
