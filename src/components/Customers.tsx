import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, MapPin, Phone, Mail, User, Calendar } from "lucide-react";
import { useState } from "react";

const customers = [
  {
    id: 1,
    name: "ABC Corporation",
    contact: "James Wilson",
    email: "james@abccorp.com",
    phone: "+1 (555) 111-2222",
    address: "123 Business St, Downtown",
    registeredBy: "John Smith",
    registrationDate: "2024-01-15",
    registrationLocation: { lat: 40.7128, lng: -74.0060 },
    lastVisit: "2024-01-20",
    status: "active",
  },
  {
    id: 2,
    name: "XYZ Ltd",
    contact: "Maria Garcia",
    email: "maria@xyzltd.com",
    phone: "+1 (555) 222-3333",
    address: "456 Commerce Ave, Business Park",
    registeredBy: "Sarah Johnson",
    registrationDate: "2024-01-18",
    registrationLocation: { lat: 40.7589, lng: -73.9851 },
    lastVisit: "2024-01-21",
    status: "active",
  },
  {
    id: 3,
    name: "Tech Solutions Inc",
    contact: "Robert Chen",
    email: "robert@techsol.com",
    phone: "+1 (555) 333-4444",
    address: "789 Innovation Blvd, Tech Hub",
    registeredBy: "Emily Davis",
    registrationDate: "2024-01-12",
    registrationLocation: { lat: 40.7831, lng: -73.9712 },
    lastVisit: "2024-01-19",
    status: "active",
  },
  {
    id: 4,
    name: "Global Enterprises",
    contact: "Lisa Thompson",
    email: "lisa@globalent.com",
    phone: "+1 (555) 444-5555",
    address: "321 Corporate Plaza, Financial District",
    registeredBy: "Mike Wilson",
    registrationDate: "2024-01-10",
    registrationLocation: { lat: 40.7074, lng: -74.0113 },
    lastVisit: "2024-01-17",
    status: "inactive",
  },
];

export function Customers() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.registeredBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Database</h2>
          <p className="text-muted-foreground">Manage customer information and registration locations</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {customers.filter(c => c.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  {customers.filter(c => new Date(c.registrationDate) >= new Date('2024-01-01')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg per Employee</p>
                <p className="text-2xl font-bold">25</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Info</TableHead>
                <TableHead>Contact Details</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {customer.contact}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">By: {customer.registeredBy}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {customer.registrationDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">{customer.address}</span>
                      </div>
                      <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                        View on Map
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Visits
                      </Button>
                    </div>
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