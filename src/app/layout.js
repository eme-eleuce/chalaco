import { Bebas_Neue, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  display: 'swap',
  weight: '400',
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '700'],
  variable: '--font-source-sans',
});

const siteUrl = 'https://www.chalacofilms.com';
const siteName = 'Chalaco Films';
const defaultTitle = 'Chalaco Films | Productora Audiovisual en Guayaquil';
const defaultDescription =
  'Productora audiovisual en Guayaquil, Ecuador. Cine, publicidad, documentales, fotografía, livestream, postproducción y contenido digital con enfoque creativo y profesional.';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: '%s | Chalaco Films',
  },
  description: defaultDescription,
  keywords: [
    'productora audiovisual',
    'Chalaco Films',
    'Guayaquil',
    'Ecuador',
    'producción de video',
    'publicidad',
    'cine',
    'documentales',
    'fotografía',
    'videoclips',
    'livestream',
    'postproducción',
    'VFX',
    'contenido digital',
  ],
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: 'productora audiovisual',
  alternates: {
    canonical: '/',
    languages: {
      'es-EC': '/',
      es: '/',
    },
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    type: 'website',
    locale: 'es_EC',
    url: siteUrl,
    siteName,
    images: [
      {
        url: '/photos/logob.png',
        width: 1200,
        height: 630,
        alt: 'Chalaco Films — Productora Audiovisual',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    creator: '@chalacofilms',
    images: [
      {
        url: '/photos/logob.png',
        alt: 'Chalaco Films — Productora Audiovisual',
      },
    ],
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
  other: {
    'geo.region': 'EC-G',
    'geo.placename': 'Guayaquil',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/photos/logob.png`,
      },
      email: 'info@chalacofilms.com',
      sameAs: ['https://www.instagram.com/chalacofilms/'],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Guayaquil',
        addressRegion: 'Guayas',
        addressCountry: 'EC',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: defaultDescription,
      inLanguage: 'es-EC',
      publisher: { '@id': `${siteUrl}/#organization` },
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}/#business`,
      name: siteName,
      image: `${siteUrl}/photos/logob.png`,
      url: siteUrl,
      email: 'info@chalacofilms.com',
      description: defaultDescription,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Guayaquil',
        addressRegion: 'Guayas',
        addressCountry: 'EC',
      },
      areaServed: [
        { '@type': 'City', name: 'Guayaquil' },
        { '@type': 'Country', name: 'Ecuador' },
      ],
      serviceType: [
        'Producción audiovisual',
        'Fotografía',
        'Livestream',
        'Postproducción y VFX',
        'Contenido digital',
        'Animación 3D',
        'Diseño sonoro',
        'Gestión de redes',
      ],
      parentOrganization: { '@id': `${siteUrl}/#organization` },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`antialiased bg-white`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Bebas = títulos; Source Sans 3 = textos (.roboto-font) */}
        <div className={`${bebas.className} ${sourceSans.variable} flex flex-col min-h-screen relative`}>
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
