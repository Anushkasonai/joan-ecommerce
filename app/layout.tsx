import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";
import { getCartItems, getWishlistItems } from "@/lib/actions/cartActions";
import { CartProvider } from "@/components/CartContext";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Joan | Trendy, Soft & Modern Indian E-Commerce",
  description: "Discover Joan — your curated Indian destination for women's and men's fashion, beauty, electronics, home essentials, and daily groceries at honest INR prices.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Joan | Trendy, Soft & Modern Indian E-Commerce",
    description: "Curated shopping experience with quick-add cart, honest INR pricing, and fast delivery across India.",
    siteName: "Joan",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch active user and initial cart/wishlist
  const user = await getCurrentUser();
  const cart = await getCartItems();
  const wishlist = await getWishlistItems();

  const headerUser = user ? { name: user.name, email: user.email, role: user.role } : null;

  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFFCF7] text-[#292633] font-sans antialiased selection:bg-[#B9A7E8]/40 selection:text-[#292633]">
        <CartProvider initialCart={cart} initialWishlist={wishlist}>
          <Header user={headerUser} />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
