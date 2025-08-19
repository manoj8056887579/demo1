import axios from "axios"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AllServices } from "@/components/services/AllServices"
import { ServicesPageSEO } from "@/components/services/ServicesPageSEO"

// Dynamic SEO metadata will be handled by the SEO provider
export const metadata = {
  title: "Engineering Services - CAD, CAE, Structural Analysis | Filigree Solutions",
  description: "Comprehensive engineering services including CAD drafting, 3D modeling, structural analysis, EV component simulation, and telecom tower analysis.",
  keywords: "engineering services, CAD drafting, 3D modeling, structural analysis, EV simulation, telecom analysis, GD&T application",
}

async function getServicesData() {
  // Construct the full URL for server-side requests
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : `${process.env.APP_URL}`;

  try {
    // Frontend request - will automatically only get active services
    const response = await axios.get(`${baseUrl}/api/admin/services`, {
      params: {
        all: 'true',       // Get all without pagination
        isAdmin: 'false'   // This is a frontend request
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch services');
    }
    
    // Double check to ensure only active services are included
    const activeServices = response.data.data.filter(
      (service: any) => service.status === "active"
    );
    
    return { services: activeServices };
  } catch (error) {
    console.error("Error fetching services data:", error);
    throw new Error(
      (error as any).response?.data?.error || "Failed to fetch services data"
    );
  }
}

export default async function ServicesPage() {
  try {
    const initialData = await getServicesData();

    return (
      <div className="min-h-screen">
        <ServicesPageSEO />
        <Navbar />
        <AllServices services={initialData.services} />
        <Footer />
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="min-h-[calc(100vh-64px-80px)] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600">
              Unable to load services data. Please try again later.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}