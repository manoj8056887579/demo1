"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Twitter, 
  Linkedin,
  Instagram,
  Youtube,
  MessageCircle,
  Send,
  Github,
  Palette,
  Dribbble,
} from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    // Basic Contact Information
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",

    // Social Media Links
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    whatsapp: "",
    telegram: "",
    github: "",
    behance: "",
    dribbble: "",

    // Google Maps Integration
    mapEmbedCode: "",

    // Contact Page Content
    pageTitle: "",
    pageDescription: "",
    officeTitle: "",
    officeDescription: "",
  });

  // Fetch contact information on component mount
  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/contact");
      const data = await response.json();

      if (data.success) {
        setContactInfo(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch contact information",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
      toast({
        title: "Error",
        description: "Failed to fetch contact information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch("/api/admin/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactInfo),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Contact Information Updated",
          description: "All contact information has been successfully saved.",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save contact information",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving contact info:", error);
      toast({
        title: "Error",
        description: "Failed to save contact information",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact information...</p>
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
            Contact Information
          </h1>
          <p className="text-gray-600 mt-2">
            Manage unified contact information for header, footer, and contact
            page
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-admin-gradient text-white border-0"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>

      {/* Basic Contact Information */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center bg-admin-gradient bg-clip-text text-transparent gap-2">
            <Phone className="h-5 w-5 text-admin-primary" />
            Basic Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="phone" className="text-base font-semibold">
                Primary Phone Number *
              </Label>
              <Input
                id="phone"
                value={contactInfo.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-base font-semibold">
                Primary Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter primary email"
                className="mt-2"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold bg-admin-gradient bg-clip-text text-transparent">
              Address Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-base font-semibold">
                  Street Address *
                </Label>
                <Input
                  id="address"
                  value={contactInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter street address"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-base font-semibold">
                  City *
                </Label>
                <Input
                  id="city"
                  value={contactInfo.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter city"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-base font-semibold">
                  State *
                </Label>
                <Input
                  id="state"
                  value={contactInfo.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Enter state"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="pincode" className="text-base font-semibold">
                  PIN Code *
                </Label>
                <Input
                  id="pincode"
                  value={contactInfo.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                  placeholder="Enter PIN code"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-base font-semibold">
                  Country *
                </Label>
                <Input
                  id="country"
                  value={contactInfo.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="Enter country"
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </CardContent>

        {/* Social Media Links */}
        <Card className="shadow-xl border-0 rounded-none">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 bg-admin-gradient bg-clip-text text-transparent">
              <Globe className="h-5 w-5 text-admin-primary" />
              Social Media Links
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="facebook"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <Facebook className="h-4 w-4 text-blue-600" />
                  Facebook URL
                </Label>
                <Input
                  id="facebook"
                  value={contactInfo.facebook}
                  onChange={(e) =>
                    handleInputChange("facebook", e.target.value)
                  }
                  placeholder="https://facebook.com/yourpage"
                  className="mt-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="twitter"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <Twitter className="h-4 w-4 text-blue-400" />
                  Twitter URL
                </Label>
                <Input
                  id="twitter"
                  value={contactInfo.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                  className="mt-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="linkedin"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4 text-blue-700" />
                  LinkedIn URL
                </Label>
                <Input
                  id="linkedin"
                  value={contactInfo.linkedin}
                  onChange={(e) =>
                    handleInputChange("linkedin", e.target.value)
                  }
                  placeholder="https://linkedin.com/company/yourcompany"
                  className="mt-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="instagram"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <Instagram className="h-4 w-4 text-pink-600" />
                  Instagram URL
                </Label>
                <Input
                  id="instagram"
                  value={contactInfo.instagram}
                  onChange={(e) =>
                    handleInputChange("instagram", e.target.value)
                  }
                  placeholder="https://instagram.com/yourhandle"
                  className="mt-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="youtube"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <Youtube className="h-4 w-4 text-red-600" />
                  YouTube URL
                </Label>
                <Input
                  id="youtube"
                  value={contactInfo.youtube}
                  onChange={(e) =>
                    handleInputChange("youtube", e.target.value)
                  }
                  placeholder="https://youtube.com/c/yourchannel"
                  className="mt-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="whatsapp"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  WhatsApp URL
                </Label>
                <Input
                  id="whatsapp"
                  value={contactInfo.whatsapp}
                  onChange={(e) =>
                    handleInputChange("whatsapp", e.target.value)
                  }
                  placeholder="https://wa.me/yournumber"
                  className="mt-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="telegram"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <Send className="h-4 w-4 text-blue-500" />
                  Telegram URL
                </Label>
                <Input
                  id="telegram"
                  value={contactInfo.telegram}
                  onChange={(e) =>
                    handleInputChange("telegram", e.target.value)
                  }
                  placeholder="https://t.me/yourusername"
                  className="mt-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="github"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  GitHub URL
                </Label>
                <Input
                  id="github"
                  value={contactInfo.github}
                  onChange={(e) =>
                    handleInputChange("github", e.target.value)
                  }
                  placeholder="https://github.com/yourusername"
                  className="mt-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="behance"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <Palette className="h-4 w-4 text-blue-600" />
                  Behance URL
                </Label>
                <Input
                  id="behance"
                  value={contactInfo.behance}
                  onChange={(e) =>
                    handleInputChange("behance", e.target.value)
                  }
                  placeholder="https://behance.net/yourusername"
                  className="mt-2"
                />
              </div>
              <div>
                <Label
                  htmlFor="dribbble"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <Dribbble className="h-4 w-4 text-pink-500" />
                  Dribbble URL
                </Label>
                <Input
                  id="dribbble"
                  value={contactInfo.dribbble}
                  onChange={(e) =>
                    handleInputChange("dribbble", e.target.value)
                  }
                  placeholder="https://dribbble.com/yourusername"
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google Maps Integration */}
        <Card className="shadow-xl border-0 rounded-none">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
            <CardTitle className="flex items-center gap-2 bg-admin-gradient bg-clip-text text-transparent">
              <MapPin className="h-5 w-5 text-admin-primary" />
              Google Maps Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div>
              <Label htmlFor="mapEmbedCode" className="text-base font-semibold">
                Map Embed Code (Optional)
              </Label>
              <Textarea
                id="mapEmbedCode"
                value={contactInfo.mapEmbedCode}
                onChange={(e) =>
                  handleInputChange("mapEmbedCode", e.target.value)
                }
                placeholder="<iframe src='...' width='600' height='450'></iframe>"
                rows={4}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Embed code from Google Maps for displaying interactive map on
                contact page (width and height can be adjusted as needed 100%).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Page Content */}
        <Card className="shadow-xl border-0 rounded-none">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
            <CardTitle className="flex items-center gap-2 bg-admin-gradient bg-clip-text text-transparent">
              <Mail className="h-5 w-5 text-admin-primary" />
              Contact Page Content
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div>
              <Label htmlFor="pageTitle" className="text-base font-semibold">
                Page Title
              </Label>
              <Input
                id="pageTitle"
                value={contactInfo.pageTitle}
                onChange={(e) => handleInputChange("pageTitle", e.target.value)}
                placeholder="Let's Discuss Your Engineering Needs"
                className="mt-2"
              />
            </div>
            <div>
              <Label
                htmlFor="pageDescription"
                className="text-base font-semibold"
              >
                Page Description
              </Label>
              <Textarea
                id="pageDescription"
                value={contactInfo.pageDescription}
                onChange={(e) =>
                  handleInputChange("pageDescription", e.target.value)
                }
                placeholder="Ready to transform your engineering challenges into innovative solutions?"
                rows={3}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="officeTitle" className="text-base font-semibold">
                Office Section Title
              </Label>
              <Input
                id="officeTitle"
                value={contactInfo.officeTitle}
                onChange={(e) =>
                  handleInputChange("officeTitle", e.target.value)
                }
                placeholder="Visit Our Office in Madurai, Tamil Nadu"
                className="mt-2"
              />
            </div>
            <div>
              <Label
                htmlFor="officeDescription"
                className="text-base font-semibold"
              >
                Office Section Description
              </Label>
              <Textarea
                id="officeDescription"
                value={contactInfo.officeDescription}
                onChange={(e) =>
                  handleInputChange("officeDescription", e.target.value)
                }
                placeholder="Located in the heart of Madurai, our office is easily accessible..."
                rows={3}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
      </Card>
    </div>
  );
}
