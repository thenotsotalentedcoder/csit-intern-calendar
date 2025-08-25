import type { Metadata } from "next";
import { Inter, Outfit, Space_Grotesk, IBM_Plex_Mono, Urbanist } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Modern sans-serif for UI
const outfit = Outfit({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans" 
});

// Modern geometric font for headings  
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display" 
});

// Ultra modern display font
const urbanist = Urbanist({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-heading" 
});

// Modern monospace
const ibmPlexMono = IBM_Plex_Mono({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono" 
});

export const metadata: Metadata = {
  title: "Intern Calendar - NED University",
  description: "Sleek intern scheduling calendar for NED University admins to view intern availability",
  keywords: ["intern", "calendar", "scheduling", "NED University", "availability"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} ${urbanist.variable} ${ibmPlexMono.variable} font-sans min-h-screen bg-background antialiased`}>
        {children}
      </body>
    </html>
  );
}