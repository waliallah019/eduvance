import { useState } from "react";
import { FaMoneyBill, FaChartBar, FaWallet, FaFileInvoice, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import ManageFees from "../FinanceFunctionalities/ManageFees";
import ExpenseTracking from "../FinanceFunctionalities/ExpenseTracking";
import FinancialReports from "../FinanceFunctionalities/FinancialReports";
import SalaryManagement from "../FinanceFunctionalities/SalaryManagement";

const FinanceManagerDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <FaChartBar />, key: "dashboard" },
    { name: "Manage Fees", icon: <FaMoneyBill />, key: "fees" },
    { name: "Expense Tracking", icon: <FaWallet />, key: "expenses" },
    { name: "Financial Reports", icon: <FaFileInvoice />, key: "reports" },
    { name: "Salary Management", icon: <FaMoneyBill />, key: "salary" },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#1a1a40] to-[#110020] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#29293d] p-6 min-h-screen shadow-lg flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide text-center mb-5">
            edu<span className="text-yellow-400">vance</span>
          </h1>
          <nav>
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-all ${
                  activeSection === item.key ? "bg-yellow-400 text-black" : "hover:bg-gray-700"
                }`}
              >
                {item.icon} {item.name}
              </button>
            ))}
          </nav>
        </div>
        {/* Logout Button */}
        <Link to="/login">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-600 hover:text-white transition-all">
            <FaSignOutAlt /> Logout
          </button>
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-4xl font-semibold mb-6">Finance Manager Dashboard</h2>
        {activeSection === "dashboard" && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#29293d] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Total Fees Collected</h3>
              <p className="text-3xl font-bold text-yellow-400">$50,000</p>
            </div>
            <div className="bg-[#29293d] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Monthly Expenses</h3>
              <p className="text-3xl font-bold text-yellow-400">$20,000</p>
            </div>
          </div>
        )}
        {activeSection === "fees" && <ManageFees />}
        {activeSection === "expenses" && <ExpenseTracking />}
        {activeSection === "reports" && <FinancialReports />}
        {activeSection === "salary" && <SalaryManagement />}
        
      </main>
    </div>
  );
};

export default FinanceManagerDashboard;
