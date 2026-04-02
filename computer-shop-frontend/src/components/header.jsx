import { BiShoppingBag } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import UserData from "./userData";
import { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { LuPanelLeftClose } from "react-icons/lu";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location.pathname]);

  return (
    <>
      <header
        className={`w-full sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-[0_4px_24px_rgba(2,26,84,0.18)]" : ""
        }`}
        style={{ background: "#021A54" }}
      >
        {/* Pink accent line at top */}
        <div style={{ height: "3px", background: "linear-gradient(90deg, #FF85BB, #FFCEE3, #FF85BB)", backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite" }} />

        <div className="flex items-center justify-between px-4 lg:px-10 h-[68px]">

          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 rounded-xl transition-colors"
              style={{ background: "rgba(255,133,187,0.15)" }}
              aria-label="Open menu"
            >
              <GiHamburgerMenu size={22} color="#FF85BB" />
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                style={{ background: "rgba(255,133,187,0.2)", border: "1.5px solid rgba(255,133,187,0.4)" }}
              >
                <img src="/logo.png" alt="Logo" className="h-6 w-6 object-contain" />
              </div>
              <span className="font-extrabold text-xl tracking-tight" style={{ color: "#fff" }}>
                Tech<span style={{ color: "#FF85BB" }}>Store</span>
              </span>
            </Link>
          </div>

          {/* Center: Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className="relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={active ? { background: "#FF85BB", color: "#021A54" } : { color: "rgba(255,255,255,0.75)" }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,133,187,0.15)"; e.currentTarget.style.color = "#fff"; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; } }}
                >
                  {label}
                  {active && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: "#FFCEE3" }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Cart + User */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl transition-all duration-200 hover:scale-110"
              style={{ background: "rgba(255,133,187,0.15)", border: "1.5px solid rgba(255,133,187,0.3)" }}
            >
              <BiShoppingBag size={22} color="#FF85BB" />
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center shadow" style={{ background: "#FF85BB", color: "#021A54" }}>
                3
              </span>
            </Link>
            <div className="h-8 w-px" style={{ background: "rgba(255,133,187,0.25)" }} />
            <UserData />
          </div>

          {/* Mobile: Cart */}
          <Link to="/cart" className="lg:hidden relative p-2 rounded-xl" style={{ background: "rgba(255,133,187,0.15)" }}>
            <BiShoppingBag size={22} color="#FF85BB" />
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center" style={{ background: "#FF85BB", color: "#021A54" }}>
              3
            </span>
          </Link>
        </div>

        <style>{`
          @keyframes shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        `}</style>
      </header>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex" style={{ backdropFilter: "blur(4px)", background: "rgba(2,26,84,0.6)" }} onClick={() => setIsOpen(false)}>
          <div className="w-[300px] h-full flex flex-col shadow-2xl" style={{ background: "#021A54", animation: "slideIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards" }} onClick={e => e.stopPropagation()}>
            
            <div className="flex items-center gap-3 px-5 h-[68px]" style={{ borderBottom: "1px solid rgba(255,133,187,0.2)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,133,187,0.2)", border: "1.5px solid rgba(255,133,187,0.4)" }}>
                <img src="/logo.png" alt="Logo" className="h-6 object-contain" />
              </div>
              <span className="font-extrabold text-lg flex-1" style={{ color: "#fff" }}>
                Tech<span style={{ color: "#FF85BB" }}>Store</span>
              </span>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl" style={{ background: "rgba(255,133,187,0.15)" }}>
                <LuPanelLeftClose size={20} color="#FF85BB" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 p-4 flex-1">
              {[...navLinks, { to: "/cart", label: "Cart" }].map(({ to, label }) => {
                const active = location.pathname === to;
                return (
                  <Link key={to} to={to} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={active ? { background: "#FF85BB", color: "#021A54" } : { color: "rgba(255,255,255,0.65)" }}>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: active ? "#021A54" : "#FF85BB" }} />
                    {label}
                    {active && <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(2,26,84,0.15)" }}>Active</span>}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4" style={{ borderTop: "1px solid rgba(255,133,187,0.2)" }}>
              <UserData />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from{transform:translateX(-100%);opacity:0} to{transform:translateX(0);opacity:1} }
      `}</style>
    </>
  );
}