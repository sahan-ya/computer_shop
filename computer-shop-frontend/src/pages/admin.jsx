import { Link, Route, Routes, useLocation } from "react-router-dom";
import { FaRegListAlt } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import { LuUsersRound } from "react-icons/lu";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AdminDashboardPage from "./admin/adminDashboardPage";
import AdminProductsPage from "./admin/adminProductsPage";
import AdminAddProductPage from "./admin/adminAddProductPage";
import AdminUpdateProductPage from "./admin/adminUpdateProductPage";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminUsersPage from "./admin/adminUsersPage";



// NavLink — fix active detection
function NavLink({ to, icon, children, badge }) {
  const location = useLocation();

  // Exact match for dashboard, startsWith for others
  const isActive =
    to === "/"
      ? location.pathname === "/admin" || location.pathname === "/admin/"
      : location.pathname.startsWith(`/admin${to}`);



  return (
    <Link
      to={`/admin${to === "/" ? "" : to}`}
      className={`flex w-full px-3 py-2.5 gap-3 items-center rounded-lg text-sm transition-all duration-150
        ${isActive
          ? "bg-blue-500/20 text-blue-400"
          : "text-white/50 hover:bg-white/6 hover:text-white/85"
        }`}
    >
      <span className="text-base">{icon}</span>
      <span className="flex-1">{children}</span>
      {badge && (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function AdminPage() {

    const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  }
  
  return (
    <div className="w-full h-full flex">

      {/* Sidebar */}
      <div className="w-[240px] h-full flex flex-col bg-[#0f1117] flex-shrink-0">

        {/* Brand */}
        <div className="px-4 py-5 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <MdDashboard className="text-white text-lg" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">TechStore</p>
              <p className="text-white/30 text-[10px]">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2.5 flex flex-col gap-0.5">
          <p className="text-[10px] tracking-widest text-white/25 uppercase px-2 pt-2 pb-1">
            Overview
          </p>
          <NavLink to="/" icon={<MdDashboard />}>Dashboard</NavLink>

          <p className="text-[10px] tracking-widest text-white/25 uppercase px-2 pt-4 pb-1">
            Management
          </p>
          <NavLink to="/orders" icon={<FaRegListAlt />} badge="12">Orders</NavLink>
          <NavLink to="/products" icon={<MdOutlineInventory2 />}>Products</NavLink>
          <NavLink to="/users" icon={<LuUsersRound />}>Users</NavLink>
        </nav>

        {/* Footer */}
        <div className="p-2.5 border-t border-white/7">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 text-[11px] font-medium flex-shrink-0">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-[12.5px] truncate">Admin User</p>
              <p className="text-white/30 text-[10.5px]">Super Admin</p>
            </div>
            <button
      onClick={handleLogout}
      className="text-red-400 text-xs hover:text-red-300"
    >
      Logout
    </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full flex flex-col bg-gray-50 overflow-hidden">

        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <PageTitle />
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
              🔔
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-5">
<Routes>
  <Route path="/"               element={<AdminDashboardPage />} />  {/* NEW */}
  <Route path="/orders"         element={<AdminOrdersPage />} />
  <Route path="/products"       element={<AdminProductsPage />} />
  <Route path="/users"          element={<AdminUsersPage />} />
  <Route path="/add-product"    element={<AdminAddProductPage />} />
  <Route path="/update-product" element={<AdminUpdateProductPage />} />
</Routes>
        </div>
      </div>
    </div>
  );
}

function PageTitle() {
  const location = useLocation();
  // PageTitle map — update /admin entry
const map = {
  "/admin":                { title: "Dashboard",    crumb: "Admin / Overview" },
  "/admin/orders":         { title: "Orders",       crumb: "Admin / Management" },
  "/admin/products":       { title: "Products",     crumb: "Admin / Management" },
  "/admin/users":          { title: "Users",        crumb: "Admin / Management" },
  "/admin/add-product":    { title: "Add Product",  crumb: "Admin / Products" },
  "/admin/update-product": { title: "Edit Product", crumb: "Admin / Products" },
};
  const info = map[location.pathname] || { title: "Admin", crumb: "Admin" };
  return (
    <div>
      <p className="text-sm font-medium text-gray-800">{info.title}</p>
      <p className="text-xs text-gray-400">{info.crumb}</p>
    </div>
  );
}