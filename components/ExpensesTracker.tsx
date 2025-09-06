import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Expense, ThemeName } from '../types';
import { PlusIcon, TrashIcon } from './icons';
import Modal from './Modal';

const initialExpenses: Expense[] = [
  { id: '1', description: 'Groceries', amount: 75.50, category: 'Food', date: '2024-07-20' },
  { id: '2', description: 'Gasoline', amount: 50.00, category: 'Transport', date: '2024-07-19' },
  { id: '3', description: 'Movie Tickets', amount: 32.00, category: 'Entertainment', date: '2024-07-18' },
  { id: '4', description: 'Restaurant', amount: 120.00, category: 'Food', date: '2024-07-18' },
  { id: '5', description: 'Electric Bill', amount: 95.20, category: 'Utilities', date: '2024-07-15' },
];

const chartColors: Record<ThemeName, string[]> = {
    dark: ['#0ea5e9', '#f97316', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
    light: ['#0ea5e9', '#f97316', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
    midnight: ['#ff79c6', '#8be9fd', '#50fa7b', '#f1fa8c', '#bd93f9', '#ffb86c'],
};

const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];

interface ExpensesTrackerProps {
  theme: ThemeName;
}

const ExpensesTracker: React.FC<ExpensesTrackerProps> = ({ theme }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    initialExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const COLORS = chartColors[theme];
  
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      if (startDate && expense.date < startDate) {
        return false;
      }
      if (endDate && expense.date > endDate) {
        return false;
      }
      return true;
    });
  }, [expenses, startDate, endDate]);

  const totalExpenses = useMemo(() => 
    filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0), 
  [filteredExpenses]);

  const dataForChart = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    filteredExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [filteredExpenses]);
  
  const handleAddExpense = () => {
    if (!description || !amount || parseFloat(amount) <= 0) return;
    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0],
    };
    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    setDescription('');
    setAmount('');
    setCategory(categories[0]);
    setIsModalOpen(false);
  };
  
  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent }: any) => {
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="var(--text-secondary)"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Expenses Tracker</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-accent hover:bg-accent-hover text-accent-text font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Expense
        </button>
      </div>

      <div className="bg-secondary p-4 rounded-lg mb-6 flex items-center gap-4 flex-wrap">
        <span className="font-semibold text-text-primary">Filter by date:</span>
        <div>
            <label htmlFor="startDate" className="text-text-secondary mr-2">From</label>
            <input 
                id="startDate"
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)}
                className="bg-tertiary text-text-primary p-2 rounded-md border border-border-color focus:outline-none focus:ring-2 focus:ring-accent"
            />
        </div>
        <div>
            <label htmlFor="endDate" className="text-text-secondary mr-2">To</label>
            <input 
                id="endDate"
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)}
                className="bg-tertiary text-text-primary p-2 rounded-md border border-border-color focus:outline-none focus:ring-2 focus:ring-accent"
            />
        </div>
        {(startDate || endDate) && (
            <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="bg-tertiary hover:bg-danger text-text-secondary hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
                Clear
            </button>
        )}
    </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-secondary p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Recent Expenses</h3>
          <div className="overflow-auto max-h-[400px]">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-secondary">
                <tr>
                  <th className="p-2">Description</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Date</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map(exp => (
                  <tr key={exp.id} className="border-b border-border-color hover:bg-tertiary/50">
                    <td className="p-2">{exp.description}</td>
                    <td className="p-2 text-danger">-${exp.amount.toFixed(2)}</td>
                    <td className="p-2">{exp.category}</td>
                    <td className="p-2 text-text-secondary">{exp.date}</td>
                    <td className="p-2 text-right">
                       <button onClick={() => handleDeleteExpense(exp.id)} className="text-text-secondary hover:text-danger">
                         <TrashIcon className="w-4 h-4"/>
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-secondary p-6 rounded-lg flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Summary</h3>
            <div className="mb-4">
                <p className="text-text-secondary">Total Expenses</p>
                <p className="text-3xl font-bold text-danger">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="flex-grow min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                    <Pie 
                      data={dataForChart} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={80} 
                      fill="#8884d8"
                      labelLine={false}
                      label={renderCustomizedLabel}
                    >
                        {dataForChart.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }} />
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Expense">
        <div className="space-y-4">
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full bg-tertiary text-text-primary p-2 rounded-md border border-border-color focus:outline-none focus:ring-2 focus:ring-accent" />
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="w-full bg-tertiary text-text-primary p-2 rounded-md border border-border-color focus:outline-none focus:ring-2 focus:ring-accent" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-tertiary text-text-primary p-2 rounded-md border border-border-color focus:outline-none focus:ring-2 focus:ring-accent">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button onClick={handleAddExpense} className="w-full bg-accent hover:bg-accent-hover text-accent-text font-semibold py-2 px-4 rounded-lg transition-colors">Add Expense</button>
        </div>
      </Modal>
    </div>
  );
};

export default ExpensesTracker;