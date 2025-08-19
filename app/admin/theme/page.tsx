"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Palette,
  Eye,
  Save,
  RotateCcw,
  Monitor,
  Smartphone,
  Tablet,
  ImageIcon,
  Upload,
} from "lucide-react";
import { useTheme } from "@/components/providers/theme";

export default function ThemePage() {
  const { toast } = useToast();
  const { themeData, updateFavicon, refreshTheme } = useTheme();
  const [logo, setLogo] = useState<string | null>(null);
  const [favicon, setFavicon] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [secondaryColor, setSecondaryColor] = useState("#9333ea");
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const [loading, setLoading] = useState(false);

  // Load theme data from context when available
  useEffect(() => {
    if (themeData) {
      setLogo(themeData.logo);
      setFavicon(themeData.favicon);
      setPrimaryColor(themeData.primaryColor);
      setSecondaryColor(themeData.secondaryColor);
    }
  }, [themeData]);

  // Load theme settings on component mount
  useEffect(() => {
    fetchThemeSettings();
  }, []);

  // Update CSS variables when colors change
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;

      // Update admin theme variables
      root.style.setProperty("--admin-primary", primaryColor);
      root.style.setProperty("--admin-secondary", secondaryColor);
      root.style.setProperty(
        "--admin-gradient",
        `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
      );
    }
  }, [primaryColor, secondaryColor]);

  // API Functions
  const fetchThemeSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/theme");
      const data = await response.json();

      if (data.success) {
        const theme = data.data;
        setLogo(theme.logo);
        setFavicon(theme.favicon);
        setPrimaryColor(theme.primaryColor);
        setSecondaryColor(theme.secondaryColor);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch theme settings",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch theme settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveThemeSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/theme", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteName: "Filigree Solutions",
          logo,
          favicon,
          primaryColor,
          secondaryColor,
          gradientDirection: "135deg",
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update favicon dynamically if it was changed
        if (data.data.favicon && data.data.favicon !== favicon) {
          updateFavicon(data.data.favicon);
        }
        
        // Refresh theme data from context
        await refreshTheme();
        
        toast({
          title: "Success",
          description: "Theme settings saved successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save theme settings",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save theme settings",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetThemeSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/theme", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        const theme = data.data;
        setLogo(theme.logo);
        setFavicon(theme.favicon);
        setPrimaryColor(theme.primaryColor);
        setSecondaryColor(theme.secondaryColor);

        toast({
          title: "Success",
          description: "Theme settings reset to default",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to reset theme settings",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset theme settings",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFavicon(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getPreviewContainerClass = () => {
    switch (previewDevice) {
      case "tablet":
        return "max-w-md mx-auto";
      case "mobile":
        return "max-w-sm mx-auto";
      default:
        return "w-full";
    }
  };/*  */

  // Create dynamic gradient based on primary and secondary colors
  const getDynamicGradient = () => {
    return `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-admin-gradient bg-clip-text text-transparent">
            Theme Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Customize your website's appearance and branding
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={resetThemeSettings}
            variant="outline"
            className="flex items-center bg-transparent"
            disabled={loading}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={saveThemeSettings}
            className="flex items-center bg-admin-gradient text-white"
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Theme Settings */}
        <div className="lg:col-span-2 space-y-8">
          {/* Logo & Favicon */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-admin-primary" />
                Brand Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 grid grid-cols-2">
              {/* Logo Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Website Logo
                </Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    {logo ? (
                      <img
                        src={logo || "/placeholder.svg"}
                        alt="Logo"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Label
                      htmlFor="logo-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Label>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: PNG or SVG format, max 2MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Favicon Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Favicon
                </Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    {favicon ? (
                      <img
                        src={favicon || "/placeholder.svg"}
                        alt="Favicon"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFaviconUpload}
                      className="hidden"
                      id="favicon-upload"
                    />
                    <Label
                      htmlFor="favicon-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Favicon
                    </Label>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: 32x32px ICO or PNG format
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Settings */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-600" />
                Color Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Primary Color */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Primary Color
                </Label>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <div className="flex-1">
                    <Input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full h-12"
                    />
                  </div>
                  <div className="text-sm font-mono text-gray-600 bg-gray-100 px-3 py-2 rounded">
                    {primaryColor}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  This color will be applied to buttons, links, and accent
                  elements throughout the website.
                </p>
              </div>

              {/* Secondary Color */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Secondary Color
                </Label>
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: secondaryColor }}
                  ></div>
                  <div className="flex-1">
                    <Input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full h-12"
                    />
                  </div>
                  <div className="text-sm font-mono text-gray-600 bg-gray-100 px-3 py-2 rounded">
                    {secondaryColor}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  This color will be used for backgrounds, cards, and secondary
                  elements.
                </p>
              </div>

              {/* Advanced Gradient Color Presets */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700">
                  Advanced Gradient Presets
                </Label>

                {/* Premium Gradient Collection */}
                <div className="space-y-3">
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    Premium Gradients
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        name: "Ocean Breeze",
                        primary: "#0ea5e9",
                        secondary: "#06b6d4",
                        description: "Blue to Cyan",
                      },
                      {
                        name: "Sunset Glow",
                        primary: "#f59e0b",
                        secondary: "#ec4899",
                        description: "Orange to Pink",
                      },
                      {
                        name: "Forest Mist",
                        primary: "#10b981",
                        secondary: "#059669",
                        description: "Emerald to Green",
                      },
                      {
                        name: "Royal Purple",
                        primary: "#8b5cf6",
                        secondary: "#a855f7",
                        description: "Purple to Violet",
                      },
                      {
                        name: "Fire Ember",
                        primary: "#ef4444",
                        secondary: "#f97316",
                        description: "Red to Orange",
                      },
                      {
                        name: "Arctic Blue",
                        primary: "#3b82f6",
                        secondary: "#6366f1",
                        description: "Blue to Indigo",
                      },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setPrimaryColor(preset.primary);
                          setSecondaryColor(preset.secondary);
                        }}
                        className="group relative p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all hover:scale-105"
                        title={`${preset.name} - ${preset.description}`}
                      >
                        <div
                          className="w-full h-8 rounded-lg mb-2"
                          style={{
                            background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)`,
                          }}
                        ></div>
                        <div className="text-xs text-gray-700 font-medium">
                          {preset.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {preset.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Creative Gradient Collection */}
                <div className="space-y-3">
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    Creative Gradients
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        name: "Cosmic Dream",
                        primary: "#6366f1",
                        secondary: "#ec4899",
                        description: "Indigo to Pink",
                      },
                      {
                        name: "Tropical Vibes",
                        primary: "#10b981",
                        secondary: "#f59e0b",
                        description: "Green to Orange",
                      },
                      {
                        name: "Midnight Sky",
                        primary: "#1e293b",
                        secondary: "#3b82f6",
                        description: "Dark to Blue",
                      },
                      {
                        name: "Cherry Blossom",
                        primary: "#ec4899",
                        secondary: "#fbbf24",
                        description: "Pink to Yellow",
                      },
                      {
                        name: "Deep Ocean",
                        primary: "#0f172a",
                        secondary: "#0ea5e9",
                        description: "Navy to Sky",
                      },
                      {
                        name: "Autumn Leaves",
                        primary: "#dc2626",
                        secondary: "#f59e0b",
                        description: "Red to Amber",
                      },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setPrimaryColor(preset.primary);
                          setSecondaryColor(preset.secondary);
                        }}
                        className="group relative p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all hover:scale-105"
                        title={`${preset.name} - ${preset.description}`}
                      >
                        <div
                          className="w-full h-8 rounded-lg mb-2"
                          style={{
                            background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)`,
                          }}
                        ></div>
                        <div className="text-xs text-gray-700 font-medium">
                          {preset.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {preset.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Professional Gradient Collection */}
                <div className="space-y-3">
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    Professional Gradients
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      {
                        name: "Corporate Blue",
                        primary: "#1e40af",
                        secondary: "#3b82f6",
                        description: "Professional",
                      },
                      {
                        name: "Tech Green",
                        primary: "#059669",
                        secondary: "#10b981",
                        description: "Modern",
                      },
                      {
                        name: "Executive Gray",
                        primary: "#374151",
                        secondary: "#6b7280",
                        description: "Elegant",
                      },
                      {
                        name: "Innovation Purple",
                        primary: "#7c3aed",
                        secondary: "#a855f7",
                        description: "Creative",
                      },
                      {
                        name: "Energy Orange",
                        primary: "#ea580c",
                        secondary: "#f97316",
                        description: "Dynamic",
                      },
                      {
                        name: "Trust Teal",
                        primary: "#0f766e",
                        secondary: "#14b8a6",
                        description: "Reliable",
                      },
                      {
                        name: "Premium Gold",
                        primary: "#d97706",
                        secondary: "#f59e0b",
                        description: "Luxury",
                      },
                      {
                        name: "Classic Navy",
                        primary: "#1e3a8a",
                        secondary: "#3730a3",
                        description: "Timeless",
                      },
                    ].map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setPrimaryColor(preset.primary);
                          setSecondaryColor(preset.secondary);
                        }}
                        className="group relative p-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all hover:scale-105"
                        title={`${preset.name} - ${preset.description}`}
                      >
                        <div
                          className="w-full h-6 rounded-md mb-1"
                          style={{
                            background: `linear-gradient(135deg, ${preset.primary} 0%, ${preset.secondary} 100%)`,
                          }}
                        ></div>
                        <div className="text-xs text-gray-700 font-medium">
                          {preset.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {preset.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Click on any gradient preset to instantly apply the color
                  combination. Each preset is optimized for different use cases
                  and brand personalities.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <Card className="shadow-lg border-0 sticky top-8">
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Device Preview Tabs */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    previewDevice === "desktop"
                      ? "bg-white shadow-sm"
                      : "text-gray-600"
                  }`}
                  onClick={() => setPreviewDevice("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                  Desktop
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    previewDevice === "tablet"
                      ? "bg-white shadow-sm"
                      : "text-gray-600"
                  }`}
                  onClick={() => setPreviewDevice("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                  Tablet
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    previewDevice === "mobile"
                      ? "bg-white shadow-sm"
                      : "text-gray-600"
                  }`}
                  onClick={() => setPreviewDevice("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </button>
              </div>

              {/* Preview Window */}
              <div className={getPreviewContainerClass()}>
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                  {/* Header Preview */}
                  <div className="bg-white border-b border-gray-200 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {logo ? (
                          <img
                            src={logo || "/placeholder.svg"}
                            alt="Logo"
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                            style={{ background: getDynamicGradient() }}
                          >
                            F
                          </div>
                        )}
                        <div>
                          <div
                            className="text-sm font-bold"
                            style={{ color: primaryColor }}
                          >
                            Filigree
                          </div>
                          <div className="text-xs text-gray-600">Solutions</div>
                        </div>
                      </div>
                      <div
                        className="px-3 py-1 rounded text-xs font-medium text-white"
                        style={{ background: getDynamicGradient() }}
                      >
                        Get Quote
                      </div>
                    </div>
                  </div>

                  {/* Hero Section Preview */}
                  <div className="p-6 text-white text-center">
                    <div className="text-lg font-bold mb-2">
                      Engineering Excellence
                    </div>
                    <div className="text-xs opacity-90 mb-3">
                      Transform your engineering challenges into innovative
                      solutions
                    </div>
                    <div
                      className="inline-block px-3 py-1 rounded text-xs font-medium"
                      style={{ background: getDynamicGradient() }}
                    >
                      Get Started
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview Buttons */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Button Previews
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Primary Color Button */}
                  <button
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:scale-105"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Primary Button
                  </button>

                  {/* Gradient Button */}
                  <button
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-all hover:scale-105"
                    style={{ background: getDynamicGradient() }}
                  >
                    Gradient Button
                  </button>

                  {/* Secondary Outline Button */}
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all hover:scale-105"
                    style={{
                      borderColor: primaryColor,
                      color: primaryColor,
                      backgroundColor: "transparent",
                    }}
                  >
                    Outline Button
                  </button>

                  {/* Secondary Background Button */}
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                    style={{
                      backgroundColor: secondaryColor,
                      color: primaryColor,
                    }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>

              {/* Preview Info */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Logo: {logo ? "Custom uploaded" : "Default"}</p>
                <p>• Primary Color: {primaryColor}</p>
                <p>• Secondary Color: {secondaryColor}</p>
                <p>• Gradient: Primary → Secondary</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
