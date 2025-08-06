import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, MapPin, Clock, User, Building } from "lucide-react";
import { useState } from "react";

const visits = [
  {
    id: 1,
    employeeName: "John Smith",
    customerName: "ABC Corporation",
    contactPerson: "James Wilson",
    visitDate: "2024-01-22",
    visitTime: "10:30 AM",
    duration: "45 minutes",
    purpose: "Product Demo",
    location: "123 Business St, Downtown",
    status: "completed",
    notes: "Customer showed interest in our premium package. Follow-up scheduled for next week.",
  },
  {
    id: 2,
    employeeName: "Sarah Johnson",
    customerName: "XYZ Ltd",
    contactPerson: "Maria Garcia",
    visitDate: "2024-01-22",
    visitTime: "02:15 PM",
    duration: "1 hour 20 minutes",
    purpose: "Contract Renewal",
    location: "456 Commerce Ave, Business Park",
    status: "completed",
    notes: "Contract renewed for another year. Discussed additional services.",
  },
  {
    id: 3,
    employeeName: "Emily Davis",
    customerName: "Tech Solutions Inc",
    contactPerson: "Robert Chen",
    visitDate: "2024-01-22",
    visitTime: "11:00 AM",
    duration: "30 minutes",
    purpose: "Support Visit",
    location: "789 Innovation Blvd, Tech Hub",
    status: "completed",
    notes: "Resolved technical issues. Customer satisfied with support.",
  },
  {
    id: 4,
    employeeName: "John Smith",
    customerName: "Global Enterprises",
    contactPerson: "Lisa Thompson",
    visitDate: "2024-01-22",
    visitTime: "04:00 PM",
    duration: "25 minutes",
    purpose: "Follow-up",
    location: "321 Corporate Plaza, Financial District",
    status: "in-progress",
    notes: "Currently meeting with the client to discuss project updates.",
  },
  {
    id: 5,
    employeeName: "Mike Wilson",
    customerName: "StartUp Hub",
    contactPerson: "David Kim",
    visitDate: "2024-01-21",
    visitTime: "03:30 PM",
    duration: "1 hour 15 minutes",
    purpose: "New Client Meeting",
    location: "555 Innovation Drive, Startup District",
    status: "completed",
    notes: "New client onboarded. Setup complete and training provided.",
  },
];

const visitPurposes = ["Product Demo", "Contract Renewal", "Support Visit", "Follow-up", "New Client Meeting"];

export function Visits() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVisits = visits.filter(visit =>
    visit.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "scheduled":
        return <Badge className="bg-yellow-100 text-yellow-800">Scheduled</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const todayStats = {
    totalVisits: visits.filter(v => v.visitDate === "2024-01-22").length,
    completed: visits.filter(v => v.visitDate === "2024-01-22" && v.status === "completed").length,
    inProgress: visits.filter(v => v.visitDate === "2024-01-22" && v.status === "in-progress").length,
    avgDuration: "52 minutes",
  };

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Visits</h2>
          <p className="text-muted-foreground">Track field employee customer visits and activities</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search visits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Visit Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Visits</p>
                <p className="text-2xl font-bold">{todayStats.totalVisits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{todayStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{todayStats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
                <p className="text-2xl font-bold">{todayStats.avgDuration}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visit Table */}
      <Card>
        <CardHeader>
          <CardTitle>Visit Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Visit Details</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {visit.employeeName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {visit.customerName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Contact: {visit.contactPerson}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3" />
                        {visit.visitDate} at {visit.visitTime}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Duration: {visit.duration}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{visit.purpose}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-48">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate text-sm">{visit.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(visit.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}