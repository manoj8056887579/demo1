"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Target,
  Lightbulb,
  TrendingUp,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSEOMeta } from "@/hooks/use-seo-meta";
import { useState } from "react";
import "@/styles/prose.css";

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

interface KeyMetric {
  label: string;
  value: string;
}

interface PortfolioItem {
  _id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  challenges: string;
  solution: string;
  results: string;
  client: string;
  duration: string;
  year: string;
  technologies: string[];
  image: string;
  gallery: string[];
  tags: string[];
  methodology: string[];
  keyMetrics: KeyMetric[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  createdAt: string;
  updatedAt: string;
}

interface DetailPortfolioProps {
  portfolioItem: PortfolioItem;
}

export const DetailPortfolio = ({ portfolioItem }: DetailPortfolioProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);

  // Use SEO meta for the portfolio item
 useSEOMeta({
    pageId: `portfolio-${portfolioItem._id}`,
    fallback: {
      title: portfolioItem.seoTitle,
      description: portfolioItem.seoDescription,
      keywords: portfolioItem.seoKeywords,
    },
  });

  
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 bg-admin-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
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
            className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl"
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

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="gap-4 flex items-center mb-6">
              <Button
                asChild
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 mb-6 bg-transparent"
              >
                <Link href="/portfolio">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portfolio
                </Link>
              </Button>

              <Badge className="mb-4 hover:bg-admin-secondary bg-white/20 text-white border-white/30 backdrop-blur-sm roun px-4 py-2">
                {portfolioItem.category}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {portfolioItem.title}
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              {portfolioItem.shortDescription}
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>Client: {portfolioItem.client}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>Duration: {portfolioItem.duration}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Year: {portfolioItem.year}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <img
                src={portfolioItem.image || "/placeholder.svg"}
                alt={portfolioItem.title}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Project
                <span className="block text-transparent bg-clip-text bg-admin-gradient">
                  Overview
                </span>
              </h2>
              <div 
                className="text-lg text-gray-600 mb-8 leading-relaxed prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: portfolioItem.fullDescription }}
              />

             

              <div className="flex flex-wrap gap-3">
                {portfolioItem.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenge, Solution, Results */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 text-center">
                    Challenge
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {portfolioItem.challenges}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lightbulb className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 text-center">
                    Solution
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {portfolioItem.solution}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900 text-center">
                    Results
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {portfolioItem.results}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Key
              <span className="text-transparent bg-clip-text bg-admin-gradient">
                {" "}
                Metrics
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable outcomes that demonstrate the success of our
              engineering solutions
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {portfolioItem.keyMetrics.map((metric, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-admin-gradient mb-2">
                      {metric.value}
                    </div>
                    <div className="text-gray-600 font-medium text-sm">
                      {metric.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Our
                <span className="block text-transparent bg-clip-text bg-admin-gradient">
                  Methodology
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our systematic approach ensures comprehensive analysis and
                optimal results for every project phase.
              </p>

              <div className="space-y-4">
                {portfolioItem.methodology.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 bg-admin-gradient rounded-full flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                      <span className="text-white font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

              {/* Technologies */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="card-hover h-full shadow-xl border-0">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-admin-primary">
                    Technologies Used
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {portfolioItem.technologies.map((tech, index) => (
                      <div
                        key={index}
                        className="text-center p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg sm:rounded-xl"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-admin-gradient rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                          <Star className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base">
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Project &nbsp;
              <span className=" text-transparent bg-clip-text bg-admin-gradient">
                Gallery
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A visual journey through the project phases and key moments.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {portfolioItem.gallery.map((image, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="cursor-pointer"
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg shadow-lg hover:opacity-90 transition-opacity"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Image Modal */}
          {currentImageIndex !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <button
                  className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
                  onClick={() => setCurrentImageIndex(null)}
                >
                  <X className="w-8 h-8" />
                </button>
                
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentImageIndex(prev => Math.max(0, prev! - 1))}
                  disabled={currentImageIndex === 0}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                <img
                  src={portfolioItem.gallery[currentImageIndex]}
                  alt={`Gallery image ${currentImageIndex + 1}`}
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                />

                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentImageIndex(prev => Math.min(portfolioItem.gallery.length - 1, prev! + 1))}
                  disabled={currentImageIndex === portfolioItem.gallery.length - 1}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
