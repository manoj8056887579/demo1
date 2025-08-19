"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle, 
  ArrowLeft, 
  Star,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { useSEOMeta } from "@/hooks/use-seo-meta";
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

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface Service {
  _id: string;
  title: string;
  heading: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  applications: string[];
  technologies: string[];
  image: string;
  gallery: string[];
  process: ProcessStep[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

interface DetailServicesProps {
  service: Service;
}

export const DetailServices = ({ service }: DetailServicesProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);

  // Use SEO meta for the service
  useSEOMeta({
    pageId: `service-${service._id}`,
    fallback: {
      title: service?.seoTitle || "Service Details | Filigree Solutions",
      description:
        service?.seoDescription || "Professional engineering services",
      keywords: service?.seoKeywords || "engineering services, CAD, CAE",
    },
  });

  useEffect(() => {
    // Update SEO meta tags dynamically
    if (typeof document !== "undefined" && service) {
      document.title =
        service.seoTitle || "Service Details | Filigree Solutions";

      const updateMetaTag = (
        name: string,
        content: string,
        attribute: string = "name"
      ) => {
        let metaTag = document.querySelector(`meta[${attribute}="${name}"]`);

        if (!metaTag) {
          metaTag = document.createElement("meta");
          metaTag.setAttribute(attribute, name);
          document.head.appendChild(metaTag);
        }

        metaTag.setAttribute("content", content);
      };

      updateMetaTag("description", service.seoDescription);
      updateMetaTag("keywords", service.seoKeywords);
      updateMetaTag("og:title", service.seoTitle, "property");
      updateMetaTag("og:description", service.seoDescription, "property");
      updateMetaTag("twitter:title", service.seoTitle);
      updateMetaTag("twitter:description", service.seoDescription);
    }
  }, [service]);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-admin-gradient py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 left-10 sm:top-20 sm:left-20 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Button
              asChild
              variant="outline"
              className="glass border-white/30 text-white hover:bg-white/10 mb-4 sm:mb-6 bg-transparent text-sm sm:text-base"
            >
              <Link href="/services">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Back to Services
              </Link>
            </Button>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 px-2 leading-tight">
              {service.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto px-2">
              {service.shortDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              
            >
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl sm:rounded-2xl shadow-2xl"
              />
             
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-admin-primary mb-4 sm:mb-6 px-2 sm:px-0">
                {service.heading}
              </h2>
              <div 
                className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0 prose prose-sm sm:prose-base max-w-none"
                dangerouslySetInnerHTML={{ __html: service.fullDescription }}
              />

             

              <div className="px-2 sm:px-0">
                <Button
                  asChild
                  className="bg-admin-gradient text-white border-0 w-full sm:w-auto text-sm sm:text-base"
                >
                  <Link href="/contact">
                    Get Started{" "}
                    <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features & Technologies */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              Features &
              <span className=" text-admin-primary "> Technologies</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Features */}
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <Card className="card-hover h-full shadow-xl border-0">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-admin-primary">
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {service.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl"
                      >
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                        <span className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
                    {service.technologies.map((tech, index) => (
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

      {/* Process */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8 sm:mb-12 md:mb-16" 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 px-2">
              Our
              <span className="text-admin-primary"> Process</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2 leading-relaxed">
              A systematic approach to delivering exceptional results
            </p>
          </motion.div>

          {/* Mobile: Single column with full width cards */}
          <div className="block sm:hidden">
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {service.process.map((step, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="card-hover shadow-lg border-0 bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-admin-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {step.step}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs xs:text-sm sm:text-base font-semibold mb-1 xs:mb-2 text-gray-900 leading-tight">
                            {step.title}
                          </h3>
                          <p className="text-xs xs:text-sm text-justify text-gray-600 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Tablet and Desktop: Grid layout */}
          <div className="hidden sm:block">
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {service.process.map((step, index) => (
                <motion.div key={index} variants={fadeInUp} className="h-full">
                  <Card className="card-hover text-center shadow-xl border-0 h-full">
                    <CardContent className="p-4 sm:p-6 md:p-8 h-full flex flex-col">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-admin-gradient rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <span className="text-white font-bold text-sm sm:text-base md:text-lg">
                          {step.step}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm md:text-base text-gray-600 flex-grow leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              Project
              <span className="text-admin-primary"> Gallery</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {service.gallery.map((image, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                onClick={() => setCurrentImageIndex(index)}
                className="cursor-pointer"
              >
                <div className="card-hover overflow-hidden rounded-xl sm:rounded-2xl shadow-xl">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Image Modal */}
          {currentImageIndex !== null && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
              onClick={() => setCurrentImageIndex(null)}
            >
              <div 
                className="relative w-full h-full flex items-center justify-center p-4"
                onClick={(e) => e.stopPropagation()}
              >
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
                  src={service.gallery[currentImageIndex]}
                  alt={`Gallery image ${currentImageIndex + 1}`}
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                />

                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentImageIndex(prev => Math.min(service.gallery.length - 1, prev! + 1))}
                  disabled={currentImageIndex === service.gallery.length - 1}
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
