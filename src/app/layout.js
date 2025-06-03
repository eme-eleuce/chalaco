import { Bebas_Neue, Noto_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  display: 'swap',
  weight: '400',
});

const roboto = Noto_Sans({
  subsets: ["latin"],
  display: 'swap',
  weight: '700',
});

export const metadata = {
  title: 'Chalaco Films | Productora Audiovisual',
  description: 'Somos una productora audiovisual de Guayaquil especializada en cine, publicidad, documentales y fotografía. Creamos contenido de alta calidad con un enfoque creativo y profesional.',
  keywords: 'productora audiovisual, cine, publicidad, documentales, fotografía, producción de video, Ecuador, Guayaquil, Chalaco Films, videoclips, livestream, post-producción',
  metadataBase: new URL('https://www.chalacofilms.com'),
  alternates: {
    canonical: '/',
    languages: {
      'es-EC': '/',
    },
  },
  openGraph: {
    title: 'Chalaco Films | Productora Audiovisual',
    description: 'Somos una productora audiovisual especializada en cine, publicidad, documentales y fotografía. Creamos contenido de alta calidad con un enfoque creativo y profesional.',
    type: 'website',
    locale: 'es_EC',
    url: '/',
    siteName: 'Chalaco Films | Productora Audiovisual',
    images: [
      {
        url: '/photos/logob.png',
        width: 1200,
        height: 630,
        alt: 'Chalaco Films | Productora Audiovisual',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chalaco Films | Productora Audiovisual',
    description: 'Somos una productora audiovisual especializada en cine, publicidad, documentales y fotografía.',
    creator: '@chalacofilms',
    images: [{
      url: '/photos/logob.png',
      alt: 'Chalaco Films | Productora Audiovisual',
    }],
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
  authors: [{ name: 'Chalaco Films' }],
  creator: 'Chalaco Films',
  publisher: 'Chalaco Films',
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