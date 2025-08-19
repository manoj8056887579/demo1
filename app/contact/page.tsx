import axios from "axios";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ContactPageSeo } from "@/components/Contact/ContactSeo";
import { Contact } from "@/components/Contact/Contact";

// Dynamic SEO metadata will be handled by the SEO provider
export const metadata = {
  title: "Contact Us - Engineering Solutions | Filigree Solutions",
  description:
    "Get in touch with our engineering experts for CAD, CAE, structural analysis, and comprehensive engineering solutions. Contact us today for your project needs.",
  keywords:
    "contact engineering services, CAD consultation, structural analysis inquiry, engineering support, project consultation",
};

async function getContactData() {
  // Construct the full URL for server-side requests
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : `${process.env.APP_URL}`;

  try {
    // Fetch services data
   const servicesResponse = await axios.get(`${baseUrl}/api/admin/services`, {
      params: {
        all: 'true',       // Get all without pagination
        isAdmin: 'false'   // This is a frontend request
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Filter only active services
    const activeServices = servicesResponse.data.data
      .filter((service: any) => service.status === "active")
      .map((service: any) => service.title);

    // Add "Other" option at the end
    const services = [...activeServices, "Other"];

    // Fetch contact information
    const contactResponse = await axios.get(`${baseUrl}/api/admin/contact`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const contactInfo = contactResponse.data.success ? contactResponse.data.data : {
      phone: "9158549166",
      email: "info@filigreesolutions.com",
      address: "88/153, East Street, Pandiyan Nagar",
      city: "South Madurai",
      state: "Tamil Nadu",
      pincode: "625006",
      country: "India",
      pageTitle: "Let's Discuss Your Engineering Needs",
      pageDescription: "Ready to transform your engineering challenges into innovative solutions? Contact our expert team today and start your journey to excellence.",
      officeTitle: "Visit Our Office in Madurai, Tamil Nadu",
      officeDescription: "Located in the heart of Madurai, our office is easily accessible and welcoming to all our clients"
    };

    return { services, contactInfo };
  } catch (error) {
    console.error("Error fetching contact data:", error);
    // Return fallback data if API fails
    return { 
      services: ["Other"],
      contactInfo: {
        phone: "9158549166",
        email: "info@filigreesolutions.com",
        address: "88/153, East Street, Pandiyan Nagar",
        city: "South Madurai",
        state: "Tamil Nadu",
        pincode: "625006",
        country: "India",
        pageTitle: "Let's Discuss Your Engineering Needs",
        pageDescription: "Ready to transform your engineering challenges into innovative solutions? Contact our expert team today and start your journey to excellence.",
        officeTitle: "Visit Our Office in Madurai, Tamil Nadu",
        officeDescription: "Located in the heart of Madurai, our office is easily accessible and welcoming to all our clients"
      }
    };
  }
}

export default async function ContactPage() {
  try {
    const initialData = await getContactData();

    return (
      <div className="min-h-screen">
        <ContactPageSeo />
        <Navbar />
        <Contact services={initialData.services} contactInfo={initialData.contactInfo} />
        <Footer />
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen">
        <ContactPageSeo />
        <Navbar />
        <Contact 
          services={["Other"]} 
          contactInfo={{
            phone: "9158549166",
            email: "info@filigreesolutions.com",
            address: "88/153, East Street, Pandiyan Nagar",
            city: "South Madurai",
            state: "Tamil Nadu",
            pincode: "625006",
            country: "India",
            pageTitle: "Let's Discuss Your Engineering Needs",
            pageDescription: "Ready to transform your engineering challenges into innovative solutions? Contact our expert team today and start your journey to excellence.",
            officeTitle: "Visit Our Office in Madurai, Tamil Nadu",
            officeDescription: "Located in the heart of Madurai, our office is easily accessible and welcoming to all our clients"
          }}
        />
        <Footer />
      </div>
    );
  }
}
