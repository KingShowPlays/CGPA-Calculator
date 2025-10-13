import Header from "@/components/Header";
import "./globals.css";
// import { Analytics } from "@vercel/analytics/next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "@/components/Footer";
import PageTransition from "@/components/TransitionTemplate";

export const metadata = {
  title: "CGPA Calculator - Fast & Accurate",
  description:
    "Easily calculate your GPA and CGPA across all semesters. This responsive CGPA calculator helps students track their academic performance with precision.",
  keywords:
    "cgpa calculator, gpa calculator, university result, student grade calculator, result tracker, academic performance",
  openGraph: {
    title: "CGPA Calculator - Fast & Accurate",
    description:
      "Calculate your CGPA in seconds with this easy-to-use online GPA calculator.",
    url: "https://cgpa-calculator-steel.vercel.app",
    type: "website",
    images: [
      {
        url: "https://cgpa-calculator-steel.vercel.app/images/three.avif",
        width: 1200,
        height: 630,
        alt: "CGPA Calculator Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CGPA Calculator - Fast & Accurate",
    description:
      "Instant GPA and CGPA calculator for students — quick, reliable, and easy to use.",
    images: ["https://cgpa-calculator-steel.vercel.app/images/three.avif"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <Analytics /> */}
        <ToastContainer />
        <Header />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
