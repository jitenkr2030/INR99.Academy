import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { NewNavigation } from "@/components/new-navigation";
import { Footer } from "@/components/footer";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "INR99 Academy | White-Label Online Academy Platform at ₹99/Month",
  description: "INR99 Academy helps teachers and institutes launch their own branded online academy with live classes, student dashboard, courses, and payments at ₹99 per student/month.",
  keywords: ["INR99 Academy", "white-label LMS", "online academy platform", "education software", "learning management system", "coaching institute software", "school management software", "launch online academy", "branded learning platform", "affordable LMS India", "₹99 education platform"],
  authors: [{ name: "INR99.Academy Team" }],
  openGraph: {
    title: "INR99 Academy | White-Label Online Academy Platform at ₹99/Month",
    description: "INR99 Academy helps teachers and institutes launch their own branded online academy with live classes, student dashboard, courses, and payments at ₹99 per student/month.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "INR99 Academy | White-Label Online Academy Platform at ₹99/Month",
    description: "INR99 Academy helps teachers and institutes launch their own branded online academy with live classes, student dashboard, courses, and payments at ₹99 per student/month.",
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

// CSS loading script to prevent FOUC and ensure proper rendering
const cssLoadScript = `
  (function() {
    function ready(fn) {
      if (document.readyState !== 'loading') {
        fn();
      } else {
        document.addEventListener('DOMContentLoaded', fn);
      }
    }
    ready(function() {
      document.body.classList.add('css-loaded');
    });
  })();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session on server to pass to client-side SessionProvider
  // This eliminates client-side session checking and prevents blinking
  const session = await auth()

  // Organization Schema for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "INR99 Academy",
    "url": "https://inr99.academy",
    "logo": "https://inr99.academy/logo.png",
    "description": "White-label online education platform for teachers and institutes at ₹99 per student per month",
    "foundingCountry": "IN",
    "sameAs": [
      "https://github.com/jitenkr2030"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: cssLoadScript,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
          type="application/ld+json"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        <Providers session={session}>
          <NewNavigation />
          <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
