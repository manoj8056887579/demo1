"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { X, Send, User, Cog, MessageSquare, CheckCircle } from "lucide-react";

interface QuotationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuotationForm({ isOpen, onClose }: QuotationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<string[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    description: "",
    additionalRequirements: "",
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

  // Fetch services when component mounts or when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

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
        company: formData.company,
        service: formData.service,
        message: formData.description,
        projectDescription: formData.description,
        additionalRequirements: formData.additionalRequirements,
        formSource: "quotation",
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
        throw new Error(result.message || "Failed to submit quote request");
      }

      toast({
        title: "Quote Request Submitted Successfully!",
        description:
          "Thank you for your interest. Our team will review your requirements and get back to you within 24 hours with a detailed quote.",
      });

      // Reset form and close
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        description: "",
        additionalRequirements: "",
      });
      setCurrentStep(1);
      onClose();
    } catch (error) {
      console.error("Error submitting quote request:", error);
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error submitting your request. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.fullName.trim() &&
          formData.email.trim() &&
          formData.phone.trim() &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        );
      case 2:
        return formData.service.trim();
      case 3:
        return formData.description.trim().length >= 10;
      default:
        return false;
    }
  };

  const stepIcons = {
    1: <User className="h-5 w-5" />,
    2: <Cog className="h-5 w-5" />,
    3: <MessageSquare className="h-5 w-5" />,
  };

  const stepTitles = {
    1: "Contact Information",
    2: "Service Selection",
    3: "Project Description",
  };

  const stepDescriptions = {
    1: "Let us know how to reach you",
    2: "Select the service you need",
    3: "Provide detailed information about your project",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="w-full max-w-[95vw] xs:max-w-[90vw] sm:max-w-2xl lg:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="shadow-2xl border-0 overflow-hidden bg-white">
              <CardHeader className="relative bg-admin-gradient text-white p-4 sm:p-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 sm:right-4 top-2 sm:top-4 text-white hover:bg-white/20 transition-colors h-8 w-8 sm:h-10 sm:w-10"
                  onClick={onClose}
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold pr-10 sm:pr-12 leading-tight">
                  Get Your Free Quote
                </CardTitle>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg mt-2 leading-relaxed">
                  Tell us about your project and we'll provide you with a
                  detailed quote within 24 hours.
                </p>
              </CardHeader>

              <CardContent className="p-3 xs:p-4 sm:p-6 lg:p-8 max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-200px)] overflow-y-auto">
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs xs:text-sm font-semibold transition-all duration-300 ${
                            step < currentStep
                              ? "bg-green-500 text-white"
                              : step === currentStep
                              ? "bg-admin-gradient text-white shadow-lg"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {step < currentStep ? (
                            <CheckCircle className="h-3 w-3 xs:h-4 xs:w-4 sm:h-6 sm:w-6" />
                          ) : (
                            <div className="h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5">
                              {stepIcons[step as keyof typeof stepIcons]}
                            </div>
                          )}
                        </div>
                        <div className="mt-1 sm:mt-2 text-center">
                          <div
                            className={`text-xs xs:text-sm font-medium ${
                              step <= currentStep
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            Step {step}
                          </div>
                          <div
                            className={`text-xs hidden xs:block ${
                              step <= currentStep
                                ? "text-gray-600"
                                : "text-gray-400"
                            }`}
                          >
                            {stepTitles[step as keyof typeof stepTitles]}
                          </div>
                        </div>
                      </div>
                      {step < 3 && (
                        <div
                          className={`flex-1 h-0.5 sm:h-1 mx-2 xs:mx-3 sm:mx-4 transition-all duration-300 ${
                            step < currentStep
                              ? "bg-green-500"
                              : step === currentStep
                              ? "bg-admin-gradient"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                          {stepTitles[currentStep as keyof typeof stepTitles]}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          {
                            stepDescriptions[
                              currentStep as keyof typeof stepDescriptions
                            ]
                          }
                        </p>
                      </div>

                      {/* Step 1: Contact Information */}
                      {currentStep === 1 && (
                        <div className="space-y-4 sm:space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                              <Label
                                htmlFor="fullName"
                                className="text-gray-700 font-semibold text-sm"
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
                                className="mt-2 h-10 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="email"
                                className="text-gray-700 font-semibold text-sm"
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
                                placeholder="Enter your email address"
                                className="mt-2 h-10 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                              <Label
                                htmlFor="phone"
                                className="text-gray-700 font-semibold text-sm"
                              >
                                Phone Number *
                              </Label>
                              <Input
                                id="phone"
                                type="tel"
                                pattern="[0-9]*"
                                inputMode="numeric"
                                required
                                value={formData.phone}
                                onChange={(e) => {
                                  const numericValue = e.target.value.replace(/[^0-9]/g, '');
                                  handleInputChange("phone", numericValue);
                                }}
                                placeholder="Enter your phone number"
                                className="mt-2 h-10 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="company"
                                className="text-gray-700 font-semibold text-sm"
                              >
                                Company Name (Optional)
                              </Label>
                              <Input
                                id="company"
                                type="text"
                                value={formData.company}
                                onChange={(e) =>
                                  handleInputChange("company", e.target.value)
                                }
                                placeholder="Enter your company name"
                                className="mt-2 h-10 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 2: Project Details */}
                      {currentStep === 2 && (
                        <div className="space-y-4 sm:space-y-6">
                          <div>
                            <Label
                              htmlFor="service"
                              className="text-gray-700 font-semibold text-sm"
                            >
                              Service Required *
                            </Label>
                            <Select
                              value={formData.service}
                              onValueChange={(value) =>
                                handleInputChange("service", value)
                              }
                            >
                              <SelectTrigger className="mt-2 h-10 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                <SelectValue placeholder="Select the service you need" />
                              </SelectTrigger>
                              <SelectContent>
                                {services.map((service) => (
                                  <SelectItem
                                    key={service}
                                    value={service}
                                    className="py-2 sm:py-3 text-sm sm:text-base"
                                  >
                                    {service}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Project Description */}
                      {currentStep === 3 && (
                        <div className="space-y-4 sm:space-y-6">
                          <div>
                            <Label
                              htmlFor="description"
                              className="text-gray-700 font-semibold text-sm"
                            >
                              Project Description *
                            </Label>
                            <Textarea
                              id="description"
                              required
                              value={formData.description}
                              onChange={(e) =>
                                handleInputChange("description", e.target.value)
                              }
                              placeholder="Please describe your project requirements, scope, objectives, and any specific details that will help us understand your needs better..."
                              rows={4}
                              className="mt-2 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none min-h-[100px] sm:min-h-[120px]"
                            />
                            <div className="mt-1 text-xs sm:text-sm text-gray-500">
                              Minimum 10 characters (
                              {formData.description.length}/10)
                            </div>
                          </div>
                          <div>
                            <Label
                              htmlFor="additionalRequirements"
                              className="text-gray-700 font-semibold text-sm"
                            >
                              Additional Requirements (Optional)
                            </Label>
                            <Textarea
                              id="additionalRequirements"
                              value={formData.additionalRequirements}
                              onChange={(e) =>
                                handleInputChange(
                                  "additionalRequirements",
                                  e.target.value
                                )
                              }
                              placeholder="Any additional requirements, industry standards, compliance needs, timeline constraints, or specific deliverables..."
                              rows={3}
                              className="mt-2 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none min-h-[80px] sm:min-h-[100px]"
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex flex-col xs:flex-row justify-between items-center pt-4 sm:pt-6 lg:pt-8 border-t border-gray-200 gap-3 xs:gap-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className={`h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base w-full xs:w-auto ${
                        currentStep === 1
                          ? "invisible"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Previous Step
                    </Button>

                    <div className="text-xs sm:text-sm text-gray-500 order-first xs:order-none">
                      Step {currentStep} of 3
                    </div>

                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid(currentStep)}
                        className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base w-full xs:w-auto bg-admin-gradient text-white border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isStepValid(currentStep)}
                        className="h-10 sm:h-12 px-4 sm:px-8 text-sm sm:text-base w-full xs:w-auto bg-admin-gradient text-white border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                            <span className="hidden xs:inline">
                              Submitting Request...
                            </span>
                            <span className="xs:hidden">Submitting...</span>
                          </>
                        ) : (
                          <>
                            <span className="hidden xs:inline">
                              Submit Quote Request
                            </span>
                            <span className="xs:hidden">Submit Request</span>
                            <Send className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>

                {/* Form Validation Hints */}
                {!isStepValid(currentStep) && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="text-sm text-amber-800">
                      {currentStep === 1 &&
                        "Please fill in all required fields with valid information."}
                      {currentStep === 2 && "Please select a service type."}
                      {currentStep === 3 &&
                        "Please provide a detailed project description (minimum 10 characters)."}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
