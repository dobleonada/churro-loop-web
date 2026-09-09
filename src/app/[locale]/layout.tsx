import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import "../globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { routing } from "@/i18n/routing";
import { getImage } from "@/lib/media";
import { getHomePage } from "@/services/home/home.service";

/*
 * Placeholder families until the licensed brand fonts arrive (open point A4):
 * a high-contrast display serif for the logo/headlines and a geometric sans
 * for navigation, buttons and body copy. Swapping them means changing only
 * these two calls — every consumer reads the CSS variables via `@theme`.
 */
const displayFont = Cormorant_Garamond({
  variable: "--font-churro-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sansFont = Inter({
  variable: "--font-churro-sans",
  subsets: ["latin"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const home = await getHomePage(locale);

  if (!home) {
    notFound();
  }

  const logo = getImage(home.hero.media, "Churro Loop");

  return (
    <html
      lang={locale}
      className={`${displayFont.variable} ${sansFont.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          {logo && <SiteHeader logo={logo} />}
          <main className="flex-1">{children}</main>
          <SiteFooter logo={home.contact.logo} stackedLogo={home.hero.media} />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
