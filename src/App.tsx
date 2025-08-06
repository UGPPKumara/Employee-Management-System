import { useState } from "react";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { Employees } from "./components/Employees";
import { Customers } from "./components/Customers";
import { Attendance } from "./components/Attendance";
import { Visits } from "./components/Visits";
import { Reports } from "./components/Reports";
import { EmployeeAttendance } from "./components/EmployeeAttendance";
import { EmployeeCustomers } from "./components/EmployeeCustomers";
import { AdminProfile } from "./components/AdminProfile";
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { LogOut, ArrowLeft, Settings, User, ChevronDown } from "lucide-react";
import { Toaster } from "./components/ui/sonner";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  lastSeen: string;
  location: string;
  customersAssigned: number;
  visitsToday: number;
  department: string;
  position: string;
  joinDate: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    // Set appropriate default tab based on role
    setActiveTab(userData.role === "admin" ? "dashboard" : "attendance");
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab("dashboard");
    setViewingEmployee(null);
  };

  const handleViewEmployee = (employee: Employee) => {
    setViewingEmployee(employee);
    setActiveTab("attendance"); // Default to attendance view for employee details
  };

  const handleBackToAdmin = () => {
    setViewingEmployee(null);
    setActiveTab("employees"); // Return to employees list
  };

  const handleProfileClick = () => {
    setViewingEmployee(null);
    setActiveTab("profile");
  };

  // If not logged in, show login page
  if (!user) {
    return (
      <div>
        <Login onLogin={handleLogin} />
        <Toaster />
      </div>
    );
  }

  // Admin view - full access to all modules
  const renderAdminContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "employees":
        return <Employees onViewEmployee={handleViewEmployee} />;
      case "customers":
        return <Customers />;
      case "attendance":
        return <Attendance />;
      case "visits":
        return <Visits />;
      case "reports":
        return <Reports />;
      case "profile":
        return <AdminProfile user={user} />;
      default:
        return <Dashboard />;
    }
  };

  // Employee detail view for admin
  const renderEmployeeDetailContent = () => {
    if (!viewingEmployee) return <Dashboard />;
    
    switch (activeTab) {
      case "attendance":
        return <EmployeeAttendance employee={viewingEmployee} />;
      case "customers":
        return <EmployeeCustomers employee={viewingEmployee} />;
      default:
        return <EmployeeAttendance employee={viewingEmployee} />;
    }
  };

  // Employee view - limited access to personal modules
  const renderEmployeeContent = () => {
    switch (activeTab) {
      case "attendance":
        return <EmployeeAttendance employee={user} />;
      case "customers":
        return <EmployeeCustomers employee={user} />;
      default:
        return <EmployeeAttendance employee={user} />;
    }
  };

  const getAvailableTabs = () => {
    if (user.role === "admin") {
      if (viewingEmployee) {
        // When viewing a specific employee, show only their tabs
        return [
          { id: "attendance", label: "Attendance" },
          { id: "customers", label: "Customers" },
        ];
      } else {
        // Normal admin tabs
        return [
          { id: "dashboard", label: "Dashboard" },
          { id: "employees", label: "Employees" },
          { id: "customers", label: "Customers" },
          { id: "attendance", label: "Attendance" },
          { id: "visits", label: "Visits" },
          { id: "reports", label: "Reports" },
          { id: "profile", label: "Profile" },
        ];
      }
    } else {
      return [
        { id: "attendance", label: "My Attendance" },
        { id: "customers", label: "My Customers" },
      ];
    }
  };

  const getHeaderTitle = () => {
    if (viewingEmployee) {
      return `${viewingEmployee.name} - Employee Details`;
    }
    return "Employee Management System";
  };

  const getHeaderSubtitle = () => {
    if (viewingEmployee) {
      return `${viewingEmployee.department} • ${viewingEmployee.position}`;
    }
    return `Welcome back, ${user.name}`;
  };

  const getUserInitials = () => {
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Responsive Header */}
      <div className="border-b bg-background px-4 lg:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {viewingEmployee && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackToAdmin} 
              className="hidden sm:flex items-center gap-2 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden md:inline">Back to Admin</span>
              <span className="md:hidden">Back</span>
            </Button>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold truncate">{getHeaderTitle()}</h1>
            <p className="text-sm text-muted-foreground hidden sm:block truncate">
              {getHeaderSubtitle()}
            </p>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 py-1.5">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                Signed in as {user.email}
              </div>
              <DropdownMenuSeparator />
              {user.role === "admin" && (
                <DropdownMenuItem onClick={handleProfileClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile & Settings</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        availableTabs={getAvailableTabs()}
        userRole={user.role}
        viewingEmployee={viewingEmployee}
      >
        {user.role === "admin" 
          ? (viewingEmployee ? renderEmployeeDetailContent() : renderAdminContent())
          : renderEmployeeContent()
        }
      </Layout>

      <Toaster />
    </div>
  );
}