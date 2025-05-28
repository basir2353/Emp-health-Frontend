import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus } from "lucide-react";

// Type definitions
interface Expense {
  id: number;
  name: string;
  amount: number;
}

interface Income {
  id: number;
  source: string;
  amount: number;
}

interface ChartData {
  month: string;
  value: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

interface CardProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

interface ListProps {
  dataSource: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  footer?: React.ReactNode;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense?: (expense: Expense) => void;
  onAddIncome?: (income: Income) => void;
}

// Custom Card component
const Card: React.FC<CardProps> = ({ title, extra, children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-lg border ${className}`}>
    {(title || extra) && (
      <div className="flex justify-between items-center p-4 border-b">
        <div className="text-lg font-semibold">{title}</div>
        <div>{extra}</div>
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

// Custom List component
const List: React.FC<ListProps> = ({ dataSource, renderItem, footer }) => (
  <div>
    {dataSource.map((item, index) => (
      <div key={index} className="py-2">
        {renderItem(item, index)}
      </div>
    ))}
    {footer && <div className="mt-4">{footer}</div>}
  </div>
);

// Custom Button component
const Button: React.FC<ButtonProps> = ({ children, onClick, className = "", icon }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 bg-black text-white rounded flex items-center gap-2 hover:bg-gray-800 ${className}`}
  >
    {icon}
    {children}
  </button>
);

// Add Expense Modal
const AddExpenseModal: React.FC<ModalProps> = ({ isOpen, onClose, onAddExpense }) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    if (name && amount && onAddExpense) {
      onAddExpense({
        name,
        amount: parseFloat(amount),
        id: Date.now()
      });
      setName("");
      setAmount("");
      onClose();
    }
  };

  const handleKeyPress = (e:any) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
        <div>
          <div className="mb-4">
            <div className="block text-sm font-medium mb-2">Expense Name</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-2 border rounded"
              placeholder="Enter expense name"
            />
          </div>
          <div className="mb-4">
            <div className="block text-sm font-medium mb-2">Amount (USD)</div>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-2 border rounded"
              placeholder="Enter amount"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Add Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Income Modal
