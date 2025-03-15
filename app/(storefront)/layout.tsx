import { type ReactNode } from "react";

import { Footer } from "@/components/storefront/Footer";
import { Navbar } from "@/components/storefront/Navbar";


export default function StoreFrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 w-full bg-white border-b">
        <Navbar />
      </div>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
