
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { DetailPortfolio } from "@/components/portfolio/DetailPortfolio"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: { title: string }
} 

// Dynamic SEO metadata will be handled by the SEO provider
export const metadata = {
  title: "Portfolio Details | Filigree Solutions",
  description: "Detailed case study of our engineering project with comprehensive analysis and results.",
  keywords: "engineering project, case study, structural analysis, portfolio details",
}

async function getPortfolioItemData(titleSlug: string) {
  // Construct the full URL for server-side requests
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : `${process.env.APP_URL}`;

  try {
    const response = await fetch(`${baseUrl}/api/admin/portfolio/${titleSlug}`, {
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
      return { portfolioItem: data.data };
    } else {
      return { portfolioItem: null };
    }
  } catch (error) {
    console.error("Error fetching portfolio item data:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch portfolio item data"
    );
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  try {
    const initialData = await getPortfolioItemData(params.title);

    if (!initialData.portfolioItem) {
      notFound();
    }

    return (
      <div className="min-h-screen">
        <Navbar />
        <DetailPortfolio portfolioItem={initialData.portfolioItem} />
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
              Unable to load portfolio item data. Please try again later.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
