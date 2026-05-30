import type { Metadata } from "next";
import type { ReactNode } from "react";

import ThemeToggle from "@/app/components/theme-toggle";

import "./globals.css";

export const metadata: Metadata = {
  title: "Taehoon Hwang | Blog",
  description: "Blog Posts by Taehoon Hwang.",
};

const theme_script = `
(() => {
  const theme_key = 'theme';
  const saved_theme = localStorage.getItem(theme_key);
  const has_saved_theme = saved_theme === 'dark' || saved_theme === 'light';
  const prefers_dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = has_saved_theme ? saved_theme : (prefers_dark ? 'dark' : 'light');
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: theme_script }} />
      </head>
      <body>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
