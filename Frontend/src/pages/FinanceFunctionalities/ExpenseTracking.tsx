import { useState } from "react";

interface Expense {
  category: string;
  amount: number;
  date: string;
}

const ExpenseTracking = () => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([{
    category: "Utilities",
    amount: 200,
    date: "2024-02-15",
  }, {
    category: "Maintenance",
    amount: 500,
    date: "2024-02-10",
  }]);

  const addExpense = () => {
    if (!category || !amount || !date) return;
    setExpenses([...expenses, { category, amount: parseFloat(amount), date }]);
    setCategory("");
    setAmount("");
    setDate("");
  };

  return (
    <div className="bg-[#29293d] p-6 rounded-lg shadow-md border border-gray-700 mx-auto">
      <h2 className="text-3xl font-semibold text-yellow-400 text-center mb-4">Expense Tracking</h2>

      {/* Input Fields Row */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <input 
          type="text" 
          placeholder="Category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md flex-1"
        />
        <input 
          type="number" 
          placeholder="Amount" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md flex-1"
        />
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded-md"
        />
        <button 
          onClick={addExpense} 
          className="bg-yellow-400 text-black px-4 py-2 rounded-md font-medium hover:bg-yellow-500"
        >
          Add
        </button>
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700 text-gray-300">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 border border-gray-700 text-left">Category</th>
              <th className="p-3 border border-gray-700 text-center">Amount</th>
              <th className="p-3 border border-gray-700 text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="p-3">{expense.category}</td>
                <td className="p-3 text-center">${expense.amount}</td>
                <td className="p-3 text-center">{expense.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTracking;
