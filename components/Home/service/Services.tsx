"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { ArrowRight, CheckCircle, Cog, BarChart3, Zap } from "lucide-react";

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

interface Service {
  _id: string;
  title: string;
  shortDescription: string;
  features: string[];
  image: string;
  status: string;
  featured: boolean;
}

interface ServicesProps {
  services?: Service[];
}

export const Services = ({ services = [] }: ServicesProps) => {
  // Filter to show only featured services
  const featuredServices = services.filter(service => service.featured && service.status === 'active');

  // Function to create URL-friendly slug from service title
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  if (featuredServices.length === 0) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              No featured services available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <motion.div
          className="text-center mb-12 sm:mb-16 md:mb-20"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <Badge className="mb-4 sm:mb-6 bg-admin-gradient text-white px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm">
            <Cog className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Our Services
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 px-2">
            Core Engineering
            <span className="block bg-admin-gradient bg-clip-text text-transparent">
              Solutions
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto px-2">
            Comprehensive engineering solutions tailored to meet your specific
            requirements with cutting-edge technology and industry expertise.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10"
          variants={staggerContainer}
          initial="initial" 
          whileInView="animate"
          viewport={{ once: true }}
        >
          {featuredServices.map((service, index) => {
            return (
              <motion.div key={service._id} variants={fadeInUp} className="h-full">
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 h-full border-0 shadow-lg sm:shadow-xl overflow-hidden group flex flex-col">
                  {/* Service Image */}
                  <div className="aspect-video sm:aspect-video overflow-hidden relative flex-shrink-0">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col flex-grow">
                    {/* Content that grows */}
                    <div className="flex-grow">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 text-gray-900 group-hover:text-admin-primary transition-all duration-300 line-clamp-2">
                        {service.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed line-clamp-3">
                        {service.shortDescription}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-1 gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                        {service.features.slice(0, 4).map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-start text-xs sm:text-sm text-gray-600"
                          >
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1.5 sm:mr-2 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Button always at bottom */}
                    <div className="mt-auto">
                      <Button
                        asChild
                        className="w-full bg-admin-gradient transition-all duration-300 text-sm sm:text-base py-2 sm:py-2.5 hover:shadow-lg"
                      >
                        <Link href={`/services/${createSlug(service.title)}`}>
                          Learn More <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Explore Services Button */}
        <motion.div
          className="text-center mt-12 sm:mt-16"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              size="lg"
              className="bg-admin-gradient text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <Link href="/services">
                Explore All Services <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};