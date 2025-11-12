"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Data de ejemplo para gráficos
const revenueData = [
  { time: "00:00", value: 4000 },
  { time: "04:00", value: 3000 },
  { time: "08:00", value: 5000 },
  { time: "12:00", value: 4500 },
  { time: "16:00", value: 6000 },
  { time: "20:00", value: 5500 },
  { time: "24:00", value: 7000 },
]

const trafficData = [
  { time: "00:00", visitors: 2400, pageviews: 4000 },
  { time: "04:00", visitors: 1398, pageviews: 3000 },
  { time: "08:00", visitors: 3800, pageviews: 5000 },
  { time: "12:00", visitors: 3908, pageviews: 4500 },
  { time: "16:00", visitors: 4800, pageviews: 6000 },
  { time: "20:00", visitors: 3800, pageviews: 5500 },
  { time: "24:00", visitors: 4300, pageviews: 7000 },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center px-6">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <div className="ml-auto flex items-center gap-4">
            <select className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground">
              <option>Last 12 hours</option>
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$45,231.89</div>
              <p className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500">+20.1%</span>
                <span className="ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">+2,350</div>
              <p className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500">+180.1%</span>
                <span className="ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12.5%</div>
              <p className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-emerald-500">+4.3%</span>
                <span className="ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Response Time</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">573ms</div>
              <p className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-red-500">+12.3%</span>
                <span className="ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Revenue Overview</CardTitle>
              <CardDescription>Daily revenue for the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--chart-1))"
                      fill="url(#colorValue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Traffic Analysis</CardTitle>
              <CardDescription>Visitors and pageviews over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  visitors: {
                    label: "Visitors",
                    color: "hsl(var(--chart-2))",
                  },
                  pageviews: {
                    label: "Pageviews",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="visitors" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                    <Line
                      type="monotone"
                      dataKey="pageviews"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription>Latest events and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "success", message: "New user registration", time: "2 minutes ago" },
                { type: "info", message: "Payment processed successfully", time: "15 minutes ago" },
                { type: "warning", message: "API rate limit approaching", time: "1 hour ago" },
                { type: "success", message: "Deployment completed", time: "2 hours ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-emerald-500"
                        : activity.type === "info"
                          ? "bg-blue-500"
                          : "bg-amber-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}