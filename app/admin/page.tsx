"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, Settings, Plus, Briefcase, Globe, Mail, Loader2 } from "lucide-react"
import axios from "axios"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function AdminDashboard() {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  interface Lead {
    _id: string;
    fullName: string;
    email: string;
    service: string;
    status: string;
    priority: string;
    submittedAt: string;
  }

  interface DashboardData {
    totalLeads: number;
    totalServices: number;
    totalPortfolio: number;
    recentLeads: Lead[];
  }

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalLeads: 0,
    totalServices: 0,
    totalPortfolio: 0,
    recentLeads: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const [leadsResponse, servicesResponse, portfolioResponse] = await Promise.all([
          axios.get('/api/admin/lead?all=true'),
          axios.get('/api/admin/services?all=true'),
          axios.get('/api/admin/portfolio?all=true')
        ]);

        setDashboardData({
          totalLeads: leadsResponse.data.data.length,
          totalServices: servicesResponse.data.data.length,
          totalPortfolio: portfolioResponse.data.data.length,
          recentLeads: leadsResponse.data.data.slice(0, 3) // Get latest 3 leads
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Active Leads",
      value: dashboardData.totalLeads.toString(),
      change: "New",
      trend: "up",
      icon: <Users className="h-6 w-6" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Services",
      value: dashboardData.totalServices.toString(),
      change: "Active",
      trend: "up",
      icon: <Settings className="h-6 w-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Portfolio Items",
      value: dashboardData.totalPortfolio.toString(),
      change: "Total",
      trend: "up",
      icon: <Briefcase className="h-6 w-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  // Format date helper function
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
    

  const quickActions = [
    {
      title: "Add New Service",
      href: "/admin/services",
      icon: <Settings className="h-4 w-4" />,
      description: "Create new service offerings",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Add Portfolio Item",
      href: "/admin/portfolio",
      icon: <Briefcase className="h-4 w-4" />,
      description: "Showcase your latest work",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "View Leads",
      href: "/admin/leads",
      icon: <Users className="h-4 w-4" />,
      description: "Manage customer inquiries",
      color: "from-green-500 to-green-600",
    },
    {
      title: "SEO Settings",
      href: "/admin/seo",
      icon: <Globe className="h-4 w-4" />,
      description: "Optimize search visibility",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Theme Settings",
      href: "/admin/theme",
      icon: <BarChart3 className="h-4 w-4" />,
      description: "Customize website appearance",
      color: "from-pink-500 to-pink-600",
    },
    {
      title: "Contact Settings",
      href: "/admin/contact",
      icon: <Mail className="h-4 w-4" />,
      description: "Update contact information",
      color: "from-teal-500 to-teal-600",
    },
  ]

  const handleActionClick = (title: string) => {
    setLoadingAction(title)
    // Simulate loading time
    setTimeout(() => {
      setLoadingAction(null)
    }, 800)
  }

  return (
    <div className=" -m-6 min-h-[calc(100vh-4rem)] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <motion.div
          className="bg-admin-gradient rounded-2xl p-8 text-white shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, Admin!</h1>
              <p className="text-blue-100 text-lg">Here's what's happening with your website today.</p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    <Badge
                      variant="default"
                      className="flex items-center gap-1 bg-green-100 text-green-800 border-green-200"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Leads */}
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm h-full">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-admin-primary">
                    <Users className="h-5 w-5" />
                    Recent Leads
                  </CardTitle>
                  <Link href="/admin/leads">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-200 text-admin-primary hover:bg-blue-50 bg-transparent"
                      onClick={() => handleActionClick("View All Leads")}
                      disabled={loadingAction === "View All Leads"}
                    >
                      {loadingAction === "View All Leads" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {dashboardData.recentLeads.map((lead) => (
                    <div
                      key={lead._id}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-12 h-12 bg-admin-gradient rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {lead.fullName
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{lead.fullName}</p>
                        <p className="text-sm text-gray-600">{lead.service}</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={lead.status === "new" ? "default" : "secondary"}
                          className={lead.status === "new" ? "bg-blue-100 text-blue-800" : ""}
                        >
                          {lead.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(lead.submittedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 text-admin-primary">
                  <Plus className="h-5 w-5" />
                  Quick Actions
                </CardTitle> 
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link href={action.href}>
                        <Button
                          variant="outline"
                          className="h-24 w-full flex flex-col items-center justify-center space-y-2 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-white relative overflow-hidden group"
                          onClick={() => handleActionClick(action.title)}
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                          />
                          <div className="relative z-10 flex flex-col items-center space-y-2">
                          
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white`}>
                                {action.icon}
                              </div>
                            
                            <div className="text-center">
                              <span className="text-xs font-medium text-gray-900 block">{action.title}</span>
                              <span className="text-xs text-gray-500 block mt-1">{action.description}</span>
                            </div>
                          </div>
                        </Button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

     
      </div>
    </div>
  )
}
