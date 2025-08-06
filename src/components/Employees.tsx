import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Search, MapPin, Phone, Mail, Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddEmployeeDialog } from "./AddEmployeeDialog";
import { toast } from "sonner@2.0.3";

interface EmployeesProps {
  onViewEmployee?: (employee: any) => void;
}

const initialEmployees = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    lastSeen: "2 hours ago",
    location: "Downtown District",
    customersAssigned: 24,
    visitsToday: 3,
    department: "Sales",
    position: "Sales Representative",
    joinDate: "2023-06-15",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+1 (555) 234-5678",
    status: "active",
    lastSeen: "30 minutes ago",
    location: "Business Park",
    customersAssigned: 31,
    visitsToday: 5,
    department: "Sales",
    position: "Senior Sales Rep",
    joinDate: "2023-03-20",
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike.w@company.com",
    phone: "+1 (555) 345-6789",
    status: "offline",
    lastSeen: "8 hours ago",
    location: "North Branch",
    customersAssigned: 18,
    visitsToday: 0,
    department: "Support",
    position: "Customer Support",
    joinDate: "2023-09-10",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.d@company.com",
    phone: "+1 (555) 456-7890",
    status: "active",
    lastSeen: "1 hour ago",
    location: "Tech Hub",
    customersAssigned: 27,
    visitsToday: 2,
    department: "Sales",
    position: "Sales Representative",
    joinDate: "2023-07-05",
  },
];

export function Employees({ onViewEmployee }: EmployeesProps) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge variant="secondary">Offline</Badge>
    );
  };

  const handleEmployeeAdded = (newEmployee: any) => {
    setEmployees(prev => [...prev, newEmployee]);
  };

  const handleViewEmployee = (employee: any) => {
    if (onViewEmployee) {
      onViewEmployee(employee);
    } else {
      // Fallback to modal view if no navigation handler
      setSelectedEmployee(employee);
      setViewDetailsOpen(true);
    }
  };

  const handleEditEmployee = (employee: any) => {
    toast.info(`Edit functionality for ${employee.name} would open here`);
  };

  const handleDeleteEmployee = (employee: any) => {
    if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
      setEmployees(prev => prev.filter(emp => emp.id !== employee.id));
      toast.success(`${employee.name} has been removed from the system`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Field Employees</h2>
          <p className="text-muted-foreground">Manage and monitor your field team</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <AddEmployeeDialog onEmployeeAdded={handleEmployeeAdded} />
        </div>
      </div>

      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Now</p>
                <p className="text-2xl font-bold text-green-600">
                  {employees.filter(e => e.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Visits Today</p>
                <p className="text-2xl font-bold">
                  {employees.reduce((sum, e) => sum + e.visitsToday, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Customers/Employee</p>
                <p className="text-2xl font-bold">
                  {Math.round(employees.reduce((sum, e) => sum + e.customersAssigned, 0) / employees.length)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Visits Today</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {employee.department} • {employee.position}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last seen: {employee.lastSeen}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        {employee.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3" />
                        {employee.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {employee.location}
                    </div>
                  </TableCell>
                  <TableCell>{employee.customersAssigned}</TableCell>
                  <TableCell>{employee.visitsToday}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewEmployee(employee)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEmployee(employee)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEmployee(employee)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Employee Details Modal (Fallback) */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedEmployee.name}</div>
                    <div><strong>Email:</strong> {selectedEmployee.email}</div>
                    <div><strong>Phone:</strong> {selectedEmployee.phone}</div>
                    <div><strong>Join Date:</strong> {selectedEmployee.joinDate}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Work Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Department:</strong> {selectedEmployee.department}</div>
                    <div><strong>Position:</strong> {selectedEmployee.position}</div>
                    <div><strong>Status:</strong> {selectedEmployee.status}</div>
                    <div><strong>Current Location:</strong> {selectedEmployee.location}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Performance Metrics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl font-bold">{selectedEmployee.customersAssigned}</div>
                      <div className="text-sm text-muted-foreground">Customers Assigned</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl font-bold">{selectedEmployee.visitsToday}</div>
                      <div className="text-sm text-muted-foreground">Visits Today</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl font-bold">94%</div>
                      <div className="text-sm text-muted-foreground">Attendance Rate</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}