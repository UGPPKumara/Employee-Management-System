import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Search, Plus, MapPin, Phone, Mail, User, Building, Clock, CalendarIcon, Filter, Calendar as CalendarPlus, Eye, Navigation, AlertCircle, ExternalLink } from "lucide-react";
import { format, addDays, isToday, isTomorrow, isThisWeek } from "date-fns";
import { toast } from "sonner";

interface EmployeeCustomersProps {
  employee: {
    id: number;
    name: string;
    email: string;
    department?: string;
    position?: string;
  };
}

interface CustomerLocation {
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
}

// Mock customer data generator based on employee ID and name
const generateCustomerData = (employeeId: number, employeeName: string) => {
  const baseCustomers = [
    {
      id: 1,
      name: "ABC Corporation",
      contact: "James Wilson",
      email: "james@abccorp.com",
      phone: "+1 (555) 111-2222",
      address: "123 Business St, Downtown",
      registrationDate: "2024-01-15",
      lastVisit: "2024-01-20",
      nextVisit: "2024-01-25",
      status: "active",
      notes: "Regular customer, interested in premium services",
      priority: "high",
      registrationLocation: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: "Recorded at: 123 Business St, Downtown, NY",
        timestamp: "2024-01-15 10:30:00"
      },
      addedBy: "John Smith",
      addedById: 1,
    },
    {
      id: 2,
      name: "Tech Solutions Inc",
      contact: "Robert Chen",
      email: "robert@techsol.com",
      phone: "+1 (555) 333-4444",
      address: "789 Innovation Blvd, Tech Hub",
      registrationDate: "2024-01-12",
      lastVisit: "2024-01-19",
      nextVisit: "2024-01-24",
      status: "active",
      notes: "Tech-savvy client, prefers digital communications",
      priority: "medium",
      registrationLocation: {
        latitude: 40.7500,
        longitude: -73.9857,
        address: "Recorded at: 789 Innovation Blvd, Tech Hub, NY",
        timestamp: "2024-01-12 14:15:00"
      },
      addedBy: "Sarah Johnson",
      addedById: 2,
    },
    {
      id: 3,
      name: "Local Store Ltd",
      contact: "Maria Garcia",
      email: "maria@localstore.com",
      phone: "+1 (555) 222-3333",
      address: "456 Commerce Ave, Business Park",
      registrationDate: "2024-01-18",
      lastVisit: "2024-01-21",
      nextVisit: "2024-01-26",
      status: "active",
      notes: "Small business, looking for cost-effective solutions",
      priority: "low",
      registrationLocation: {
        latitude: 40.7300,
        longitude: -73.9950,
        address: "Recorded at: 456 Commerce Ave, Business Park, NY",
        timestamp: "2024-01-18 11:45:00"
      },
      addedBy: "Emily Davis",
      addedById: 4,
    },
  ];

  // Vary customer data based on employee ID
  return baseCustomers.map(customer => ({
    ...customer,
    id: customer.id + (employeeId * 1000), // Ensure unique IDs
    name: employeeId === 2 ? `${customer.name} - Branch B` : customer.name,
    address: employeeId === 2 ? customer.address.replace("Downtown", "Business Park") : 
             employeeId === 3 ? customer.address.replace("Downtown", "North Branch") :
             employeeId === 4 ? customer.address.replace("Downtown", "Tech Hub") : customer.address,
    nextVisit: format(addDays(new Date(), Math.floor(Math.random() * 7)), "yyyy-MM-dd"),
    addedById: employeeId,
    addedBy: employeeName,
  }));
};

