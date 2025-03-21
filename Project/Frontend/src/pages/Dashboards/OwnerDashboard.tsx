import { useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { CalendarDays, Users, CreditCard, School, TrendingUp, ArrowUpRight, ArrowDownRight, Filter, Download, RefreshCw } from "lucide-react";

// Type definitions
type MetricValue = {
  value: number | string;
  change: number;
};

type Metrics = {
  schools: MetricValue;
  activeUsers: MetricValue;
  revenue: MetricValue;
  subscriptions: {
    free: number;
    paid: number;
    change: number;
  };
  retention: MetricValue;
  churn: MetricValue;
};

type School = {
  name: string;
  users: number;
  revenue: string;
  growth: number;
};

const OwnerDashboard = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [metrics] = useState<Metrics>({
    schools: { value: 120, change: 8.2 },
    activeUsers: { value: 4500, change: 12.3 },
    revenue: { value: "$12,300", change: 15.7 },
    subscriptions: { free: 30, paid: 90, change: 5.4 },
    retention: { value: "78%", change: 3.2 },
    churn: { value: "3.2%", change: -1.8 },
  });

  const userActivityData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Active Users",
        data: [3000, 3500, 4000, 4200, 4500, 4700],
        borderColor: "#facc15",
        backgroundColor: "rgba(250, 204, 21, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Revenue",
        data: [8200, 9400, 10500, 11200, 12300, 13100],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const featureUsageData = {
    labels: ["Attendance", "Fee Management", "Results", "Courses", "Reports", "Calendar"],
    datasets: [
      {
        label: "Usage Count",
        data: [1200, 950, 1100, 800, 750, 620],
        backgroundColor: [
          "#3b82f6", 
          "#8b5cf6", 
          "#ec4899", 
          "#f97316", 
          "#14b8a6",
          "#f59e0b"
        ],
        borderRadius: 6,
      },
    ],
  };

  const subscriptionData = {
    labels: ["Free", "Basic", "Premium", "Enterprise"],
    datasets: [
      {
        data: [30, 45, 35, 10],
        backgroundColor: ["#6b7280", "#3b82f6", "#8b5cf6", "#f97316"],
        borderWidth: 0,
      },
    ],
  };

  const userRetentionData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8"],
    datasets: [
      {
        label: "User Retention",
        data: [100, 86, 78, 72, 68, 65, 63, 60],
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const topSchools: School[] = [
    { name: "Springfield Academy", users: 245, revenue: "$2,400", growth: 12.3 },
    { name: "Westfield High", users: 198, revenue: "$1,850", growth: 8.7 },
    { name: "Lincoln Elementary", users: 176, revenue: "$1,620", growth: 10.2 },
    { name: "St. Mary's College", users: 152, revenue: "$1,490", growth: -2.1 },
    { name: "Tech Institute", users: 135, revenue: "$1,320", growth: 5.6 },
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  const handleDownload = () => {
    alert("Dashboard report downloading...");
  };

  // Fixed function with proper type annotations
  const renderMetricCard = (
    title: string, 
    value: string | number, 
    change: number, 
    icon: React.ReactNode
  ) => {
    const isPositive = change >= 0;
    return (
      <div className="p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 font-medium">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="bg-gray-700 p-2 rounded-lg">
            {icon}
          </div>
        </div>
        <div className="mt-2 flex items-center">
          {isPositive ? (
            <ArrowUpRight size={16} className="text-green-500 mr-1" />
          ) : (
            <ArrowDownRight size={16} className="text-red-500 mr-1" />
          )}
          <span className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {Math.abs(change)}% {isPositive ? "increase" : "decrease"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen">
      {/* Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-yellow-400">eduvance Owner Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-700 p-2 rounded-lg">
              <Filter size={16} />
              <select 
                className="bg-transparent border-none text-sm focus:outline-none"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="year">Last year</option>
              </select>
            </div>
            <button 
              className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              onClick={handleRefresh}
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button 
              className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              onClick={handleDownload}
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === "overview" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === "users" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === "revenue" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("revenue")}
          >
            Revenue
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === "features" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("features")}
          >
            Feature Usage
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === "schools" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("schools")}
          >
            Schools
          </button>
        </div>
        
        {/* Metrics Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {renderMetricCard("Schools", metrics.schools.value, metrics.schools.change, <School size={20} className="text-yellow-400" />)}
          {renderMetricCard("Active Users", metrics.activeUsers.value, metrics.activeUsers.change, <Users size={20} className="text-blue-400" />)}
          {renderMetricCard("Revenue", metrics.revenue.value, metrics.revenue.change, <CreditCard size={20} className="text-green-400" />)}
          {renderMetricCard("Subscriptions", metrics.subscriptions.paid + metrics.subscriptions.free, metrics.subscriptions.change, <CalendarDays size={20} className="text-purple-400" />)}
          {renderMetricCard("Retention", metrics.retention.value, metrics.retention.change, <TrendingUp size={20} className="text-pink-400" />)}
          {renderMetricCard("Churn Rate", metrics.churn.value, metrics.churn.change, <TrendingUp size={20} className="text-orange-400" />)}
        </div>
        
        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-yellow-300">Active Users Growth</h3>
              <div className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">+12.3% vs previous</div>
            </div>
            <Line 
              data={userActivityData} 
              options={{
                plugins: {
                  legend: {
                    display: false,
                  }
                },
                scales: {
                  y: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    }
                  },
                  x: {
                    grid: {
                      display: false,
                    }
                  }
                }
              }}
            />
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-300">Monthly Revenue</h3>
              <div className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">+15.7% vs previous</div>
            </div>
            <Line 
              data={revenueData}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  }
                },
                scales: {
                  y: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    }
                  },
                  x: {
                    grid: {
                      display: false,
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-300">Feature Usage Distribution</h3>
              <select className="text-xs bg-gray-700 border border-gray-600 rounded p-1">
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
                <option>Last Year</option>
              </select>
            </div>
            <Bar 
              data={featureUsageData}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  }
                },
                scales: {
                  y: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    }
                  },
                  x: {
                    grid: {
                      display: false,
                    }
                  }
                }
              }}
            />
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-purple-300">Subscription Tiers</h3>
              <div className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">+5.4% vs previous</div>
            </div>
            <div className="flex items-center">
              <div className="w-1/2">
                <Doughnut 
                  data={subscriptionData}
                  options={{
                    plugins: {
                      legend: {
                        position: 'right',
                      }
                    },
                    cutout: '70%',
                  }}
                />
              </div>
              <div className="w-1/2">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-600 rounded-full mr-2"></div>
                      <span className="text-sm">Free</span>
                    </div>
                    <span className="text-sm">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm">Basic</span>
                    </div>
                    <span className="text-sm">37.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      <span className="text-sm">Premium</span>
                    </div>
                    <span className="text-sm">29.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                      <span className="text-sm">Enterprise</span>
                    </div>
                    <span className="text-sm">8.3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 md:col-span-1">
            <h3 className="text-lg font-semibold text-yellow-300 mb-4">Top Performing Schools</h3>
            <div className="space-y-4">
              {topSchools.map((school, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-700 pb-2">
                  <div>
                    <p className="font-medium">{school.name}</p>
                    <p className="text-xs text-gray-400">{school.users} users</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{school.revenue}</p>
                    <p className={`text-xs ${school.growth >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {school.growth >= 0 ? "+" : ""}{school.growth}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors">
              View All Schools
            </button>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-purple-300">User Retention Curve</h3>
              <div className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">78% after 8 weeks</div>
            </div>
            <Line 
              data={userRetentionData}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  }
                },
                scales: {
                  y: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)',
                    },
                    min: 0,
                    max: 100,
                    ticks: {
                      callback: function(value) {
                        return value + '%';
                      }
                    }
                  },
                  x: {
                    grid: {
                      display: false,
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        {/* Insights Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
          <h3 className="text-lg font-semibold text-yellow-300 mb-4">Key Insights</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="font-medium text-blue-300 mb-2">User Engagement</h4>
              <p className="text-sm text-gray-300">Active users increased by 12.3% this month. The Attendance feature has the highest engagement among all features.</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="font-medium text-green-300 mb-2">Revenue Growth</h4>
              <p className="text-sm text-gray-300">Premium subscriptions grew by 8.2%, driving a 15.7% increase in monthly revenue compared to last period.</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="font-medium text-purple-300 mb-2">Retention Improvement</h4>
              <p className="text-sm text-gray-300">User retention at 8 weeks improved by 3.2%, likely due to the new onboarding flow implemented last month.</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            <p>Recommended actions: Focus on improving "Reports" feature usage which has the lowest engagement. Consider a targeted email campaign for users of "Fee Management" to boost adoption.</p>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors font-medium text-center">
            Schedule Email Campaign
          </button>
          <button className="p-4 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors font-medium text-center">
            View Feature Feedback
          </button>
          <button className="p-4 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors font-medium text-center">
            Analyze Conversion Funnel
          </button>
          <button className="p-4 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors font-medium text-center">
            Generate Monthly Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;