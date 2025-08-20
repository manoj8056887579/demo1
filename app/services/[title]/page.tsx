import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { DetailServices } from "@/components/services/DetailServices"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: { title: string }
} 

// Dynamic SEO metadata will be handled by the SEO provider
export const metadata = {
  title: "Service Details | Filigree Solutions",
  description: "Professional engineering services with cutting-edge technology and expertise.",
  keywords: "engineering services, CAD, CAE, structural analysis",
}

async function getServiceData(titleSlug: string) {
  // Construct the full URL for server-side requests
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : `${process.env.APP_URL}`;

  try {
    const response = await fetch(`${baseUrl}/api/admin/services/${titleSlug}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return { service: data.data };
    } else {
      return { service: null };
    }
  } catch (error) {
    console.error("Error fetching service data:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch services data"
    );
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  try {
    const initialData = await getServiceData(params.title);

    if (!initialData.service) {
      notFound();
    }

    return (
      <div className="min-h-screen">
        <Navbar />
        <DetailServices service={initialData.service} />
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
              Unable to load service data. Please try again later.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}