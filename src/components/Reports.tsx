import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Download, TrendingUp, Users, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { format, addDays } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const attendanceData = [
  { day: "Mon", present: 22, absent: 2, late: 1 },
  { day: "Tue", present: 24, absent: 0, late: 0 },
  { day: "Wed", present: 21, absent: 2, late: 2 },
  { day: "Thu", present: 23, absent: 1, late: 1 },
  { day: "Fri", present: 20, absent: 3, late: 2 },
  { day: "Sat", present: 18, absent: 5, late: 1 },
  { day: "Sun", present: 15, absent: 8, late: 2 },
];

const visitData = [
  { month: "Jan", visits: 186, newCustomers: 45 },
  { month: "Feb", visits: 204, newCustomers: 52 },
  { month: "Mar", visits: 218, newCustomers: 38 },
  { month: "Apr", visits: 195, newCustomers: 41 },
  { month: "May", visits: 232, newCustomers: 56 },
  { month: "Jun", visits: 248, newCustomers: 49 },
];

const employeePerformance = [
  { name: "John Smith", visits: 89, customers: 24, efficiency: 92 },
  { name: "Sarah Johnson", visits: 94, customers: 31, efficiency: 88 },
  { name: "Emily Davis", visits: 76, customers: 27, efficiency: 85 },
  { name: "Mike Wilson", visits: 68, customers: 18, efficiency: 79 },
];

const purposeData = [
  { name: "Product Demo", value: 35, fill: "#0088FE" },
  { name: "Support Visit", value: 28, fill: "#00C49F" },
  { name: "Follow-up", value: 22, fill: "#FFBB28" },
  { name: "Contract Renewal", value: 15, fill: "#FF8042" },
];

export function Reports() {
  const [reportType, setReportType] = useState("attendance");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const handleExport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting ${reportType} report as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-muted-foreground">Generate comprehensive reports on attendance and activities</p>
        </div>
        <div className="flex gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attendance">Attendance Report</SelectItem>
              <SelectItem value="visits">Visit Report</SelectItem>
              <SelectItem value="performance">Performance Report</SelectItem>
              <SelectItem value="customers">Customer Report</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => range && setDateRange(range)}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-green-600">+2 this month</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Attendance</p>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-xs text-green-600">+3% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Visits</p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-green-600">+89 this week</p>
              </div>
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Visit Duration</p>
                <p className="text-2xl font-bold">52m</p>
                <p className="text-xs text-yellow-600">-3m from last month</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" stackId="a" fill="#22c55e" name="Present" />
                <Bar dataKey="late" stackId="a" fill="#eab308" name="Late" />
                <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Visit Purpose Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Visit Purpose Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={purposeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {purposeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Visits Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Visits & New Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#2563eb" strokeWidth={2} name="Total Visits" />
                <Line type="monotone" dataKey="newCustomers" stroke="#dc2626" strokeWidth={2} name="New Customers" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employee Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeePerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="visits" fill="#3b82f6" name="Visits" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => handleExport("pdf")} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export as PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport("excel")} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export as Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport("csv")} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export as CSV
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Export comprehensive reports including attendance records, visit logs, employee performance metrics, and customer data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}