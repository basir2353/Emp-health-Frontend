import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  List,
  Typography,
  Drawer,
} from "antd";
import { BreadCrumb } from "../../components/BreadCrumbs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import AddExpenseDrawer from "./Expensedrawer";
import AddIncomeDrawer from "./IncomeDrawer";
import "tailwindcss/tailwind.css";

const { Title } = Typography;

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const expenseData = [
  { month: "Jan", value: 3000 },
  { month: "Feb", value: 2000 },
  { month: "Mar", value: 2780 },
  { month: "Apr", value: 1890 },
  { month: "May", value: 2390 },
  { month: "Jun", value: 3490 },
];

const savingsData = [
  { month: "Jan", value: 1000 },
  { month: "Feb", value: 3000 },
  { month: "Mar", value: 5000 },
  { month: "Apr", value: 1500 },
  { month: "May", value: 3000 },
  { month: "Jun", value: 4000 },
];

const renderCustomTooltip = (props: CustomTooltipProps) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white shadow-lg p-2">
        <p className="label">{`${label} : $${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const BudgetPlanner = () => {
  const [incomes, setIncomes] = useState<{ source: string; amount: string }[]>([]);
  const [expenses, setExpenses] = useState<{ name: string; amount: string; category: string }[]>([]);
  const [isIncomeDrawerVisible, setIsIncomeDrawerVisible] = useState(false);
  const [isExpenseDrawerVisible, setIsExpenseDrawerVisible] = useState(false);

  useEffect(() => {
    const storedIncomes = localStorage.getItem("incomes");
    const storedExpenses = localStorage.getItem("expenses");

    if (storedIncomes) setIncomes(JSON.parse(storedIncomes));
    if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
  }, []);

  useEffect(() => {
    localStorage.setItem("incomes", JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addIncome = (income: { source: string; amount: string }) => {
    setIncomes((prev) => {
      const updated = [...prev, income];
      localStorage.setItem("incomes", JSON.stringify(updated));
      return updated;
    });
  };

  const addExpense = (expense: { name: string; amount: string; category: string }) => {
    setExpenses([...expenses, expense]);
  };

  const showIncomeDrawer = () => setIsIncomeDrawerVisible(true);
  const closeIncomeDrawer = () => setIsIncomeDrawerVisible(false);
  
  const showExpenseDrawer = () => setIsExpenseDrawerVisible(true);
  const closeExpenseDrawer = () => setIsExpenseDrawerVisible(false);

  const totalExpenses = expenses.reduce(
    (sum, record) => sum + parseFloat(record.amount.replace(/[^\d.]/g, "")),
    0
  );
  const totalIncome = incomes.reduce(
    (sum, record) => sum + parseFloat(record.amount.replace(/[^\d.]/g, "")),
    0
  );

  return (
    <div className="container mx-auto px-4">
      <header className="my-8">
        <div className="flex items-center gap-2 mb-4">
          <Title level={1} className="m-0 mt-3">Budget Planner</Title>
        </div>
        <BreadCrumb
          className="mt-2 mb-4"
          items={[
            { title: "Wellness", path: "/wellness" },
            { title: "Budget Planner" },
          ]}
        />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Expense Chart */}
        <div className="grid grid-cols-1 gap-10">
          <Card
            title={
              <>
                <p className="text-2xl">Total Expense</p>
                <span className="text-blue-500 text-base">Last 6 months</span>
              </>
            }
            extra={
              <div className="border-2 p-2 text-right">
                <p className="text-base">Total Expense</p>
                <span className="text-red-500 font-medium text-2xl">{totalExpenses.toLocaleString()} USD</span>
              </div>
            }
            className="rounded-lg overflow-hidden shadow-lg p-3"
            headStyle={{ borderColor: "transparent" }}
            bodyStyle={{ padding: 0 }}
          >
            <ResponsiveContainer width="100%" height={294}>
              <LineChart data={expenseData} margin={{ top: 40, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={renderCustomTooltip} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Savings Chart */}
          <Card
            title={
              <>
                <p className="text-2xl">Monthly Savings</p>
                <span className="text-base text-blue-500">Last 6 months</span>
              </>
            }
            extra={
              <div className="border-2 p-2 text-right">
                <p className="text-base">Total Savings</p>
                <span className="text-2xl text-[#A0D911] font-medium">
                  {(totalIncome - totalExpenses).toLocaleString()} USD
                </span>
              </div>
            }
            className="rounded-lg overflow-hidden shadow-lg p-3"
            headStyle={{ borderColor: "transparent" }}
            bodyStyle={{ padding: 0 }}
          >
            <ResponsiveContainer width="100%" height={294}>
              <LineChart data={savingsData} margin={{ top: 40, right: 30, left: -1, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Incomes Card */}
        <Card
          title={<span className="text-xl">Incomes</span>}
          extra={
            <Button type="primary" style={{ background: "black" }} icon={<PlusOutlined />} onClick={showIncomeDrawer}>
              Add Income
            </Button>
          }
          className="rounded-lg overflow-hidden shadow-lg"
        >
          <List
            className="p-4 text-base"
            itemLayout="horizontal"
            dataSource={incomes}
            renderItem={(item) => (
              <List.Item className="border-b-0">
                <List.Item.Meta
                  title={
                    <div className="flex justify-between text-base px-4">
                      <span>{item.source}</span>
                      <span>{item.amount}</span>
                    </div>
                  }
                />
              </List.Item>
            )}
            footer={
              <div className="flex justify-between border-t-2 p-2 text-lg border-2 bg-gray-200 mx-4 rounded-md border-gray-300">
                <span>Total Income</span>
                <span className="font-bold">{totalIncome.toLocaleString()} USD</span>
              </div>
            }
          />
        </Card>

        {/* Expenses Card */}
        <Card
          title="Expenses"
          extra={
            <Button type="primary" style={{ background: "black" }} icon={<PlusOutlined />} onClick={showExpenseDrawer}>
              Add Expense
            </Button>
          }
          className="rounded-lg overflow-hidden shadow-lg"
        >
          <List
            className="p-4 text-base"
            itemLayout="horizontal"
            dataSource={expenses}
            renderItem={(item) => (
              <List.Item className="border-b-0">
                <List.Item.Meta
                  title={
                    <div className="flex justify-between text-base px-4">
                      <span>{item.name}</span>
                      <span>{item.amount}</span>
                    </div>
                  }
                />
              </List.Item>
            )}
            footer={
              <div className="flex justify-between border-t-2 p-2 text-lg border-2 bg-gray-200 mx-4 rounded-md border-gray-300">
                <span>Total Expenses</span>
                <span className="font-bold">{totalExpenses.toLocaleString()} USD</span>
              </div>
            }
          />
        </Card>
      </div>

      {/* Separate Drawers */}
      <AddIncomeDrawer visible={isIncomeDrawerVisible} onClose={closeIncomeDrawer} onAdd={addIncome} />
      <AddExpenseDrawer visible={isExpenseDrawerVisible} onClose={closeExpenseDrawer} onAdd={addExpense} />
    </div>
  );
};

export default BudgetPlanner;