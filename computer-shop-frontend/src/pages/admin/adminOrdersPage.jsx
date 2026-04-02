import axios from "axios";
import { useEffect, useState } from "react";
import LoadingAnimation from "../../components/loadingAnimation";
import getFormattedPrice from "../../utils/price-format";
import getFormattedDate from "../../utils/date-format";
import toast from "react-hot-toast";
import ViewOrderInfoModal from "../../components/viewOrderInfoModal";

function StatusBadge({ status }) {
  const styles = {
    Delivered:  "bg-green-100 text-green-700",
    Processing: "bg-blue-100 text-blue-700",
    Pending:    "bg-yellow-100 text-yellow-700",
    Cancelled:  "bg-red-100 text-red-700",
  };
  const dots = {
    Delivered:  "bg-green-500",
    Processing: "bg-blue-500",
    Pending:    "bg-yellow-500",
    Cancelled:  "bg-red-500",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] ?? "bg-gray-400"}`} />
      {status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders]       = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize]   = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!loading) return;
    const token = localStorage.getItem("token");
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/orders/${pageSize}/${pageNumber}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      });
  }, [loading]);

  function prevPage() {
    if (pageNumber > 1) { setPageNumber(p => p - 1); setLoading(true); }
    else toast.success("You are on the first page");
  }

  function nextPage() {
    if (pageNumber < totalPages) { setPageNumber(p => p + 1); setLoading(true); }
    else toast.success("You are on the last page");
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl overflow-hidden border border-gray-200">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-4 flex-shrink-0">
        <h2 className="text-sm font-medium text-gray-800">Orders</h2>
        <p className="text-xs text-gray-400 mt-0.5">Manage your orders at a glance</p>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingAnimation />
          </div>
        ) : (
          <table className="w-full text-sm border-collapse min-w-[900px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50 border-b border-gray-200">
                {["Order ID", "Customer Name", "Email", "Date", "Total Amount", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10.5px] font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">
                    #{order.orderId}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {order.firstName} {order.lastName}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{order.email}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {getFormattedDate(order.date)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {getFormattedPrice(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ViewOrderInfoModal order={order} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="bg-white border-t border-gray-200 px-5 py-3 flex items-center justify-center gap-3 flex-shrink-0">
        <button
          onClick={prevPage}
          className="px-5 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors"
        >
          Previous
        </button>
        <span className="text-sm text-gray-400 w-28 text-center">
          Page {pageNumber} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          className="px-5 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors"
        >
          Next
        </button>
        <select
          value={pageSize}
          onChange={(e) => { setPageSize(parseInt(e.target.value)); setPageNumber(1); setLoading(true); }}
          className="ml-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 bg-white"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

    </div>
  );
}