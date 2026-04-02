import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CustomerViewOrderInfoModal from "../components/customersViewOrderInfoModal";
import LoadingAnimation from "../components/loadingAnimation";
import uploadFile from "../utils/mediaUpload";
import getFormattedDate from "../utils/date-format";
import getFormattedPrice from "../utils/price-format";

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Delivered:  { bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500"  },
    Processing: { bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-500"   },
    Pending:    { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
    Cancelled:  { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500"    },
  };
  const s = map[status] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders]         = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (!loading) return;
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/orders/${pageSize}/${pageNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [loading]);

  function prevPage() {
    if (pageNumber > 1) { setPageNumber((p) => p - 1); setLoading(true); }
    else toast.success("You are on the first page");
  }
  function nextPage() {
    if (pageNumber < totalPages) { setPageNumber((p) => p + 1); setLoading(true); }
    else toast.success("You are on the last page");
  }

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <LoadingAnimation />
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Order ID", "Date", "Total Amount", "Status", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10.5px] font-medium text-gray-400 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-400">#{order.orderId}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{getFormattedDate(order.date)}</td>
                <td className="px-4 py-3 text-gray-700 font-medium">{getFormattedPrice(order.total)}</td>
                <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                <td className="px-4 py-3"><CustomerViewOrderInfoModal order={order} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-center gap-3">
        <button onClick={prevPage}
          className="px-5 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs transition-colors">
          Previous
        </button>
        <span className="text-xs text-gray-400 w-24 text-center">
          Page {pageNumber} of {totalPages}
        </span>
        <button onClick={nextPage}
          className="px-5 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs transition-colors">
          Next
        </button>
        <select
          value={pageSize}
          onChange={(e) => { setPageSize(parseInt(e.target.value)); setPageNumber(1); setLoading(true); }}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 bg-white"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab({ user, onProfileUpdate }) {
  const [firstName, setFirstName]         = useState(user?.firstName ?? "");
  const [lastName, setLastName]           = useState(user?.lastName ?? "");
  const [file, setFile]                   = useState(null);
  const [password, setPassword]           = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function updateProfile() {
    try {
      const token = localStorage.getItem("token");
      let imageUrl = user?.image ?? "";
      if (file) imageUrl = await uploadFile(file);
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/`,
        { firstName, lastName, image: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("token", res.data.token);
      toast.success("Profile updated successfully");
      onProfileUpdate?.();
    } catch {
      toast.error("Failed to update profile");
    }
  }

  async function changePassword() {
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/update-password`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password changed successfully");
      setPassword(""); setConfirmPassword("");
    } catch {
      toast.error("Failed to change password");
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium text-gray-800">Account Settings</p>
          <p className="text-xs text-gray-400 mt-0.5">Update your name and profile photo</p>
        </div>

        {/* Avatar preview */}
        {user?.image && (
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <img src={user.image} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
            <div>
              <p className="text-sm font-medium text-gray-700">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-400">Current photo</p>
            </div>
          </div>
        )}

        <input value={firstName} onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-400" />

        <input value={lastName} onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-400" />

        <div className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-400 cursor-pointer hover:border-blue-400 transition-colors">
          <input type="file" onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" />
        </div>

        <button onClick={updateProfile}
          className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors">
          Update Profile
        </button>
      </div>

      {/* Password Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium text-gray-800">Change Password</p>
          <p className="text-xs text-gray-400 mt-0.5">Choose a strong password</p>
        </div>

        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-400" />

        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-400" />

        {/* Password match hint */}
        {confirmPassword && (
          <p className={`text-xs ${password === confirmPassword ? "text-green-500" : "text-red-400"}`}>
            {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
          </p>
        )}

        <button onClick={changePassword}
          className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors mt-auto">
          Change Password
        </button>
      </div>
    </div>
  );
}

// ─── Main Profile Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [tab, setTab]         = useState("orders"); // "orders" | "settings"
  const [totalOrders, setTotalOrders] = useState(0);

  function fetchUser() {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => { localStorage.removeItem("token"); navigate("/login"); });
  }

  useEffect(() => { fetchUser(); }, []);

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-gray-50">

      {/* Banner */}
      <div className="h-24 bg-[#0f1117] relative">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
      </div>

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200 px-6 flex items-end gap-4">
        {/* Avatar */}
        <div className="relative -mt-9 mb-3 flex-shrink-0">
          {user?.image ? (
            <img src={user.image}
              className="w-[72px] h-[72px] rounded-full object-cover border-[3px] border-white shadow-sm" />
          ) : (
            <div className="w-[72px] h-[72px] rounded-full bg-blue-900 border-[3px] border-white flex items-center justify-center text-blue-300 text-xl font-medium shadow-sm">
              {initials}
            </div>
          )}
        </div>

        {/* Name & Email */}
        <div className="pb-3 flex-1 min-w-0">
          {user ? (
            <>
              <p className="text-sm font-medium text-gray-800">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
            </>
          ) : (
            <div className="space-y-1">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-end gap-6 pb-3">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800">{totalOrders || "—"}</p>
            <p className="text-[10.5px] text-gray-400">Orders</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">Member since</p>
            <p className="text-xs font-medium text-gray-600">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 flex gap-1">
        {[
          { key: "orders",   label: "My Orders" },
          { key: "settings", label: "Settings"  },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px
              ${tab === key
                ? "border-blue-500 text-blue-500 font-medium"
                : "border-transparent text-gray-400 hover:text-gray-600"
              }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5 max-w-5xl mx-auto">
        {tab === "orders"   && <OrdersTab />}
        {tab === "settings" && <SettingsTab user={user} onProfileUpdate={fetchUser} />}
      </div>
    </div>
  );
}