const AddIncomeModal: React.FC<ModalProps> = ({ isOpen, onClose, onAddIncome }) => {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = () => {
    if (source && amount && onAddIncome) {
      onAddIncome({
        source,
        amount: parseFloat(amount),
        id: Date.now()
      });
      setSource("");
      setAmount("");
      onClose();
    }
  };

  const handleKeyPress = (e:any) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Add Income</h2>
        <div>
          <div className="mb-4">
            <div className="block text-sm font-medium mb-2">Income Source</div>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-2 border rounded"
              placeholder="Enter income source"
            />
          </div>
          <div className="mb-4">
            <div className="block text-sm font-medium mb-2">Amount (USD)</div>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-2 border rounded"
              placeholder="Enter amount"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Add Income
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const BudgetPlanner: React.FC = () => {
  // Initialize state with localStorage data or defaults
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('budgetPlanner_expenses');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Insurance", amount: 8000 },
      { id: 2, name: "Transport", amount: 205 },
      { id: 3, name: "Utilities", amount: 205 },
      { id: 4, name: "Home Rent", amount: 205 },
      { id: 5, name: "Groceries", amount: 25 },
      { id: 6, name: "Laptop Bag", amount: 30 },
      { id: 7, name: "Dinner", amount: 20 }
    ];
  });

  const [incomes, setIncomes] = useState<Income[]>(() => {
    const saved = localStorage.getItem('budgetPlanner_incomes');
    return saved ? JSON.parse(saved) : [
      { id: 1, source: "Salary/Wages", amount: 8000 },
      { id: 2, source: "Stocks Dividend", amount: 205 }
    ];
  });

  const [expenseData, setExpenseData] = useState<ChartData[]>(() => {
    const saved = localStorage.getItem('budgetPlanner_expenseData');
    return saved ? JSON.parse(saved) : [
      { month: "Jan", value: 3000 },
      { month: "Feb", value: 2000 },
      { month: "Mar", value: 2780 },
      { month: "Apr", value: 1890 },
      { month: "May", value: 2390 },
      { month: "Jun", value: 3490 }
    ];
  });

  const [savingsData, setSavingsData] = useState<ChartData[]>(() => {
    const saved = localStorage.getItem('budgetPlanner_savingsData');
    return saved ? JSON.parse(saved) : [
      { month: "Jan", value: 1000 },
      { month: "Feb", value: 3000 },
      { month: "Mar", value: 5000 },
      { month: "Apr", value: 1500 },
      { month: "May", value: 3000 },
      { month: "Jun", value: 4000 }
    ];
  });

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('budgetPlanner_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budgetPlanner_incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('budgetPlanner_expenseData', JSON.stringify(expenseData));
  }, [expenseData]);

  useEffect(() => {
    localStorage.setItem('budgetPlanner_savingsData', JSON.stringify(savingsData));
  }, [savingsData]);

  // Calculate totals
  const totalExpenses = expenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
  const totalIncome = incomes.reduce((sum: number, income: Income) => sum + income.amount, 0);
  const totalSavings = savingsData.reduce((sum: number, data: ChartData) => sum + data.value, 0);

  // Add new expense
  const handleAddExpense = (newExpense: Expense) => {
    setExpenses((prev: Expense[]) => [...prev, newExpense]);
    
    // Update current month's expense data
    const currentMonth = new Date().toLocaleString('default', { month: 'short' });
    setExpenseData((prev: ChartData[]) => {
      const updated = [...prev];
      const currentMonthIndex = updated.findIndex(item => item.month === currentMonth);
      if (currentMonthIndex >= 0) {
        updated[currentMonthIndex].value += newExpense.amount;
      } else {
        updated.push({ month: currentMonth, value: newExpense.amount });
      }
      return updated;
    });
  };

  // Add new income
  const handleAddIncome = (newIncome: Income) => {
    setIncomes((prev: Income[]) => [...prev, newIncome]);
  };

  // Remove expense
  const handleRemoveExpense = (id: number) => {
    setExpenses((prev: Expense[]) => prev.filter((expense: Expense) => expense.id !== id));
  };

  // Remove income
  const handleRemoveIncome = (id: number) => {
    setIncomes((prev: Income[]) => prev.filter((income: Income) => income.id !== id));
  };

  const renderCustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-lg p-2 border rounded">
          <p className="label">{`${label}: $${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 bg-gray-50 min-h-screen">
      <header className="my-8">
        <div className="flex items-center gap-4 mb-4">
          <ArrowLeft className="w-6 h-6 border-2 rounded-full border-gray-300 p-1 cursor-pointer" />
          <h1 className="text-3xl font-bold">Budget Planner</h1>
        </div>
        <nav className="text-sm text-gray-600">
          <span>Wellness</span> / <span className="text-blue-600">Budget Planner</span>
        </nav>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="md:col-span-1 space-y-6">
          {/* Total Expense Chart */}
          <Card
            title={
              <div>
                <p className="text-2xl font-semibold">Total Expense</p>
                <span className="text-blue-500 text-sm">Last 6 months</span>
              </div>
            }
            extra={
              <div className="border-2 p-3 rounded">
                <p className="text-sm text-gray-600">Total Expense</p>
                <span className="text-red-500 font-bold text-xl">
                  ${expenseData.reduce((sum: number, data: ChartData) => sum + data.value, 0).toLocaleString()} USD
                </span>
              </div>
            }
            className="h-96"
          >
          
          </Card>

         
        </div>

        {/* Income Section */}
        <Card
          title={<span className="text-xl font-semibold">Incomes</span>}
          extra={
            <Button
              onClick={() => setIsIncomeModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Income
            </Button>
          }
        >
          <List
            dataSource={incomes}
            renderItem={(item: Income) => (
              <div className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span className="font-medium">{item.source}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">${item.amount.toLocaleString()} USD</span>
                  <button
                    onClick={() => handleRemoveIncome(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            footer={
              <div className="flex justify-between items-center bg-gray-100 p-3 rounded border-t-2 font-bold text-lg">
                <span>Total Income</span>
                <span>${totalIncome.toLocaleString()} USD</span>
              </div>
            }
          />
        </Card>

        {/* Expenses Section */}
        <Card
          title={<span className="text-xl font-semibold">Expenses</span>}
          extra={
            <Button
              onClick={() => setIsExpenseModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Expense
            </Button>
          }
        >
          <List
            dataSource={expenses}
            renderItem={(item: Expense) => (
              <div className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span className="font-medium">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">${item.amount.toLocaleString()} USD</span>
                  <button
                    onClick={() => handleRemoveExpense(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            footer={
              <div className="flex justify-between items-center bg-gray-100 p-3 rounded border-t-2 font-bold text-lg">
                <span>Total Expenses</span>
                <span className="text-red-600">${totalExpenses.toLocaleString()} USD</span>
              </div>
            }
          />
        </Card>
      </div>

      {/* Summary Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-green-800">Net Savings</h3>
          <p className="text-2xl font-bold text-green-600">
            ${(totalIncome - totalExpenses).toLocaleString()} USD
          </p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-blue-800">Total Income</h3>
          <p className="text-2xl font-bold text-blue-600">
            ${totalIncome.toLocaleString()} USD
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-red-800">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">
            ${totalExpenses.toLocaleString()} USD
          </p>
        </div>
      </div>

      {/* Modals */}
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onAddExpense={handleAddExpense}
      />
      
      <AddIncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onAddIncome={handleAddIncome}
      />
    </div>
  );
};

export default BudgetPlanner;