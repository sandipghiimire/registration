'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../../Components/ui/card';
import { ArrowUp, ArrowDown, Users, Wallet, Briefcase, DollarSign } from 'lucide-react';

const monthlyData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const weeklySales = [
  { day: 'Mon', sales: 12 },
  { day: 'Tue', sales: 19 },
  { day: 'Wed', sales: 8 },
  { day: 'Thu', sales: 15 },
  { day: 'Fri', sales: 12 },
  { day: 'Sat', sales: 20 },
  { day: 'Sun', sales: 10 },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-white h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white hover:shadow-lg transition-shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">$45,231</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <ArrowUp className="h-4 w-4 text-green-600" />
            <span className="text-green-600 ml-1">+20.1%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </Card>

        {/* Repeat similar structure for other cards with bg-white */}

        <Card className="p-4 bg-white hover:shadow-lg transition-shadow border border-gray-200">
        <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-800">2,342</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <ArrowUp className="h-4 w-4 text-green-600" />
            <span className="text-green-600 ml-1">+15.2%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </Card>

        <Card className="p-4 bg-white hover:shadow-lg transition-shadow border border-gray-200">
        <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Organizations</p>
              <p className="text-2xl font-bold text-gray-800">1,023</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <ArrowDown className="h-4 w-4 text-red-600" />
            <span className="text-red-600 ml-1">-5.3%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </Card>

        <Card className="p-4 bg-white hover:shadow-lg transition-shadow border border-gray-200">
        <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-800">12,345</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-full">
              <Wallet className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-2 text-sm">
            <ArrowUp className="h-4 w-4 text-green-600" />
            <span className="text-green-600 ml-1">+10.4%</span>
            <span className="text-gray-500 ml-2">vs last month</span>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 bg-white border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Revenue Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4f46e5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Weekly Sales</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}