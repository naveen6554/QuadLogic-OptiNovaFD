import React from 'react';
import { SummaryCards } from './SummaryCards';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, Users, Package, Eye } from 'lucide-react';

export const DashboardHomeView = ({ 
  totalProductsCount, 
  totalUsersCount, 
  todayOrdersCount, 
  totalRevenueAmount,
  salesOrders,
  onViewOrderDetails
}) => {
  const monthlyRevenueChartData = [
    { month: 'Jan', revenue: 14200 },
    { month: 'Feb', revenue: 18500 },
    { month: 'Mar', revenue: 22100 },
    { month: 'Apr', revenue: 19800 },
    { month: 'May', revenue: 27500 },
    { month: 'Jun', revenue: 31200 },
    { month: 'Jul', revenue: 28900 },
    { month: 'Aug', revenue: totalRevenueAmount || 145900.75 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
          Dashboard Overview
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
          Welcome back to the OptiNova Enterprise Admin Portal
        </p>
      </div>

      {/* 1. Summary Cards */}
      <SummaryCards
        totalProductsCount={totalProductsCount}
        totalUsersCount={totalUsersCount}
        todayOrdersCount={todayOrdersCount}
        totalRevenueAmount={totalRevenueAmount}
      />

      {/* 2 & 3. Revenue Chart & Order Statistics Side-by-Side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px'
      }}>
        {/* 2. Revenue Chart */}
        <div style={{
          backgroundColor: '#1E293B',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Revenue Growth Trend
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Financial sales metrics (2026)</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
              +24% Growth
            </span>
          </div>

          <div style={{ width: '100%', height: '230px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF' }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#dashboardRevenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Order Statistics */}
        <div style={{
          backgroundColor: '#1E293B',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px 0' }}>
            Order Statistics
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Total Fulfilled</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>380 Orders</div>
            </div>

            <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Pending Dispatch</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>4 Orders</div>
            </div>

            <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Avg. Order Value</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3B82F6', marginTop: '4px' }}>₹4,850</div>
            </div>

            <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Return Rate</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#A78BFA', marginTop: '4px' }}>0.4%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Latest Sales Summary Table */}
      <div style={{
        backgroundColor: '#1E293B',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Latest Sales Summary
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Recent transaction records</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Order ID</th>
                <th style={{ padding: '12px 16px' }}>Customer</th>
                <th style={{ padding: '12px 16px' }}>Eyewear Product</th>
                <th style={{ padding: '12px 16px' }}>Amount</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {(salesOrders || []).slice(0, 5).map((ord, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#3B82F6' }}>{ord.orderId}</td>
                  <td style={{ padding: '12px 16px', color: '#FFFFFF', fontWeight: 600 }}>{ord.customerName}</td>
                  <td style={{ padding: '12px 16px', color: '#94A3B8' }}>{ord.name}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#10B981' }}>₹{ord.totalPrice?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                      Delivered
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#94A3B8', fontSize: '0.82rem' }}>{ord.orderDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Quick System Statistics */}
      <div style={{
        backgroundColor: '#1E293B',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 16px 0' }}>
          Quick Statistics
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>System Uptime</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>99.98%</div>
          </div>
          <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>API Latency</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3B82F6', marginTop: '4px' }}>42 ms</div>
          </div>
          <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Active Sessions</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>14 Active</div>
          </div>
          <div style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Database Health</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>Optimal</div>
          </div>
        </div>
      </div>
    </div>
  );
};
