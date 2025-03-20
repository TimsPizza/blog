import "./globals.css";

import type { Metadata } from "next";
import { Inter as FontSans, LXGW_WenKai_TC } from "next/font/google";

import { Container, Section } from "@/components/craft";
import { MobileNav } from "@/components/nav/mobile-nav";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { mainMenu } from "@/menu.config";
import { siteConfig } from "@/site.config";
import { Analytics } from "@vercel/analytics/react";


import Link from "next/link";

import NavItem from "@/components/ui/nav-item";
import { cn } from "@/lib/utils";

const lxgw = LXGW_WenKai_TC({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-lxgw",
});

const font = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "WordPress & Next.js Starter by 9d8",
  description:
    "A starter template for Next.js with WordPress as a headless CMS.",
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "h-full min-h-screen w-full font-sans antialiased",
          font.variable,
          lxgw.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex h-screen w-full flex-col">
            <Nav className={`${lxgw.className} text-lg font-bold`} />
            <div id="content-wrapper" className="flex-1 min-h-screen">
              {children}
            </div>
            <Footer />
          </main>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

const Nav = ({ className, children, id }: NavProps) => {
  return (
    <nav
      className={cn("sticky top-0 z-50 bg-background", "border-b", className)}
      id={id}
    >
      <div
        id="nav-container"
        className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-8"
      >
        <Link
          className="flex items-center gap-4 transition-all hover:opacity-75"
          href="/"
        >
          <h2 className="text-md">{siteConfig.site_name}</h2>
        </Link>
        {children}
        <div className="flex items-center">
          <div className="mx-2 hidden capitalize md:flex md:gap-5">
            {Object.entries(mainMenu).map(([key, href]) => (
              <NavItem
                key={href}
                className="text-base"
                href={href}
                text={key}
              />
            ))}
          </div>

          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer>
      <Section>
        <Container className="not-prose flex flex-col justify-between gap-6 border-t md:flex-row md:items-center md:gap-2 !py-2">
          <ThemeToggle />
          <div className="flex flex-col items-start justify-center gap-2">
            <p className="text-muted-foreground">
              &copy; <a href="https://github.com/TimsPizza">timspizza</a>.
            </p>
            <p className="text-muted-foreground">
              2025-present
            </p>
          </div>
        </Container>
      </Section>
    </footer>
  );
};
