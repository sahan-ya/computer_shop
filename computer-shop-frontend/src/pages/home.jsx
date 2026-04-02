import { Route, Routes, useLocation } from "react-router-dom";
import Header from "../components/header";
import ProductPage from "./productPage";
import Overview from "./overview";
import Cart from "./cart";
import Checkout from "./checkout";
import MyOrdersPage from "./myOrdersPage";
import SettingsPage from "./settings";

function ComingSoon({ page }) {
  const icons = { Home: "🏠", About: "✨", Contact: "📬" };
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-xl" style={{ background: "#021A54" }}>
        {icons[page]}
      </div>
      <h1 className="text-3xl font-extrabold" style={{ color: "#021A54" }}>{page} Page</h1>
      <p style={{ color: "#FF85BB" }} className="max-w-sm text-sm font-medium">
        Drop your content here to bring this page to life!
      </p>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
      <div className="text-8xl font-black select-none" style={{ color: "#FFCEE3", WebkitTextStroke: "3px #021A54" }}>404</div>
      <p className="text-xl font-bold" style={{ color: "#021A54" }}>Page not found</p>
      <p className="text-sm max-w-xs" style={{ color: "#FF85BB" }}>The page you're looking for doesn't exist or was moved.</p>
      <a href="/" className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm shadow-lg transition-all hover:scale-105 hover:opacity-90" style={{ background: "#021A54" }}>
        Back to Home
      </a>
    </div>
  );
}

function PageWrapper({ children }) {
  const { pathname } = useLocation();
  return (
    <main key={pathname} className="min-h-[calc(100vh-71px)]"
      style={{ background: "#F5F5F5", animation: "fadeIn 0.3s ease forwards" }}>
      {children}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </main>
  );
}

export default function HomePage() {
  return (
    <div className="w-full min-h-screen" style={{ background: "#F5F5F5" }}>
      <Header />

      {/* Soft decorative blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #FF85BB, transparent 70%)" }} />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #021A54, transparent 70%)" }} />
      </div>

      <PageWrapper>
        <Routes>
          <Route path="/"        element={<ComingSoon page="Home" />} />
          <Route path="/about"   element={<ComingSoon page="About" />} />
          <Route path="/contact" element={<ComingSoon page="Contact" />} />
          <Route path="/products"            element={<ProductPage />} />
          <Route path="/cart"                element={<Cart />} />
          <Route path="/overview/:productId" element={<Overview />} />
          <Route path="/checkout"            element={<Checkout />} />
          <Route path="/my-orders"           element={<MyOrdersPage />} />
          <Route path="/settings"            element={<SettingsPage />} />
          <Route path="/*"       element={<NotFound />} />
        </Routes>
      </PageWrapper>
    </div>
  );
}