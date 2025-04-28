import { Bebas_Neue, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  display: 'swap',
  weight: '400',
});

const roboto = Roboto({
  subsets: ["latin"],
  display: 'swap',
  weight: '700',
});

export const metadata = {
  metadataBase: new URL('https://chalacofilms.com'),
  title: "Chalaco Films | Productora Audiovisual",
  description: "Somos una productora audiovisual de Guayaquil especializada en cine, publicidad, documentales y fotografía. Creamos contenido de alta calidad con un enfoque creativo y profesional.",
  keywords: "productora audiovisual, cine, publicidad, documentales, fotografía, producción de video, Ecuador, Guayaquil, Chalaco Films",
  authors: [{ name: "Chalaco Films" }],
  creator: "Chalaco Films",
  publisher: "Chalaco Films",
  openGraph: {
    title: "Chalaco Films | Productora Audiovisual en Guayaquil, Ecuador",
    description: "Somos una productora audiovisual de Guayaquil especializada en cine, publicidad, documentales y fotografía. Creamos contenido de alta calidad con un enfoque creativo y profesional.",
    url: "https://chalacofilms.com",
    siteName: "Chalaco Films",
    images: [
      {
        url: "/photos/logon.png",
        width: 800,
        height: 600,
        alt: "Chalaco Films Logo",
      },
    ],
    locale: "es_EC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chalaco Films | Productora Audiovisual en Guayaquil, Ecuador",
    description: "Somos una productora audiovisual de Guayaquil especializada en cine, publicidad, documentales y fotografía.",
    images: ["/photos/logob.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://chalacofilms.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased bg-white`}>
        {/* Aplicamos la fuente bebas solo al contenedor principal, permitiendo usar roboto en párrafos */}
        <div className={`${bebas.className} flex flex-col min-h-screen relative`}>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}