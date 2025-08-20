"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from  "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import Link from "next/link"
import {
  Search,
  Filter,
  ExternalLink,
  Calendar,
  Building,
  Zap,
  Settings,
  BarChart3,
  Target,
  Star,
  ArrowRight,
} from "lucide-react"
import { useSearchParams } from "next/navigation"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

interface PortfolioItem {
  _id: string
  title: string
  category: string
  shortDescription: string
  image: string
  tags: string[]
  client: string
  duration: string
  year: string
  slug?: string
}

interface Category {
  _id: string
  name: string
}

interface PortfolioProps {
  portfolioItems: PortfolioItem[]
  categories: Category[]
}

export const Portfolio = ({ portfolioItems = [], categories = [] }: PortfolioProps) => {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get("category")

  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6 // Show 6 items per page

  useEffect(() => {
    console.log("Portfolio Component Mount:", { 
      categoriesCount: categories.length,
      categories: categories
    });
  }, [categories]);

  // Set initial category from URL parameter
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [categoryFromUrl])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchTerm])

  // Create categories array with only dynamic categories from the API
  console.log("Categories from API:", categories); // Debug log
  const allCategories = ["All", ...categories.map((cat) => cat.name)]
  console.log("All categories array:", allCategories); // Debug log

  const filteredProjects = portfolioItems.filter((project) => {
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.tags && project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    return matchesCategory && matchesSearch
  })
  
  useEffect(() => {
    console.log("Filtered Projects:", {
      total: portfolioItems.length,
      filtered: filteredProjects.length,
      category: selectedCategory
    });
  }, [filteredProjects.length, portfolioItems.length, selectedCategory]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = filteredProjects.slice(startIndex, endIndex)

  // Function to create URL-friendly slug from portfolio title
  const createSlug = (title: string) => { 
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const getCategoryIcon = (category: string) => {
    // Only return icons for All and default case
    if (category === "All") {
      return <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
    }
    return <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
  }


  return (
    <>
      {/* Hero Section - Enhanced responsive design */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-admin-gradient"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-4 left-4 sm:top-10 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white/10 rounded-full blur-xl"
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
            className="absolute bottom-4 right-4 sm:bottom-10 sm:right-10 w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/10 rounded-full blur-xl"
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

        <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-3 sm:mb-4 bg-white/20 hover:bg-admin-secondary text-white border-white/30 backdrop-blur-sm px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Our Portfolio
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              Engineering Projects That Inspire
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed px-2">
              Explore our successful engineering projects and discover how we've helped clients achieve their goals
              through innovative solutions and cutting-edge technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section id="projects" className="py-8 sm:py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Search Box */}
            <div className="relative max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 text-base w-full bg-gray-50 border-gray-200 focus:bg-white shadow-sm"
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="relative">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-2">
                <div className="flex gap-2 justify-center min-w-max px-4">
                    {Array.isArray(allCategories) && allCategories.length > 0 ? (
                      allCategories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={`flex items-center gap-1.5 h-9 px-3 whitespace-nowrap flex-shrink-0 text-sm transition-all duration-200 ${
                          selectedCategory === category 
                            ? "bg-admin-gradient text-white shadow-sm hover:shadow" 
                            : "hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        {getCategoryIcon(category)}
                        <span>{category}</span>
                      </Button>
                    ))
                    ) : (
                      <div className="text-gray-500 text-sm">No categories available</div>
                    )}

                  </div>
                  <style jsx global>{`
                    .no-scrollbar {
                      -ms-overflow-style: none;
                      scrollbar-width: none;
                    }
                    .no-scrollbar::-webkit-scrollbar {
                      display: none;
                    }
                    @media (max-width: 640px) {
                      .overflow-x-auto {
                        -webkit-overflow-scrolling: touch;
                        scroll-snap-type: x mandatory;
                      }
                      .overflow-x-auto > div {
                        scroll-snap-align: start;
                      }
                    }
                  `}</style>
                </div>
              </div>
            </div>
          </div>
        
      </section>

      {/* Projects Grid - Enhanced responsive grid and spacing */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory + searchTerm + currentPage}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {currentProjects.map((project, index) => (
                <motion.div key={project._id} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-xl hover:text-admin-primary transition-all duration-300 group overflow-hidden border-0 shadow-lg flex flex-col">
                    <div className="aspect-video overflow-hidden relative flex-shrink-0">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover  group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 bg-admin-gradient text-white text-xs sm:text-sm"
                        >
                          {getCategoryIcon(project.category)}
                          <span className="hidden sm:inline">{project.category}</span>
                          <span className="sm:hidden">{project.category.slice(0, 10)}</span>
                        </Badge>
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          {project.year}
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 text-gray-900 transition-colors line-clamp-2">
                        {project.title}
                      </h3>

                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed line-clamp-3 flex-grow">
                        {project.shortDescription}
                      </p>

                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-xs sm:text-sm">
                        <div>
                          <span className="font-semibold text-gray-900">Client: </span>
                          <span className="text-gray-600">{project.client}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">Duration: </span>
                          <span className="text-gray-600">{project.duration}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                        {project.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tags.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Button Container - Fixed at bottom */}
                      <div className="mt-auto">
                        <Button
                          asChild
                          className="w-full bg-admin-gradient text-white group-hover:shadow-lg text-xs sm:text-sm h-8 sm:h-10"
                        >
                          <Link href={`/portfolio/${project.slug || createSlug(project.title)}`}>
                            <span className="hidden sm:inline">View Case Study</span>
                            <span className="sm:hidden">View Details</span>
                            <ExternalLink className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="mt-8 sm:mt-12 flex justify-center">
              <Pagination>
                <PaginationContent className="flex-wrap gap-1 sm:gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#projects"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) {
                          setCurrentPage(currentPage - 1)
                          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
                        }
                      }}
                      className={`text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4 ${
                        currentPage === 1 ? "pointer-events-none opacity-50" : ""
                      }`}
                    />
                  </PaginationItem>

                  {/* Show first page */}
                  {currentPage > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          href="#projects"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(1)
                            document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
                          }}
                          className="text-xs sm:text-sm h-8 sm:h-10 w-8 sm:w-10"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {currentPage > 4 && (
                        <PaginationItem>
                          <PaginationEllipsis className="h-8 sm:h-10 w-8 sm:w-10" />
                        </PaginationItem>
                      )}
                    </>
                  )}

                  {/* Show pages around current page */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === currentPage ||
                        page === currentPage - 1 ||
                        page === currentPage + 1 ||
                        (currentPage <= 2 && page <= 3) ||
                        (currentPage >= totalPages - 1 && page >= totalPages - 2),
                    )
                    .map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#projects"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page)
                            document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
                          }}
                          isActive={currentPage === page}
                          className="text-xs sm:text-sm h-8 sm:h-10 w-8 sm:w-10"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                  {/* Show last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <PaginationItem>
                          <PaginationEllipsis className="h-8 sm:h-10 w-8 sm:w-10" />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          href="#projects"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(totalPages)
                            document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
                          }}
                          className="text-xs sm:text-sm h-8 sm:h-10 w-8 sm:w-10"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#projects"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) {
                          setCurrentPage(currentPage + 1)
                          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
                        }
                      }}
                      className={`text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4 ${
                        currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                      }`}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {filteredProjects.length === 0 && (
            <motion.div className="text-center py-12 sm:py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-sm sm:text-base text-gray-600 px-4">
                Try adjusting your search criteria or category filter.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Learn More / Footer Section - Enhanced responsive design */}
      <section className="py-12 sm:py-16 md:py-20 bg-white border-t">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
                Ready to Start Your Project?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
                Let's discuss how our engineering expertise can help bring your vision to life. From concept to
                completion, we're here to deliver exceptional results.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-admin-gradient text-white hover:shadow-lg px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
                >
                  <Link href="/contact">
                    Get Started Today
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gray-300 hover:bg-gray-50 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto bg-transparent"
                >
                  <Link href="/services">
                    <span className="hidden sm:inline">Learn More About Our Services</span>
                    <span className="sm:hidden">Our Services</span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
