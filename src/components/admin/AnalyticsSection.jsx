import React from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Calendar, TrendingUp, DollarSign, ArrowRight, BarChart2 } from 'lucide-react';

export const AnalyticsSection = ({ revenueData, onOpenReportModal }) => {
  const reportCards = [
    {
      id: 'daily',
      title: 'Daily Report',
      subtitle: 'View today transactions & revenue',
      icon: Calendar,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.15)',
      action: 'day_business'
    },
    {
      id: 'monthly',
      title: 'Monthly Report',
      subtitle: 'Monthly sales metrics & volume',
      icon: Calendar,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.15)',
      action: 'monthly_business'
    },
    {
      id: 'yearly',
      title: 'Yearly Report',
      subtitle: 'Annual business growth & targets',
      icon: TrendingUp,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.15)',
      action: 'yearly_business'
    },
    {
      id: 'overall',
      title: 'Overall Revenue Report',
      subtitle: 'Lifetime revenue since inception',
      icon: DollarSign,
      color: '#A78BFA',
      bg: 'rgba(167, 139, 250, 0.15)',
      action: 'overall_business'
    }
  ];

  // Chart Data
  const monthlyRevenueChartData = [
    { month: 'Jan', revenue: 14200, orders: 25 },
    { month: 'Feb', revenue: 18500, orders: 30 },
    { month: 'Mar', revenue: 22100, orders: 38 },
    { month: 'Apr', revenue: 19800, orders: 34 },
    { month: 'May', revenue: 27500, orders: 48 },
    { month: 'Jun', revenue: 31200, orders: 55 },
    { month: 'Jul', revenue: 28900, orders: 50 },
    { month: 'Aug', revenue: revenueData?.monthly?.totalRevenue || 12850.50, orders: revenueData?.monthly?.totalOrders || 32 }
  ];

  const dailySalesChartData = [
    { day: 'Mon', sales: 1200 },
    { day: 'Tue', sales: 1900 },
    { day: 'Wed', sales: 1400 },
    { day: 'Thu', sales: 2300 },
    { day: 'Fri', sales: 2800 },
    { day: 'Sat', sales: 3400 },
    { day: 'Sun (Today)', sales: revenueData?.daily?.totalRevenue || 1450 }
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📊 Business Analytics</span>
        </h2>
        <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: '4px 0 0 0' }}>
          Financial reports, revenue breakdown, and visual analytics
        </p>
      </div>

      {/* 4 Report Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {reportCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onOpenReportModal && onOpenReportModal(card.action)}
              style={{
                backgroundColor: '#1E293B',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '140px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#273549';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = `${card.color}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E293B';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: card.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={22} color={card.color} />
                </div>
                <div style={{ color: card.color, opacity: 0.8 }}>
                  <ArrowRight size={16} />
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
                  {card.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts inside this section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
        gap: '20px'
      }}>
        {/* CHART 1: Monthly Revenue Trend */}
        <div style={{
          backgroundColor: '#1E293B',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={18} color="#3B82F6" />
              <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#FFFFFF' }}>Monthly Revenue Trend</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
              +24% vs Prev Year
            </span>
          </div>

          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Daily Sales Bar Chart */}
        <div style={{
          backgroundColor: '#1E293B',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#10B981" />
              <span style={{ fontWeight: 700, fontSize: '0.98rem', color: '#FFFFFF' }}>Daily Sales (This Week)</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#3B82F6', background: 'rgba(59, 130, 246, 0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
              Peak: Sat (₹3.4k)
            </span>
          </div>

          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySalesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF' }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Sales']}
                />
                <Bar dataKey="sales" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
