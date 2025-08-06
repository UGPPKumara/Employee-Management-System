import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { User, Lock, Building } from "lucide-react";

interface LoginProps {
  onLogin: (user: { id: number; name: string; email: string; role: string }) => void;
}

// Mock users for demonstration
const mockUsers = [
  { id: 1, email: "admin@company.com", password: "admin123", name: "Admin User", role: "admin" },
  { id: 2, email: "john.smith@company.com", password: "john123", name: "John Smith", role: "employee" },
  { id: 3, email: "sarah.j@company.com", password: "sarah123", name: "Sarah Johnson", role: "employee" },
  { id: 4, email: "emily.d@company.com", password: "emily123", name: "Emily Davis", role: "employee" },
  { id: 5, email: "mike.w@company.com", password: "mike123", name: "Mike Wilson", role: "employee" },
];

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(
        u => u.email === email && u.password === password && u.role === role
      );

      if (user) {
        onLogin(user);
      } else {
        setError("Invalid credentials. Please check your email, password, and role.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (demoRole: string) => {
    const demoUser = mockUsers.find(u => u.role === demoRole);
    if (demoUser) {
      setEmail(demoUser.email);
      setPassword(demoUser.password);
      setRole(demoUser.role);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-full">
              <Building className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management System</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-3">Demo Accounts:</p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin("admin")}
                  className="w-full text-left justify-start"
                >
                  Admin: admin@company.com / admin123
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin("employee")}
                  className="w-full text-left justify-start"
                >
                  Employee: john.smith@company.com / john123
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}