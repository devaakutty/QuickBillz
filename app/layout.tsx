import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
// import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-[#0b0e14] text-black dark:text-white">
        <AuthProvider>
          {/* Page content */}
          <div className="flex-1">
            {children}
          </div>

          {/* ✅ Footer */}
          {/* <Footer /> */}
        </AuthProvider>
      </body>
    </html>
  );
}
