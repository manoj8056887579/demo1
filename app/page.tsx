// app/page.tsx
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CompleteHome from "@/components/Home/CompleteHome";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Filigree Solutions - Advanced CAD & CAE Services | Engineering Excellence',
  description: 'Leading provider of CAD, CAE, structural analysis, and engineering simulation services across India. Expert solutions for automotive, telecom, and industrial sectors.',
  keywords: 'CAD services, CAE analysis, structural analysis, 3D modeling, engineering simulation, FEA, automotive engineering, telecom analysis'
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Server-side data fetching functions
async function getServicesData() {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.APP_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/admin/services`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Filter for featured and active services
    const featuredServices =
      data.data?.filter(
        (service: any) =>
          service.status === "active" && service.featured === true
      ) || [];

    return { services: featuredServices };
  } catch (error) {
    console.error("Error fetching services data:", error);
    return { services: [] };
  }
}

async function getTestimonialsData() {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.APP_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/admin/testimonial`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Get all testimonials
    const testimonials = data.data || [];

    return { testimonials };
  } catch (error) {
    console.error("Error fetching testimonials data:", error);
    return { testimonials: [] };
  }
}

// Server Component (default)
export default async function HomePage() {
  // Fetch data on the server
  const [servicesResult, testimonialsResult] = await Promise.allSettled([
    getServicesData(),
    getTestimonialsData(),
  ]);

  const services =
    servicesResult.status === "fulfilled" ? servicesResult.value.services : [];
  const testimonials =
    testimonialsResult.status === "fulfilled"
      ? testimonialsResult.value.testimonials
      : [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <CompleteHome services={services} testimonials={testimonials} />
      <Footer />
    </div>
  );
}
