export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
          <p className="text-2xl font-medium text-gray-800">$48,295</p>
          <p className="text-xs text-green-500 mt-1">+12.4% this month</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 mb-1">Total Orders</p>
          <p className="text-2xl font-medium text-gray-800">1,284</p>
          <p className="text-xs text-green-500 mt-1">+8 today</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 mb-1">Active Users</p>
          <p className="text-2xl font-medium text-gray-800">392</p>
          <p className="text-xs text-red-400 mt-1">-3 this week</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-700">Recent Orders</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-400 uppercase">
            <tr>
              <th className="text-left px-5 py-3">Order ID</th>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Product</th>
              <th className="text-left px-5 py-3">Total</th>
              <th className="text-left px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { id: "#1041", name: "Rahul M.", product: "RTX 4070 GPU", total: "$599", status: "Delivered", color: "green" },
              { id: "#1040", name: "Sara K.", product: "AMD Ryzen 9", total: "$429", status: "Processing", color: "blue" },
              { id: "#1039", name: "Tom B.", product: "Samsung SSD 2TB", total: "$149", status: "Pending", color: "yellow" },
            ].map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-gray-500">{order.id}</td>
                <td className="px-5 py-3 text-gray-700">{order.name}</td>
                <td className="px-5 py-3 text-gray-700">{order.product}</td>
                <td className="px-5 py-3 text-gray-700">{order.total}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                    ${order.color === "green" ? "bg-green-100 text-green-700" :
                      order.color === "blue"  ? "bg-blue-100 text-blue-700" :
                                                "bg-yellow-100 text-yellow-700"}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}