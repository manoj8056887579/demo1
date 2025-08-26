"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useMemo } from "react";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

interface Testimonial {
  _id: string;
  name: string;
  location: string;
  avatar: string;
  content: string;
  rating: number;
  servicesType: string;
  status: string;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export const Testimonials = ({ testimonials = [] }: TestimonialsProps) => {
  // Filter to show only published testimonials
  const activeTestimonials = testimonials.filter(
    (testimonial) => testimonial.status === "published"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Generate static positions for particles to avoid hydration mismatch
  const particlePositions = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      top: (i * 37 + 23) % 100, // Deterministic positioning
      left: (i * 43 + 17) % 100,
      boxShadow: 6 + (i % 10),
      duration: 4 + (i % 4),
      delay: (i % 5),
    }));
  }, []);

  const constellationPositions = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      cx: (i * 47 + 31) % 1000,
      cy: (i * 53 + 19) % 800,
      r: 0.5 + (i % 4) * 0.5,
      duration: 3 + (i % 3),
      delay: (i % 4),
    }));
  }, []);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? activeTestimonials.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % activeTestimonials.length);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (activeTestimonials.length === 0 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % activeTestimonials.length
      );
    }, 4000); // Change testimonial every 4 seconds

    return () => clearInterval(interval);
  }, [activeTestimonials.length, isAutoPlaying]);

  // Simplified responsive scroll calculations
  const getScrollDistance = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      if (width < 640) return 300; // Mobile: full card width + gap
      if (width < 1024) return 340; // Tablet: card width + gap
      return 360; // Desktop: card width + gap
    }
    return 360; // Default for SSR
  };

  if (activeTestimonials.length === 0) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        {/* Aurora Borealis Theme Background */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-admin-gradient"></div>
          
          {/* Aurora lights */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-cyan-300/30 to-purple-400/20"
            animate={{
              opacity: [0.3, 0.8, 0.4, 0.9, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-l from-pink-400/25 via-transparent to-green-400/25"
            animate={{
              opacity: [0.6, 0.2, 0.7, 0.3, 0.6],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
        
        <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
          <div className="text-center">
            <p className="text-gray-300 text-sm sm:text-base">
              No testimonials available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      {/* Aurora Borealis Theme Background */}
      <div className="absolute inset-0">
        {/* Dark sky base */}
        <div className="absolute inset-0 bg-admin-gradient"></div>
        
        {/* Aurora light waves */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-300/20 via-cyan-400/30 to-purple-400/20"
          animate={{
            opacity: [0.3, 0.8, 0.4, 0.9, 0.3],
            background: [
              "linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(34, 197, 94, 0.3), rgba(168, 85, 247, 0.2))",
              "linear-gradient(to right, rgba(34, 197, 94, 0.3), rgba(59, 130, 246, 0.4), rgba(236, 72, 153, 0.2))",
              "linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(168, 85, 247, 0.3), rgba(16, 185, 129, 0.3))",
              "linear-gradient(to right, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.2), rgba(34, 197, 94, 0.4))",
              "linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(34, 197, 94, 0.3), rgba(168, 85, 247, 0.2))",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-l from-pink-300/25 via-transparent to-green-300/25"
          animate={{
            opacity: [0.6, 0.2, 0.7, 0.3, 0.6],
            background: [
              "linear-gradient(to left, rgba(249, 168, 212, 0.25), transparent, rgba(134, 239, 172, 0.25))",
              "linear-gradient(to left, rgba(196, 181, 253, 0.3), transparent, rgba(125, 211, 252, 0.25))",
              "linear-gradient(to left, rgba(125, 211, 252, 0.25), transparent, rgba(249, 168, 212, 0.3))",
              "linear-gradient(to left, rgba(134, 239, 172, 0.3), transparent, rgba(196, 181, 253, 0.25))",
              "linear-gradient(to left, rgba(249, 168, 212, 0.25), transparent, rgba(134, 239, 172, 0.25))",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        
        {/* Shimmering particles */}
        {particlePositions.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              boxShadow: `0 0 ${particle.boxShadow}px rgba(255,255,255,0.8)`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.5, 0.5],
              y: [0, -30, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
        
        {/* Floating aurora ribbons */}
        <motion.div
          className="absolute top-1/4 left-0 w-full h-32 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent blur-sm"
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-0 w-full h-24 bg-gradient-to-l from-transparent via-emerald-300/15 to-transparent blur-sm"
          animate={{
            x: ['100%', '-100%'],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 5,
          }}
        />
        
        {/* Constellation dots */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1000 800">
          {constellationPositions.map((star, i) => (
            <motion.circle
              key={i}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="white"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: star.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: star.delay,
              }}
            />
          ))}
        </svg>
        
        {/* Glowing orbs */}
        <motion.div
          className="absolute top-20 right-20 w-40 h-40 bg-gradient-radial from-cyan-300/30 via-blue-400/20 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.8, 0.4],
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-32 left-16 w-32 h-32 bg-gradient-radial from-emerald-300/25 via-green-400/15 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.7, 0.3],
            x: [0, -15, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-12 sm:mb-16 md:mb-20"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm backdrop-blur-sm">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8 px-2">
            What Our Clients
            <span className="block bg-gradient-to-r from-cyan-300 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
              Say About Us
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 px-2">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </motion.div>

        {/* Testimonials container with navigation arrows */}
        <div className="relative overflow-hidden w-full p-3">
          {/* Previous Arrow */}
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border-white/20 shadow-lg hover:bg-white/20 hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </Button>

          {/* Next Arrow */}
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border-white/20 shadow-lg hover:bg-white/20 hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </Button>

          {/* Testimonials slider */}
          <motion.div
            className="flex gap-6"
            animate={{
              x: -currentIndex * getScrollDistance(),
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          >
            {/* Duplicate testimonials for seamless loop */}
            {[...activeTestimonials, ...activeTestimonials].map(
              (testimonial, index) => (
                <motion.div
                  key={`${testimonial._id}-${index}`}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[340px]"
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg h-full bg-white/10 backdrop-blur-md border border-white/20">
                    <CardContent className="p-6">
                      {/* Star Rating */}
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>

                      {/* Testimonial Content */}
                      <p className="text-gray-200 mb-6 italic leading-relaxed text-sm sm:text-base line-clamp-4">
                        "{testimonial.content}"
                      </p>

                      {/* Author Info */}
                      <div className="flex items-center">
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full mr-3 border-2 border-white/30 object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-white text-sm sm:text-base">
                            {testimonial.name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-300">
                            {testimonial.location}
                          </div>
                          <div className="text-xs bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent font-medium">
                            {testimonial.servicesType}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};