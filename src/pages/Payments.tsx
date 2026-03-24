import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Wallet,
  CheckCircle,
  FileText,
  Download,
  Calendar,
} from "lucide-react";

/* ---------------- TYPES ---------------- */

type Transaction = {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: "Success" | "Failed";
  tags: string[];
};

/* ---------------- DATA ---------------- */

const transactions: Transaction[] = [
  {
    id: "TXN1771075349122",
    title: "Dual Course Plan",
    date: "31/12/2025",
    amount: 589,
    status: "Success",
    tags: ["Technical", "Non-Technical"],
  },
  {
    id: "TXN20240101543210",
    title: "Dual Course Plan",
    date: "31/12/2025",
    amount: 589,
    status: "Success",
    tags: ["Technical", "Non-Technical"],
  },
  {
    id: "TXN20230615234567",
    title: "Single Course Plan",
    date: "29/07/2025",
    amount: 234,
    status: "Success",
    tags: ["Technical"],
  },
];

/* ---------------- COMPONENT ---------------- */

const Payments = () => {
  const navigate = useNavigate();

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white px-6 py-8 md:px-10 md:py-10">
        <button
          onClick={() => navigate("/studentdashboard")}
          className="flex items-center gap-2 text-sm mb-6 hover:opacity-80"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <h1 className="text-2xl md:text-3xl font-bold">Payment History</h1>
        <p className="text-sm opacity-90 mt-1">
          View all your transactions and download invoices
        </p>
      </div>

      {/* CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-8">
        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TOTAL SPENT */}
          <div className="bg-gradient-to-r from-purple-200 to-purple-300 p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Total Spent</p>
              <p className="text-3xl font-bold text-purple-700">
                ₹{totalSpent}
              </p>
            </div>
            <Wallet className="text-purple-400 w-8 h-8" />
          </div>

          {/* SUCCESSFUL */}
          <div className="bg-gradient-to-r from-green-200 to-green-300 p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="text-gray-600 text-sm">Successful</p>
              <p className="text-3xl font-bold text-green-700">
                {transactions.filter((t) => t.status === "Success").length}
              </p>
            </div>
            <CheckCircle className="text-green-400 w-8 h-8" />
          </div>

          {/* TRANSACTIONS */}
          <div
            className="rounded-2xl p-6 shadow flex justify-between items-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, #FFEDD4 100%)",
            }}
          >
            <div>
              <p className="text-gray-600 text-sm">Transactions</p>
              <p className="text-3xl font-bold text-yellow-700">
                {transactions.length}
              </p>
            </div>
            <FileText className="text-yellow-400 w-8 h-8" />
          </div>
        </div>

        {/* TRANSACTION HISTORY */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-200">
          <h2 className="font-semibold text-lg mb-6">Transaction History</h2>

          <div className="space-y-5">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="border rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition"
              >
                {/* LEFT SIDE */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-green-500 w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800">{txn.title}</h3>

                    <p className="text-xs text-gray-500">
                      <Calendar className="w-3 h-3 inline mr-1 mb-1" />
                      {txn.date} | ID: {txn.id}
                    </p>

                    {/* TAGS */}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {txn.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-200 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE (PRICE + STATUS + ACTIONS) */}
                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                  {/* PRICE + STATUS */}
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      ₹{txn.amount}
                    </p>

                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full inline-block mt-1">
                      {txn.status}
                    </span>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 border px-3 py-1.5 rounded-lg hover:bg-gray-100 text-sm">
                      <Download className="w-4 h-4" />
                      Download Invoice
                    </button>

                    <button className="text-sm text-gray-600 hover:text-purple-600">
                      Download Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