export function EmployeeCustomers({ employee }: EmployeeCustomersProps) {
  const [customers, setCustomers] = useState(generateCustomerData(employee.id, employee.name));
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [viewCustomerOpen, setViewCustomerOpen] = useState(false);
  const [logVisitOpen, setLogVisitOpen] = useState(false);
  const [scheduleVisitOpen, setScheduleVisitOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<CustomerLocation | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isPermissionsPolicyError, setIsPermissionsPolicyError] = useState(false);
  
  // Check if this is the actual logged-in user or just viewing
  const isOwnCustomers = !employee.department; // Employee view doesn't have department info
  
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    priority: "medium",
  });

  const [visitData, setVisitData] = useState({
    purpose: "",
    duration: "",
    notes: "",
  });

  const [scheduleData, setScheduleData] = useState({
    date: undefined as Date | undefined,
    time: "",
    purpose: "",
    notes: "",
  });

  // Get current location on component mount
  useEffect(() => {
    if (isOwnCustomers) {
      getCurrentLocation();
    }
  }, [isOwnCustomers]);

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);
    setIsPermissionsPolicyError(false);
    
    // Check if geolocation is supported
    if (!('geolocation' in navigator)) {
      console.warn('Geolocation not supported by this browser');
      setLocationError("Geolocation not supported by browser");
      setCurrentLocation({
        latitude: 40.7128,
        longitude: -74.0060,
        address: "Recorded at: Geolocation not supported by browser",
        timestamp: new Date().toISOString(),
      });
      setIsGettingLocation(false);
      return;
    }

    // Check permissions before attempting to get location
    try {
      const permission = await navigator.permissions.query({name: 'geolocation'});
      if (permission.state === 'denied') {
        console.warn('Geolocation permission denied');
        setLocationError("Location access denied by user");
        setCurrentLocation({
          latitude: 40.7128,
          longitude: -74.0060,
          address: "Recorded at: Location access denied - using fallback",
          timestamp: new Date().toISOString(),
        });
        setIsGettingLocation(false);
        return;
      }
    } catch (permissionError) {
      // Permissions API might not be available, continue with geolocation attempt
      console.warn('Could not check geolocation permissions:', permissionError);
    }

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Mock reverse geocoding (in real app, use Google Maps API or similar)
            const address = `Recorded at: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} - Current Location`;
            
            const locationData: CustomerLocation = {
              latitude,
              longitude,
              address,
              timestamp: new Date().toISOString(),
            };
            
            setCurrentLocation(locationData);
            setIsGettingLocation(false);
          } catch (processError) {
            console.error('Error processing location data:', processError);
            setLocationError("Error processing location data");
            setCurrentLocation({
              latitude: 40.7128,
              longitude: -74.0060,
              address: "Recorded at: Error processing location data",
              timestamp: new Date().toISOString(),
            });
            setIsGettingLocation(false);
          }
        },
          (error) => {
            let errorMessage = "Location access denied or unavailable";
            let errorDetails = "";
            
            if (error && typeof error === 'object') {
              // Check for permissions policy specific error
              if (error.message && error.message.includes("permissions policy")) {
                errorMessage = "Location disabled by browser security";
                errorDetails = "Geolocation has been disabled by browser permissions policy. This may occur in embedded contexts or with strict security settings.";
                setIsPermissionsPolicyError(true);
                // Show a user-friendly toast message for this specific error
                setTimeout(() => {
                  toast.error("Location access restricted by browser security. App will use fallback location for customer registration.", {
                    duration: 5000,
                  });
                }, 100);
              } else {
                switch (error.code) {
                  case 1: // PERMISSION_DENIED
                    errorMessage = "Location access denied by user";
                    errorDetails = "User denied the request for location access";
                    break;
                  case 2: // POSITION_UNAVAILABLE
                    errorMessage = "Location information unavailable";
                    errorDetails = "Location information is unavailable";
                    break;
                  case 3: // TIMEOUT
                    errorMessage = "Location request timed out";
                    errorDetails = "The request to get user location timed out";
                    break;
                  default:
                    errorMessage = "Location service error";
                    errorDetails = error.message || "Unknown geolocation error occurred";
                    break;
                }
              }
              console.error('Geolocation error:', {
                code: error.code,
                message: error.message,
                details: errorDetails
              });
            } else {
              errorDetails = "Failed to access geolocation services";
              console.error('Geolocation error: Invalid error object', error);
            }
            
            setLocationError(errorMessage);
            
            // Fallback to mock location with appropriate context
            const fallbackAddress = isPermissionsPolicyError 
              ? "Recorded at: Default Business Location (Location restricted)"
              : `Recorded at: Fallback location (${errorMessage})`;
            
            setCurrentLocation({
              latitude: 40.7128,
              longitude: -74.0060,
              address: fallbackAddress,
              timestamp: new Date().toISOString(),
            });
            setIsGettingLocation(false);
          },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } catch (error) {
      console.error('Location setup error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
      setLocationError("Failed to initialize location services");
      setIsGettingLocation(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || customer.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const upcomingVisits = customers.filter(customer => {
    const visitDate = new Date(customer.nextVisit);
    return isToday(visitDate) || isTomorrow(visitDate) || isThisWeek(visitDate);
  }).sort((a, b) => new Date(a.nextVisit).getTime() - new Date(b.nextVisit).getTime());

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOwnCustomers) {
      toast.error("You can only add customers to your own account");
      return;
    }

    if (!currentLocation) {
      toast.error("Location not available. Please try again.");
      return;
    }
    
    // Create customer with location data
    const newCustomerData = {
      id: Date.now(),
      ...newCustomer,
      registrationDate: new Date().toISOString().split('T')[0],
      lastVisit: "Never",
      nextVisit: format(addDays(new Date(), 7), "yyyy-MM-dd"),
      status: "active",
      registrationLocation: currentLocation,
      addedBy: employee.name,
      addedById: employee.id,
    };

    setCustomers(prev => [...prev, newCustomerData]);
    toast.success(`Customer added successfully! Location recorded: ${currentLocation.address}`);
    
    // Reset form
    setNewCustomer({
      name: "",
      contact: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
      priority: "medium",
    });
    setAddCustomerOpen(false);
  };

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setViewCustomerOpen(true);
  };

  const handleLogVisit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOwnCustomers) {
      toast.error("You can only log visits for your own customers");
      return;
    }
    
    if (selectedCustomer) {
      // Update customer's last visit
      setCustomers(prev => prev.map(customer => 
        customer.id === selectedCustomer.id 
          ? { ...customer, lastVisit: new Date().toISOString().split('T')[0] }
          : customer
      ));
      
      toast.success("Visit logged successfully!");
      
      // Reset form
      setVisitData({
        purpose: "",
        duration: "",
        notes: "",
      });
      setLogVisitOpen(false);
      setSelectedCustomer(null);
    }
  };

  const handleScheduleVisit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOwnCustomers) {
      toast.error("You can only schedule visits for your own customers");
      return;
    }
    
    if (selectedCustomer && scheduleData.date) {
      // Update customer's next visit
      setCustomers(prev => prev.map(customer => 
        customer.id === selectedCustomer.id 
          ? { ...customer, nextVisit: format(scheduleData.date!, "yyyy-MM-dd") }
          : customer
      ));
      
      toast.success("Visit scheduled successfully!");
      
      // Reset form
      setScheduleData({
        date: undefined,
        time: "",
        purpose: "",
        notes: "",
      });
      setScheduleVisitOpen(false);
      setSelectedCustomer(null);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getNextVisitBadge = (nextVisit: string) => {
    const visitDate = new Date(nextVisit);
    if (isToday(visitDate)) {
      return <Badge className="bg-red-100 text-red-800">Today</Badge>;
    } else if (isTomorrow(visitDate)) {
      return <Badge className="bg-orange-100 text-orange-800">Tomorrow</Badge>;
    } else if (isThisWeek(visitDate)) {
      return <Badge className="bg-yellow-100 text-yellow-800">This Week</Badge>;
    }
    return <Badge variant="outline">{format(visitDate, "MMM dd")}</Badge>;
  };

  const getPageTitle = () => {
    if (isOwnCustomers) {
      return "My Customers";
    }
    return `${employee.name}'s Customers`;
  };

  const getPageDescription = () => {
    if (isOwnCustomers) {
      return "Manage your assigned customers and schedule visits";
    }
    return `View customer information and visit history for ${employee.name}`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {!isOwnCustomers && (
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full shrink-0">
              <User className="h-6 w-6 text-primary" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold">{getPageTitle()}</h2>
            <p className="text-muted-foreground">{getPageDescription()}</p>
            {!isOwnCustomers && employee.department && (
              <p className="text-sm text-muted-foreground">
                {employee.department} • {employee.position}
              </p>
            )}
            {!isOwnCustomers && (
              <p className="text-xs text-muted-foreground mt-1">
                Admin View - Read Only
              </p>
            )}
          </div>
        </div>

        {/* Location Status for Employees */}
        {isOwnCustomers && (
          <Card className={locationError ? (isPermissionsPolicyError ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50") : "border-blue-200 bg-blue-50"}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Navigation className={`h-5 w-5 mt-0.5 shrink-0 ${locationError ? (isPermissionsPolicyError ? "text-red-600" : "text-yellow-600") : "text-blue-600"}`} />
                <div className="min-w-0 flex-1">
                  <div className={`font-medium ${locationError ? (isPermissionsPolicyError ? "text-red-800" : "text-yellow-800") : "text-blue-800"}`}>
                    {isGettingLocation ? "Getting location..." : 
                     isPermissionsPolicyError ? "Location blocked by browser security" :
                     locationError ? "Location issue - using fallback" :
                     "Location tracking active - customers will be tagged with current location"}
                  </div>
                  {currentLocation && (
                    <div className={`text-xs mt-1 ${locationError ? (isPermissionsPolicyError ? "text-red-700" : "text-yellow-700") : "text-blue-700"}`}>
                      {currentLocation.address}
                    </div>
                  )}
                  {isPermissionsPolicyError && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-start gap-2 p-2 bg-red-100 rounded border border-red-200">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                        <div className="text-xs text-red-800">
                          <div className="font-medium mb-1">Location Access Restricted</div>
                          <div className="space-y-1">
                            <div>• This app is running in a restricted environment</div>
                            <div>• Location features will use fallback coordinates</div>
                            <div>• For full location tracking, open this app in a new browser tab</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {locationError && !isPermissionsPolicyError && (
                    <div className="text-xs text-yellow-700 mt-1">
                      Error: {locationError}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Add Customer Dialog - Only for own customers */}
            {isOwnCustomers && (
              <Dialog open={addCustomerOpen} onOpenChange={setAddCustomerOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="flex items-center gap-2 shrink-0"
                    disabled={isGettingLocation || !currentLocation}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Customer</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>
                      Add a new customer to your account. Location will be automatically recorded for tracking purposes.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleAddCustomer} className="space-y-4">
                    {currentLocation && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-800 font-medium">Location will be recorded</span>
                        </div>
                        <div className="text-xs text-blue-700 mt-1">
                          {currentLocation.address}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="customerName">Company Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="customerName"
                          placeholder="Enter company name"
                          value={newCustomer.name}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="contactPerson"
                          placeholder="Enter contact person name"
                          value={newCustomer.contact}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, contact: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="customerEmail"
                          type="email"
                          placeholder="Enter email address"
                          value={newCustomer.email}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="customerPhone"
                          placeholder="Enter phone number"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerAddress">Customer Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="customerAddress"
                          placeholder="Enter customer's business address"
                          value={newCustomer.address}
                          onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newCustomer.priority} onValueChange={(value) => setNewCustomer(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerNotes">Notes</Label>
                      <Textarea
                        id="customerNotes"
                        placeholder="Additional notes about the customer"
                        value={newCustomer.notes}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, notes: e.target.value }))}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setAddCustomerOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1" disabled={!currentLocation}>
                        Add Customer
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Visits Alert */}
      {upcomingVisits.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">
                {upcomingVisits.length} upcoming visit{upcomingVisits.length > 1 ? 's' : ''} this week
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {upcomingVisits.slice(0, 3).map(customer => (
                <Badge key={customer.id} variant="outline" className="text-blue-700">
                  {customer.name} - {format(new Date(customer.nextVisit), "MMM dd")}
                </Badge>
              ))}
              {upcomingVisits.length > 3 && (
                <Badge variant="outline" className="text-blue-700">
                  +{upcomingVisits.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
                <p className="text-sm text-muted-foreground">Active Customers</p>
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
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-red-600">
                  {customers.filter(c => c.priority === "high").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week Visits</p>
                <p className="text-2xl font-bold text-blue-600">
                  {upcomingVisits.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Info</TableHead>
                  <TableHead>Contact Details</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Next Visit</TableHead>
                  <TableHead>Added By</TableHead>
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
                    <TableCell>{getPriorityBadge(customer.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {customer.lastVisit}
                      </div>
                    </TableCell>
                    <TableCell>{getNextVisitBadge(customer.nextVisit)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{customer.addedBy}</div>
                      <div className="text-xs text-muted-foreground">{customer.registrationDate}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {isOwnCustomers && (
                          <>
                            <Dialog open={scheduleVisitOpen} onOpenChange={setScheduleVisitOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedCustomer(customer)}
                                >
                                  <CalendarPlus className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Schedule Customer Visit</DialogTitle>
                                  <DialogDescription>
                                    Schedule a new visit for {selectedCustomer?.name || 'this customer'}.
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <form onSubmit={handleScheduleVisit} className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Visit Date</Label>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Button
                                          variant="outline"
                                          className="w-full justify-start text-left font-normal"
                                        >
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {scheduleData.date ? format(scheduleData.date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0">
                                        <Calendar
                                          mode="single"
                                          selected={scheduleData.date}
                                          onSelect={(date) => setScheduleData(prev => ({ ...prev, date }))}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="time">Visit Time</Label>
                                    <input
                                      id="time"
                                      type="time"
                                      value={scheduleData.time}
                                      onChange={(e) => setScheduleData(prev => ({ ...prev, time: e.target.value }))}
                                      className="w-full px-3 py-2 border rounded-md"
                                      required
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="visitPurpose">Visit Purpose</Label>
                                    <Select value={scheduleData.purpose} onValueChange={(value) => setScheduleData(prev => ({ ...prev, purpose: value }))} required>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select visit purpose" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="product-demo">Product Demo</SelectItem>
                                        <SelectItem value="support">Support Visit</SelectItem>
                                        <SelectItem value="follow-up">Follow-up</SelectItem>
                                        <SelectItem value="contract-renewal">Contract Renewal</SelectItem>
                                        <SelectItem value="new-meeting">New Client Meeting</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="visitScheduleNotes">Notes</Label>
                                    <Textarea
                                      id="visitScheduleNotes"
                                      placeholder="Additional notes for the visit"
                                      value={scheduleData.notes}
                                      onChange={(e) => setScheduleData(prev => ({ ...prev, notes: e.target.value }))}
                                    />
                                  </div>

                                  <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setScheduleVisitOpen(false)} className="flex-1">
                                      Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                      Schedule Visit
                                    </Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>

                            <Dialog open={logVisitOpen} onOpenChange={setLogVisitOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  onClick={() => setSelectedCustomer(customer)}
                                >
                                  Log Visit
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Log Customer Visit</DialogTitle>
                                  <DialogDescription>
                                    Record details about a completed visit with {selectedCustomer?.name || 'this customer'}.
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <form onSubmit={handleLogVisit} className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="purpose">Visit Purpose</Label>
                                    <Select value={visitData.purpose} onValueChange={(value) => setVisitData(prev => ({ ...prev, purpose: value }))} required>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select visit purpose" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="product-demo">Product Demo</SelectItem>
                                        <SelectItem value="support">Support Visit</SelectItem>
                                        <SelectItem value="follow-up">Follow-up</SelectItem>
                                        <SelectItem value="contract-renewal">Contract Renewal</SelectItem>
                                        <SelectItem value="new-meeting">New Client Meeting</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="duration">Visit Duration</Label>
                                    <Input
                                      id="duration"
                                      placeholder="e.g., 1 hour 30 minutes"
                                      value={visitData.duration}
                                      onChange={(e) => setVisitData(prev => ({ ...prev, duration: e.target.value }))}
                                      required
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label htmlFor="visitNotes">Visit Notes</Label>
                                    <Textarea
                                      id="visitNotes"
                                      placeholder="Describe the visit, outcomes, and next steps"
                                      value={visitData.notes}
                                      onChange={(e) => setVisitData(prev => ({ ...prev, notes: e.target.value }))}
                                      required
                                    />
                                  </div>

                                  <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setLogVisitOpen(false)} className="flex-1">
                                      Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                      Log Visit
                                    </Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Detail View Dialog */}
      <Dialog open={viewCustomerOpen} onOpenChange={setViewCustomerOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Complete information and registration details for {selectedCustomer?.name || 'this customer'}.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Company Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Company:</strong> {selectedCustomer.name}</div>
                    <div><strong>Contact Person:</strong> {selectedCustomer.contact}</div>
                    <div><strong>Email:</strong> {selectedCustomer.email}</div>
                    <div><strong>Phone:</strong> {selectedCustomer.phone}</div>
                    <div><strong>Address:</strong> {selectedCustomer.address}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Account Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Priority:</strong> {getPriorityBadge(selectedCustomer.priority)}</div>
                    <div><strong>Status:</strong> {getStatusBadge(selectedCustomer.status)}</div>
                    <div><strong>Registration Date:</strong> {selectedCustomer.registrationDate}</div>
                    <div><strong>Last Visit:</strong> {selectedCustomer.lastVisit}</div>
                    <div><strong>Next Visit:</strong> {selectedCustomer.nextVisit}</div>
                    <div><strong>Added By:</strong> {selectedCustomer.addedBy}</div>
                  </div>
                </div>
              </div>

              {selectedCustomer.registrationLocation && (
                <div>
                  <h3 className="font-medium mb-2">Registration Location</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <div className="text-sm">{selectedCustomer.registrationLocation.address}</div>
                        <div className="text-xs text-muted-foreground">
                          Coordinates: {selectedCustomer.registrationLocation.latitude.toFixed(6)}, {selectedCustomer.registrationLocation.longitude.toFixed(6)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Recorded: {new Date(selectedCustomer.registrationLocation.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedCustomer.notes && (
                <div>
                  <h3 className="font-medium mb-2">Notes</h3>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    {selectedCustomer.notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}