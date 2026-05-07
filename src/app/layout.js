import "./globals.css";
import AuthInitializer from "@/components/auth/AuthInitializer";
import Providers from "@/components/layout/Providers";

export const metadata = {
  title: "Forge Fitness - AI Coach",
  description: "Elite performance tracking and AI coaching",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-mesh text-on-surface font-inter">
        <Providers>
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </Providers>
      </body>
    </html>
  );
}
