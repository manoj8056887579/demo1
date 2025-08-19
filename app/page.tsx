// app/page.tsx
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CompleteHome from "@/components/Home/CompleteHome";
import { HomeSeo } from "@/components/Home/HomeSeo";

// Server-side data fetching functions
async function getServicesData() {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/admin/services`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data
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
      : process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/admin/testimonial`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data
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
      <HomeSeo />
      <Navbar />
      <CompleteHome services={services} testimonials={testimonials} />
      <Footer />
    </div>
  );
}
