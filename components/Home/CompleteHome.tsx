"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useMemo } from "react"

import { ArrowRight, Users, Award, Target, Sparkles, Rocket, Clock, User } from "lucide-react"

import { useQuotation } from "@/components/quotation-provider"
import { useSEOMeta } from "@/hooks/use-seo-meta"
import { Services } from "@/components/Home/service/Services"
import { Testimonials } from "@/components/Home/Testimonial"

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

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6 },
}

interface Service {
  _id: string
  title: string
  shortDescription: string
  features: string[]
  image: string
  status: string
  featured: boolean
}

interface Testimonial {
  _id: string
  name: string
  location: string
  avatar: string
  content: string
  rating: number
  servicesType: string
  status: string
}

interface CompleteHomeProps {
  services: Service[]
  testimonials: Testimonial[]
}

export default function CompleteHome({ services, testimonials }: CompleteHomeProps) {
  const { openQuotationForm } = useQuotation()

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
  

  // Use SEO data for home page
  useSEOMeta({
    pageId: "home",
    fallback: {
      title: "Filigree Solutions - Advanced CAD & CAE Services | Engineering Excellence",
      description:
        "Leading provider of CAD, CAE, structural analysis, and engineering simulation services across India. Expert solutions for automotive, telecom, and industrial sectors.",
      keywords:
        "CAD services, CAE analysis, structural analysis, 3D modeling, engineering simulation, FEA, automotive engineering, telecom analysis",
    },
  })

  const stats = [
    {
      number: "500+",
      label: "Projects Completed",
      icon: <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
    },
    {
      number: "50+",
      label: "Happy Clients",
      icon: <Users className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
    },
    {
      number: "5+",
      label: "Years Experience",
      icon: <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
    },
    {
      number: "99%",
      label: "Client Satisfaction",
      icon: <Target className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />,
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="relative  flex items-center justify-center overflow-hidden">
        {/* Multi-layered Animated Background */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-admin-gradient"></div>

          {/* Animated overlay gradients */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-transparent to-purple-600/30"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute inset-0 bg-gradient-to-bl from-purple-500/20 via-transparent to-blue-500/20"
            animate={{
              opacity: [0.7, 0.3, 0.7],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="absolute inset-0 overflow-hidden">
          {/* Large floating orbs - responsive sizing */}
          <motion.div
            className="absolute top-10 left-4 sm:top-20 sm:left-20 w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-r from-white/10 to-blue-300/20 rounded-full blur-xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-10 right-4 sm:bottom-20 sm:right-20 w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 bg-gradient-to-r from-purple-300/20 to-white/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-r from-yellow-300/20 to-pink-300/20 rounded-full blur-xl"
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-white/20 rounded-full"
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 12}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-3 py-8 sm:px-4 sm:py-12 md:py-16 lg:py-20 relative z-10">
          <motion.div
            className="max-w-5xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <Badge className="mb-4 sm:mb-6 md:mb-8 hover:bg-admin-secondary bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1.5 sm:px-6 sm:py-2 md:px-8 md:py-3 text-xs sm:text-sm md:text-base rounded-full shadow-lg">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-2 sm:mr-3" />
                </motion.div>
                About Filigree Solutions
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight">
                <motion.span
                  className="block"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Engineering
                </motion.span>
                <motion.span
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Excellence
                </motion.span>
              </h1>
            </motion.div>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-4 sm:mb-6 text-white/90 font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              Since 2019
            </motion.p>

            <motion.p
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-8 sm:mb-10 md:mb-12 text-white/80 max-w-4xl mx-auto leading-relaxed px-2 sm:px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              Discover the story behind our commitment to delivering world-class CAD and CAE solutions that drive
              innovation and success across industries throughout India.
            </motion.p>

            <motion.div
              className="flex flex-grid-cols-2 sm:flex-row gap-4 sm:gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  onClick={openQuotationForm}
                  size="lg"
                  className="w-full sm:w-auto bg-admin-gradient text-white border-0 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg font-semibold transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
                >
                  Get Started
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.div>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg font-semibold bg-transparent backdrop-blur-sm shadow-2xl hover:shadow-white/10"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="hidden sm:flex w-6 h-10 border-2 border-white/30 rounded-full justify-center">
            <motion.div
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        </motion.div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white relative">
        
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 h-full">
                  <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8 text-center">
                    <motion.div
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 md:mb-6 bg-admin-gradient rounded-full flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-white">{stat.icon}</div>
                    </motion.div>
                    <motion.div
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-admin-gradient bg-clip-text text-transparent mb-1 sm:mb-2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium leading-tight">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
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

        
        
        <div className="container mx-auto px-3 sm:px-4 md:px-6 relative">
          
          <motion.div
            className="max-w-4xl mx-auto text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Badge className="mb-4 sm:mb-6 bg-admin-gradient text-white px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Since 2019
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8">
              Engineering Excellence
              <span className="block bg-white bg-clip-text text-transparent">Since 2019</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white leading-relaxed px-2 sm:px-4">
              Filigree Solutions is a leading provider of advanced CAD and CAE services, specializing in precision
              engineering solutions that drive innovation across industries with cutting-edge technology and expert
              knowledge.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Target className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />,
                title: "Our Mission",
                description:
                  "To empower industries with innovative engineering solutions that enhance efficiency, reduce costs, and accelerate time-to-market through precision and excellence.",
                gradient: "from-blue-600 to-purple-600",
              },
              {
                icon: <Award className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />,
                title: "Our Vision",
                description:
                  "To be the most trusted partner for engineering services, recognized globally for our technical excellence, innovation, and unwavering commitment to client success.",
                gradient: "from-purple-600 to-pink-600",
              },
              {
                icon: <Users className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />,
                title: "Our Values",
                description:
                  "Quality, integrity, innovation, and customer satisfaction are the core values that guide everything we do, ensuring exceptional results in every project.",
                gradient: "from-green-600 to-teal-600",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="md:col-span-2 lg:col-span-1 md:last:col-start-1 md:last:col-end-3 lg:last:col-start-auto lg:last:col-end-auto"
              >
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-4 sm:p-6 md:p-8 text-center relative">
                    <motion.div
                      className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br ${item.gradient} rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-white">{item.icon}</div>
                    </motion.div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Services services={services} />
      <Testimonials testimonials={testimonials} />

      <section className="py-12 sm:py-16 md:py-20 lg:py-24  relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-6 left-6 sm:top-10 sm:left-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white/10 rounded-full blur-xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          />
          <motion.div
            className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white/10 rounded-full blur-xl"
            animate={{ scale: [1.3, 1, 1.3], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <div className="container mx-auto px-3 sm:px-4 md:px-6 text-center relative z-10">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <Badge className="mb-3 sm:mb-4 md:mb-6 bg-admin-secondary text-white border-white/30 backdrop-blur-sm px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 text-xs sm:text-sm md:text-base">
              <Rocket className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Ready to Start?
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 text-admin-primary">
              Transform Your Engineering
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Projects Today
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 text-admin-secondary max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
              Let's discuss how our expertise can help you achieve your engineering goals. Get in touch with our expert
              team and start your journey to excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  onClick={openQuotationForm}
                  size="lg"
                  className="w-full sm:w-auto bg-admin-primary text-white hover:bg-admin-gradient px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  Get Free Consultation <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 bg-admin-secondary text-white hover:bg-admin-gradient px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold backdrop-blur-sm"
                >
                  <Link href="/portfolio">View Our Work</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
