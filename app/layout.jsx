import './globals.css';
import ScrollToTop from './components/ScrollToTop';
import FloatingContact from './components/FloatingContact';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: 'Codebridge', // Renamed
  description: 'We build websites, apps & systems for businesses.',
  icons: {
    icon: '/logo/Codebridgee.ico',
    apple: '/logo/Codebridgee.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[color:var(--bg-main)] text-[color:var(--text-main)] min-h-screen flex flex-col antialiased transition-colors duration-300" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <main>
              {children}
            </main>
            <FloatingContact />
            <ScrollToTop />
            <SpeedInsights/>
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}