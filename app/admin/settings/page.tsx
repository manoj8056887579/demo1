"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Upload, Settings, Globe, Mail, Phone, Palette, Code, Server, Shield } from 'lucide-react'

export default function SiteSettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Filigree Solutions",
    tagline: "Advanced CAD & CAE Services",
    description: "Leading provider of CAD, CAE, structural analysis, and engineering simulation services across India.",
    logo: "/placeholder.svg?height=80&width=200",
    favicon: "/placeholder.svg?height=32&width=32",
    
    // Contact Information
    phone: "9158549166",
    email: "info@filigreesolutions.com",
    supportEmail: "manoj@mntfuture.com",
    address: "88/153, East Street, Pandiyan Nagar, South Madurai, Madurai-625006, Tamil Nadu",
    
    // Social Media
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    
    // SEO Settings
    defaultMetaTitle: "Filigree Solutions - Advanced CAD & CAE Services",
    defaultMetaDescription: "Leading provider of CAD, CAE, structural analysis, and engineering simulation services across India.",
    defaultKeywords: "CAD services, CAE analysis, structural analysis, 3D modeling, engineering simulation",
    googleAnalyticsId: "",
    googleTagManagerId: "",
    
    // Theme Settings
    primaryColor: "#3B82F6",
    secondaryColor: "#8B5CF6",
    accentColor: "#10B981",
    
    // Email Configuration
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    smtpSecure: "tls",
    fromEmail: "noreply@filigreesolutions.com",
    fromName: "Filigree Solutions",
    replyToEmail: "info@filigreesolutions.com",
    
    // Email Templates
    contactFormSubject: "New Contact Form Submission",
    quotationSubject: "New Quotation Request",
    autoReplyEnabled: true,
    autoReplySubject: "Thank you for contacting Filigree Solutions",
    autoReplyMessage: "Thank you for your inquiry. We have received your message and will get back to you within 24 hours.",
    
    // Business Settings
    businessHours: "Monday - Friday: 9:00 AM - 6:00 PM, Saturday: 9:00 AM - 2:00 PM",
    timezone: "Asia/Kolkata",
    currency: "INR",
    language: "en",
    
    // Advanced Settings
    maintenanceMode: false,
    allowRegistration: false,
    cacheEnabled: true,
    compressionEnabled: true,
  })

  const tabs = [
    { id: "general", name: "General", icon: <Settings className="h-4 w-4" /> },
    { id: "contact", name: "Contact", icon: <Phone className="h-4 w-4" /> },
    { id: "seo", name: "SEO", icon: <Globe className="h-4 w-4" /> },
    { id: "theme", name: "Theme", icon: <Palette className="h-4 w-4" /> },
    { id: "email", name: "Email Config", icon: <Mail className="h-4 w-4" /> },
    { id: "advanced", name: "Advanced", icon: <Code className="h-4 w-4" /> },
  ]

  const handleSave = () => {
    // In a real application, this would save to the backend
    toast({
      title: "Settings Saved",
      description: "Site settings have been successfully saved.",
    })
  }

  const handleLogoUpload = (type: "logo" | "favicon") => {
    const imageUrl = `/placeholder.svg?height=${type === "logo" ? 80 : 32}&width=${type === "logo" ? 200 : 32}&query=${type} upload`
    setSettings({ ...settings, [type]: imageUrl })
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Uploaded`,
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} has been successfully uploaded.`,
    })
  }

  const testEmailConnection = () => {
    // Simulate email connection test
    toast({
      title: "Testing Email Connection",
      description: "Testing SMTP connection...",
    })
    
    setTimeout(() => {
      toast({
        title: "Email Test Successful",
        description: "SMTP connection established successfully.",
      })
    }, 2000)
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold gradient-text">General Settings</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="siteName" className="text-base font-semibold">
            Site Name *
          </Label>
          <Input
            id="siteName"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="tagline" className="text-base font-semibold">
            Tagline
          </Label>
          <Input
            id="tagline"
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description" className="text-base font-semibold">
          Site Description
        </Label>
        <Textarea
          id="description"
          value={settings.description}
          onChange={(e) => setSettings({ ...settings, description: e.target.value })}
          rows={4}
          className="mt-2"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label className="text-base font-semibold">Site Logo</Label>
          <div className="mt-2 space-y-4">
            {settings.logo && (
              <img src={settings.logo || "/placeholder.svg"} alt="Site logo" className="h-16 w-auto border rounded" />
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleLogoUpload("logo")}
                className="flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </Button>
              <Input
                placeholder="Or paste logo URL"
                value={settings.logo}
                onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>
        <div>
          <Label className="text-base font-semibold">Favicon</Label>
          <div className="mt-2 space-y-4">
            {settings.favicon && (
              <img src={settings.favicon || "/placeholder.svg"} alt="Favicon" className="h-8 w-8 border rounded" />
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleLogoUpload("favicon")}
                className="flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Favicon
              </Button>
              <Input
                placeholder="Or paste favicon URL"
                value={settings.favicon}
                onChange={(e) => setSettings({ ...settings, favicon: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <Label className="text-base font-semibold">Timezone</Label>
          <Select value={settings.timezone} onValueChange={(value) => setSettings({ ...settings, timezone: value })}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="America/New_York">America/New_York</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-base font-semibold">Currency</Label>
          <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR (₹)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-base font-semibold">Language</Label>
          <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="ta">Tamil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderContactSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold gradient-text">Contact Information</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phone" className="text-base font-semibold">
            Phone Number *
          </Label>
          <Input
            id="phone"
            value={settings.phone}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
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
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="supportEmail" className="text-base font-semibold">
            Support Email
          </Label>
          <Input
            id="supportEmail"
            type="email"
            value={settings.supportEmail}
            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="businessHours" className="text-base font-semibold">
            Business Hours
          </Label>
          <Input
            id="businessHours"
            value={settings.businessHours}
            onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address" className="text-base font-semibold">
          Business Address
        </Label>
        <Textarea
          id="address"
          value={settings.address}
          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
          rows={3}
          className="mt-2"
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-semibold">Social Media Links</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              value={settings.facebook}
              onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
              placeholder="https://facebook.com/yourpage"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={settings.twitter}
              onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
              placeholder="https://twitter.com/yourhandle"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={settings.linkedin}
              onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
              placeholder="https://linkedin.com/company/yourcompany"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={settings.instagram}
              onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              placeholder="https://instagram.com/yourhandle"
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold gradient-text">SEO Settings</h3>
      
      <div>
        <Label htmlFor="defaultMetaTitle" className="text-base font-semibold">
          Default Meta Title
        </Label>
        <Input
          id="defaultMetaTitle"
          value={settings.defaultMetaTitle}
          onChange={(e) => setSettings({ ...settings, defaultMetaTitle: e.target.value })}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="defaultMetaDescription" className="text-base font-semibold">
          Default Meta Description
        </Label>
        <Textarea
          id="defaultMetaDescription"
          value={settings.defaultMetaDescription}
          onChange={(e) => setSettings({ ...settings, defaultMetaDescription: e.target.value })}
          rows={3}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="defaultKeywords" className="text-base font-semibold">
          Default Keywords
        </Label>
        <Input
          id="defaultKeywords"
          value={settings.defaultKeywords}
          onChange={(e) => setSettings({ ...settings, defaultKeywords: e.target.value })}
          placeholder="keyword1, keyword2, keyword3"
          className="mt-2"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="googleAnalyticsId" className="text-base font-semibold">
            Google Analytics ID
          </Label>
          <Input
            id="googleAnalyticsId"
            value={settings.googleAnalyticsId}
            onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
            placeholder="GA-XXXXXXXXX-X"
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="googleTagManagerId" className="text-base font-semibold">
            Google Tag Manager ID
          </Label>
          <Input
            id="googleTagManagerId"
            value={settings.googleTagManagerId}
            onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value })}
            placeholder="GTM-XXXXXXX"
            className="mt-2"
          />
        </div>
      </div>
    </div>
  )

  const renderThemeSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold gradient-text">Theme Settings</h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="primaryColor" className="text-base font-semibold">
            Primary Color
          </Label>
          <div className="mt-2 flex gap-2">
            <Input
              id="primaryColor"
              type="color"
              value={settings.primaryColor}
              onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
              className="w-16 h-10 p-1 border rounded"
            />
            <Input
              value={settings.primaryColor}
              onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
              placeholder="#3B82F6"
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="secondaryColor" className="text-base font-semibold">
            Secondary Color
          </Label>
          <div className="mt-2 flex gap-2">
            <Input
              id="secondaryColor"
              type="color"
              value={settings.secondaryColor}
              onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
              className="w-16 h-10 p-1 border rounded"
            />
            <Input
              value={settings.secondaryColor}
              onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
              placeholder="#8B5CF6"
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="accentColor" className="text-base font-semibold">
            Accent Color
          </Label>
          <div className="mt-2 flex gap-2">
            <Input
              id="accentColor"
              type="color"
              value={settings.accentColor}
              onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
              className="w-16 h-10 p-1 border rounded"
            />
            <Input
              value={settings.accentColor}
              onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
              placeholder="#10B981"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderEmailSettings = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold gradient-text">Email Configuration</h3>
        <Button onClick={testEmailConnection} variant="outline" className="flex items-center">
          <Server className="h-4 w-4 mr-2" />
          Test Connection
        </Button>
      </div>
      
      {/* SMTP Configuration */}
      <div className="space-y-6">
        <h4 className="text-base font-semibold text-gray-900">SMTP Server Settings</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="smtpHost" className="text-base font-semibold">
              SMTP Host *
            </Label>
            <Input
              id="smtpHost"
              value={settings.smtpHost}
              onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
              placeholder="smtp.gmail.com"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="smtpPort" className="text-base font-semibold">
              SMTP Port *
            </Label>
            <Input
              id="smtpPort"
              value={settings.smtpPort}
              onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
              placeholder="587"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="smtpUser" className="text-base font-semibold">
              SMTP Username *
            </Label>
            <Input
              id="smtpUser"
              value={settings.smtpUser}
              onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
              placeholder="your-email@gmail.com"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="smtpPassword" className="text-base font-semibold">
              SMTP Password *
            </Label>
            <Input
              id="smtpPassword"
              type="password"
              value={settings.smtpPassword}
              onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
              placeholder="Your app password"
              className="mt-2"
            />
          </div>
          <div>
            <Label className="text-base font-semibold">Security</Label>
            <Select value={settings.smtpSecure} onValueChange={(value) => setSettings({ ...settings, smtpSecure: value })}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tls">TLS</SelectItem>
                <SelectItem value="ssl">SSL</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Email Addresses */}
      <div className="space-y-6">
        <h4 className="text-base font-semibold text-gray-900">Email Addresses</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fromEmail" className="text-base font-semibold">
              From Email *
            </Label>
            <Input
              id="fromEmail"
              type="email"
              value={settings.fromEmail}
              onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
              placeholder="noreply@filigreesolutions.com"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="fromName" className="text-base font-semibold">
              From Name *
            </Label>
            <Input
              id="fromName"
              value={settings.fromName}
              onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
              placeholder="Filigree Solutions"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="replyToEmail" className="text-base font-semibold">
              Reply-To Email
            </Label>
            <Input
              id="replyToEmail"
              type="email"
              value={settings.replyToEmail}
              onChange={(e) => setSettings({ ...settings, replyToEmail: e.target.value })}
              placeholder="info@filigreesolutions.com"
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Email Templates */}
      <div className="space-y-6">
        <h4 className="text-base font-semibold text-gray-900">Email Templates</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="contactFormSubject" className="text-base font-semibold">
              Contact Form Subject
            </Label>
            <Input
              id="contactFormSubject"
              value={settings.contactFormSubject}
              onChange={(e) => setSettings({ ...settings, contactFormSubject: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="quotationSubject" className="text-base font-semibold">
              Quotation Request Subject
            </Label>
            <Input
              id="quotationSubject"
              value={settings.quotationSubject}
              onChange={(e) => setSettings({ ...settings, quotationSubject: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Auto-Reply Settings */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoReplyEnabled"
            checked={settings.autoReplyEnabled}
            onChange={(e) => setSettings({ ...settings, autoReplyEnabled: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="autoReplyEnabled" className="text-base font-semibold">
            Enable Auto-Reply
          </Label>
        </div>
        
        {settings.autoReplyEnabled && (
          <div className="space-y-4 pl-6 border-l-2 border-blue-200">
            <div>
              <Label htmlFor="autoReplySubject" className="text-base font-semibold">
                Auto-Reply Subject
              </Label>
              <Input
                id="autoReplySubject"
                value={settings.autoReplySubject}
                onChange={(e) => setSettings({ ...settings, autoReplySubject: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="autoReplyMessage" className="text-base font-semibold">
                Auto-Reply Message
              </Label>
              <Textarea
                id="autoReplyMessage"
                value={settings.autoReplyMessage}
                onChange={(e) => setSettings({ ...settings, autoReplyMessage: e.target.value })}
                rows={4}
                className="mt-2"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold gradient-text">Advanced Settings</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="maintenanceMode" className="text-base font-semibold">
            Maintenance Mode
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="allowRegistration"
            checked={settings.allowRegistration}
            onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="allowRegistration" className="text-base font-semibold">
            Allow User Registration
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="cacheEnabled"
            checked={settings.cacheEnabled}
            onChange={(e) => setSettings({ ...settings, cacheEnabled: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="cacheEnabled" className="text-base font-semibold">
            Enable Caching
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="compressionEnabled"
            checked={settings.compressionEnabled}
            onChange={(e) => setSettings({ ...settings, compressionEnabled: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="compressionEnabled" className="text-base font-semibold">
            Enable Compression
          </Label>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Site Settings</h1>
          <p className="text-gray-600 mt-2">Configure your website settings and preferences</p>
        </div>
        <Button onClick={handleSave} className="btn-gradient text-white border-0">
          <Settings className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow-xl border-0 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "general" && renderGeneralSettings()}
          {activeTab === "contact" && renderContactSettings()}
          {activeTab === "seo" && renderSEOSettings()}
          {activeTab === "theme" && renderThemeSettings()}
          {activeTab === "email" && renderEmailSettings()}
          {activeTab === "advanced" && renderAdvancedSettings()}
        </div>
      </div>
    </div>
  )
}
