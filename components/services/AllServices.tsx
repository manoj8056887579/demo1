"use client";
import React from "react";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Cog,
  BarChart3,
  Zap,
  Settings,
  Target, 
  Activity,
  Sparkles,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PaginatedServices } from "./PaginatedServices";

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

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6 },
};

interface Service {
  _id: string;
  title: string;
  shortDescription: string;
  features: string[];
  applications: string[];
  image: string;
  status: string;
  featured: boolean;
}

interface AllServicesProps {
  services: Service[];
}



const processSteps = [
  {
    step: "01",
    title: "Requirements Analysis",
    description:
      "Understanding your project needs and technical specifications with detailed consultation",
    icon: <Target className="h-6 w-6" />,
  },
  {
    step: "02",
    title: "Solution Design",
    description:
      "Developing tailored engineering solutions and methodologies based on your requirements",
    icon: <Settings className="h-6 w-6" />,
  },
  {
    step: "03",
    title: "Implementation",
    description:
      "Executing the project with precision, quality control, and regular progress updates",
    icon: <Cog className="h-6 w-6" />,
  },
  {
    step: "04",
    title: "Delivery & Support",
    description:
      "Final delivery with comprehensive documentation and ongoing technical support",
    icon: <CheckCircle className="h-6 w-6" />,
  },
];

export const AllServices = ({ services }: AllServicesProps) => {

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-admin-gradient"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-5 left-5 sm:top-10 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl"
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
            className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-xl"
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

        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-3 sm:mb-4 hover:bg-admin-secondary bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Our Services
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-4xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              Comprehensive Engineering Solutions
              
            </h1>
            <p className="text-sm sm:text-base md:text-sm lg:text-sm mb-6 sm:mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed px-2">
              From concept to completion, we provide end-to-end CAD and CAE
              services tailored to your specific industry requirements with
              cutting-edge technology and expertise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section with Pagination */}
      <PaginatedServices initialServices={services} />

      {/* Process Section */}
      <section className="  bg-white relative">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-12 sm:mb-16 md:mb-20"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Badge className="mb-4 sm:mb-6 bg-admin-gradient text-white px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Our Process
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 leading-tight px-2">
              How We Deliver
              <span className="block text-transparent bg-clip-text bg-admin-gradient to-pink-600">
                Excellence
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-sm lg:text-sm text-gray-600 max-w-3xl mx-auto px-2 leading-relaxed">
              A systematic approach to delivering exceptional engineering
              solutions with precision and quality
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {processSteps.map((process, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="card-hover text-center h-full shadow-xl border-0">
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-admin-gradient rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                      <span className="text-white font-bold text-sm sm:text-base md:text-lg">
                        {process.step}
                      </span>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <div className="text-blue-600 [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5 md:[&>svg]:w-6 md:[&>svg]:h-6">{process.icon}</div>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 leading-tight">
                      {process.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                      {process.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16 md:mb-20"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Badge className="mb-4 sm:mb-6 bg-admin-gradient   text-white px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Why Choose Us
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 leading-tight px-2">
              Why Our Services
              <span className="block text-transparent bg-clip-text bg-admin-gradient ">
                Stand Out
              </span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-7xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Cutting-Edge Technology",
                description:
                  "We use the latest CAD/CAE software and methodologies to deliver superior results.",
                icon: <Zap className="h-6 w-6" />,
                gradient: "from-blue-500 to-purple-600",
              },
              {
                title: "Expert Team",
                description:
                  "Our certified engineers have extensive experience across diverse industries.",
                icon: <Star className="h-6 w-6" />,
                gradient: "from-purple-500 to-pink-600",
              },
              {
                title: "Quality Assurance",
                description:
                  "Rigorous quality control processes ensure accuracy and reliability.",
                icon: <CheckCircle className="h-6 w-6" />,
                gradient: "from-green-500 to-teal-600",
              },
              {
                title: "Timely Delivery",
                description:
                  "We're committed to meeting deadlines without compromising quality.",
                icon: <Target className="h-6 w-6" />,
                gradient: "from-orange-500 to-red-600",
              },
              {
                title: "Cost-Effective Solutions",
                description:
                  "Competitive pricing with transparent costs and no hidden fees.",
                icon: <Activity className="h-6 w-6" />,
                gradient: "from-indigo-500 to-blue-600",
              },
              {
                title: "24/7 Support",
                description:
                  "Comprehensive support throughout the project lifecycle and beyond.",
                icon: <Settings className="h-6 w-6" />,
                gradient: "from-teal-500 to-green-600",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="card-hover h-full border-0 shadow-xl">
                  <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br ${item.gradient} rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg`}
                    >
                      <div className="text-white [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6">{item.icon}</div>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};
