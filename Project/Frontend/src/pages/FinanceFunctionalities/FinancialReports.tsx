import { useState } from "react";

interface FinancialReport {
  month: string;
  income: number;
  expenses: number;
  profit: number;
}

const FinancialReports = () => {
  const [reports] = useState<FinancialReport[]>([  
    { month: "January", income: 5000, expenses: 2000, profit: 3000 },
    { month: "February", income: 5500, expenses: 2500, profit: 3000 },
    { month: "March", income: 6000, expenses: 2700, profit: 3300 },
  ]);

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-3xl font-semibold text-yellow-400 text-center mb-4">
        Financial Reports
      </h3>
      
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-gray-300 text-left">
              <th className="p-3 border border-gray-700">Month</th>
              <th className="p-3 border border-gray-700">Income ($)</th>
              <th className="p-3 border border-gray-700">Expenses ($)</th>
              <th className="p-3 border border-gray-700">Profit ($)</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="p-4 text-lg">{report.month}</td>
                <td className="p-4">{report.income}</td>
                <td className="p-4">{report.expenses}</td>
                <td className="p-4 text-green-400">{report.profit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialReports;
