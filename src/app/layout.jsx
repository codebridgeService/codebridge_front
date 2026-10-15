import './globals.css';
import TechBackground from '@/components/TechBackground';
import ScrollToTop from '@/components/ScrollToTop';
import FloatingContact from '@/components/FloatingContact';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: 'CodeBridges',
  description: 'We build websites, apps & systems for businesses.',
  icons: {
    icon: [
      { url: '/logo/Codebridge.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/logo/Codebridge.svg',
    apple: '/logo/Codebridge.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo/Codebridge.svg" />
      </head>
      <body className="bg-[color:var(--bg-main)] text-[color:var(--text-main)] min-h-screen flex flex-col antialiased transition-colors duration-300 relative overflow-x-hidden" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            {/* Global Interactive Tech Background (Light Mode by default) */}
            <TechBackground />
            <div className="relative z-10 flex-1 flex flex-col">
              <main className="flex-1">
                {children}
              </main>
              <FloatingContact />
              <ScrollToTop />
            </div>
            <SpeedInsights/>
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}