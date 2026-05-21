import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VolleyClub Pro - Enterprise Volleyball Club Platform",
  description: "Advanced analytics, training rotations, and player monitoring system for professional volleyball teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased" dir="ltr">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Check local storage theme
                const storedTheme = localStorage.getItem('volleyclub-theme') || 'dark';
                const storedLang = localStorage.getItem('volleyclub-lang') || 'en';
                document.documentElement.className = storedTheme;
                document.documentElement.setAttribute('dir', storedLang === 'ar' ? 'rtl' : 'ltr');
                document.documentElement.setAttribute('lang', storedLang);
              } catch (_) {
                document.documentElement.className = 'dark';
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
