import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Fingerprint, Clock, MapPin, CalendarIcon, CheckCircle, XCircle, User, Plus, AlertTriangle } from "lucide-react";
import { format, addDays } from "date-fns";
import { toast } from "sonner@2.0.3";

interface EmployeeAttendanceProps {
  employee: {
    id: number;
    name: string;
    email: string;
    department?: string;
    position?: string;
  };
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  timestamp: string;
}

interface ManualAttendanceRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  adminNote?: string;
}

// Mock attendance data generator based on employee ID
const generateAttendanceData = (employeeId: number) => {
  const baseData = [
    {
      id: 1,
      date: "2024-01-22",
      checkIn: "08:45 AM",
      checkOut: "06:15 PM",
      workingHours: "9h 30m",
      status: "present",
      location: "Downtown District",
      checkInLocation: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: "123 Business St, Downtown, NY",
        timestamp: "2024-01-22 08:45:00"
      },
      fingerprintVerified: true,
      isManual: false,
    },
    {
      id: 2,
      date: "2024-01-21",
      checkIn: "08:50 AM",
      checkOut: "06:20 PM",
      workingHours: "9h 30m",
      status: "present",
      location: "Downtown District",
      checkInLocation: {
        latitude: 40.7130,
        longitude: -74.0058,
        address: "125 Business St, Downtown, NY",
        timestamp: "2024-01-21 08:50:00"
      },
      fingerprintVerified: true,
      isManual: false,
    },
    {
      id: 3,
      date: "2024-01-20",
      checkIn: "09:15 AM",
      checkOut: "05:30 PM",
      workingHours: "8h 15m",
      status: "late",
      location: "Downtown District",
      checkInLocation: {
        latitude: 40.7125,
        longitude: -74.0062,
        address: "121 Business St, Downtown, NY",
        timestamp: "2024-01-20 09:15:00"
      },
      fingerprintVerified: false,
      isManual: true,
      manualReason: "Fingerprint scanner was not working",
    },
  ];

  // Vary data slightly based on employee ID
  return baseData.map(record => ({
    ...record,
    id: record.id + (employeeId * 1000), // Ensure unique IDs
    checkIn: employeeId === 2 ? "09:00 AM" : record.checkIn,
    location: employeeId === 2 ? "Business Park" : employeeId === 3 ? "North Branch" : employeeId === 4 ? "Tech Hub" : record.location,
  }));
};

// Mock manual attendance requests
const generateManualRequests = (employeeId: number) => [
  {
    id: 1,
    employeeId: employeeId,
    employeeName: "Current Employee",
    date: "2024-01-23",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    reason: "Fingerprint scanner was malfunctioning",
    status: 'pending' as const,
    requestDate: "2024-01-23",
  }
];

export function EmployeeAttendance({ employee }: EmployeeAttendanceProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [attendanceRecords] = useState(generateAttendanceData(employee.id));
  const [manualRequests, setManualRequests] = useState(generateManualRequests(employee.id));
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [manualRequestOpen, setManualRequestOpen] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [manualRequestData, setManualRequestData] = useState({
    date: "",
    checkIn: "",
    checkOut: "",
    reason: "",
  });

  // Check if this is the actual logged-in user or just viewing
  const isOwnAttendance = !employee.department; // Employee view doesn't have department info

  // Get current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    
    // Check if geolocation is supported
    if (!('geolocation' in navigator)) {
      console.warn('Geolocation not supported by this browser');
      setCurrentLocation({
        latitude: 40.7128,
        longitude: -74.0060,
        address: "Geolocation not supported by browser",
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
        setCurrentLocation({
          latitude: 40.7128,
          longitude: -74.0060,
          address: "Location access denied - using fallback",
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
            const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)} - Business Area`;
            
            const locationData: LocationData = {
              latitude,
              longitude,
              address,
              timestamp: new Date().toISOString(),
            };
            
            setCurrentLocation(locationData);
            setIsGettingLocation(false);
          } catch (processError) {
            console.error('Error processing location data:', processError);
            setCurrentLocation({
              latitude: 40.7128,
              longitude: -74.0060,
              address: "Error processing location data",
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
                // Show a user-friendly toast message for this specific error
                setTimeout(() => {
                  toast.error("Location access restricted by browser security. App will use fallback location for tracking.", {
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
            
            // Fallback to mock location with appropriate context
            const fallbackAddress = error.message && error.message.includes("permissions policy")
              ? "Default Business Location (Location restricted)"
              : `Fallback location - ${errorMessage}`;
            
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
      setIsGettingLocation(false);
    }
  };
  
  const handleCheckIn = async () => {
    // Only allow check-in for the actual logged-in employee
    if (!isOwnAttendance) {
      toast.error("You can only check-in for your own account");
      return;
    }

    if (!currentLocation) {
      toast.error("Location not available. Please try again.");
      return;
    }
    
    toast.success(`Fingerprint verified! Checked in at ${currentLocation.address}`);
    setIsCheckedIn(true);
    
    // In a real app, this would save to backend with location data
    console.log('Check-in location:', currentLocation);
  };

  const handleCheckOut = () => {
    // Only allow check-out for the actual logged-in employee
    if (!isOwnAttendance) {
      toast.error("You can only check-out for your own account");
      return;
    }
    
    toast.success("You have been checked out successfully.");
    setIsCheckedIn(false);
  };

  const handleManualAttendanceRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOwnAttendance) {
      toast.error("You can only request manual attendance for your own account");
      return;
    }

    const newRequest: ManualAttendanceRequest = {
      id: Date.now(),
      employeeId: employee.id,
      employeeName: employee.name,
      ...manualRequestData,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0],
    };

    setManualRequests(prev => [...prev, newRequest]);
    toast.success("Manual attendance request submitted for admin approval");
    
    // Reset form
    setManualRequestData({
      date: "",
      checkIn: "",
      checkOut: "",
      reason: "",
    });
    setManualRequestOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case "late":
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>;
      case "absent":
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const todayRecord = attendanceRecords.find(r => r.date === format(new Date(), "yyyy-MM-dd"));
  const thisMonthStats = {
    totalDays: 22,
    present: attendanceRecords.filter(r => r.status === "present").length,
    late: attendanceRecords.filter(r => r.status === "late").length,
    absent: attendanceRecords.filter(r => r.status === "absent").length,
  };

  const pendingRequests = manualRequests.filter(req => req.status === 'pending');

  const getPageTitle = () => {
    if (isOwnAttendance) {
      return "My Attendance";
    }
    return `${employee.name}'s Attendance`;
  };

  const getPageDescription = () => {
    if (isOwnAttendance) {
      return "Track your attendance and working hours";
    }
    return `View attendance records and working hours for ${employee.name}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {!isOwnAttendance && (
          <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
            <User className="h-6 w-6 text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold">{getPageTitle()}</h2>
          <p className="text-muted-foreground">{getPageDescription()}</p>
          {!isOwnAttendance && employee.department && (
            <p className="text-sm text-muted-foreground">
              {employee.department} • {employee.position}
            </p>
          )}
        </div>
      </div>

      {/* Pending Manual Requests Alert */}
      {isOwnAttendance && pendingRequests.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">
                {pendingRequests.length} manual attendance request{pendingRequests.length > 1 ? 's' : ''} pending approval
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Check In/Out Card - Only show for own attendance */}
        {isOwnAttendance && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5" />
                Fingerprint Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">Current Status</div>
                {isCheckedIn ? (
                  <Badge className="bg-green-100 text-green-800">Checked In</Badge>
                ) : (
                  <Badge variant="secondary">Not Checked In</Badge>
                )}
              </div>
              
              {currentLocation && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Current Location:</div>
                    <div className="text-muted-foreground">{currentLocation.address}</div>
                  </div>
                </div>
              )}

              {isGettingLocation && (
                <div className="text-sm text-muted-foreground text-center">
                  Getting location...
                </div>
              )}

              <div className="space-y-2">
                {!isCheckedIn ? (
                  <Button 
                    onClick={handleCheckIn} 
                    className="w-full"
                    disabled={isGettingLocation || !currentLocation}
                  >
                    <Fingerprint className="mr-2 h-4 w-4" />
                    Check In with Fingerprint
                  </Button>
                ) : (
                  <Button onClick={handleCheckOut} variant="outline" className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Check Out
                  </Button>
                )}
                
                {/* Manual Attendance Request */}
                <Dialog open={manualRequestOpen} onOpenChange={setManualRequestOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Request Manual Attendance
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Manual Attendance</DialogTitle>
                      <DialogDescription>
                        Request manual attendance entry when fingerprint verification is not available or has failed.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleManualAttendanceRequest} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <input
                          id="date"
                          type="date"
                          value={manualRequestData.date}
                          onChange={(e) => setManualRequestData(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="checkIn">Check In Time</Label>
                          <input
                            id="checkIn"
                            type="time"
                            value={manualRequestData.checkIn}
                            onChange={(e) => setManualRequestData(prev => ({ ...prev, checkIn: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="checkOut">Check Out Time</Label>
                          <input
                            id="checkOut"
                            type="time"
                            value={manualRequestData.checkOut}
                            onChange={(e) => setManualRequestData(prev => ({ ...prev, checkOut: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Manual Entry</Label>
                        <Textarea
                          id="reason"
                          placeholder="Please explain why you need manual attendance entry (e.g., fingerprint scanner not working, forgot to check in, etc.)"
                          value={manualRequestData.reason}
                          onChange={(e) => setManualRequestData(prev => ({ ...prev, reason: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setManualRequestOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                          Submit Request
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {todayRecord && (
                <div className="pt-4 border-t space-y-2">
                  <div className="text-sm font-medium">Today's Record</div>
                  <div className="flex justify-between text-sm">
                    <span>Check In:</span>
                    <span>{todayRecord.checkIn}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Working Hours:</span>
                    <span>{todayRecord.workingHours}</span>
                  </div>
                  {todayRecord.checkInLocation && (
                    <div className="text-xs text-muted-foreground">
                      Location: {todayRecord.checkInLocation.address}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Monthly Stats */}
        <Card className={isOwnAttendance ? "" : "md:col-span-1"}>
          <CardHeader>
            <CardTitle>This Month's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{thisMonthStats.present}</div>
                <div className="text-sm text-muted-foreground">Present</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{thisMonthStats.late}</div>
                <div className="text-sm text-muted-foreground">Late</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{thisMonthStats.absent}</div>
                <div className="text-sm text-muted-foreground">Absent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.round((thisMonthStats.present / thisMonthStats.totalDays) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Attendance Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Record for admin view */}
        {!isOwnAttendance && todayRecord && (
          <Card>
            <CardHeader>
              <CardTitle>Today's Record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Check In:</span>
                <span className="font-medium">{todayRecord.checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span>Check Out:</span>
                <span className="font-medium">{todayRecord.checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span>Working Hours:</span>
                <span className="font-medium">{todayRecord.workingHours}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                {getStatusBadge(todayRecord.status)}
              </div>
              <div className="flex justify-between">
                <span>Fingerprint:</span>
                <div className="flex items-center gap-2">
                  {todayRecord.fingerprintVerified ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  {todayRecord.fingerprintVerified ? "Verified" : "Manual Entry"}
                </div>
              </div>
              {todayRecord.checkInLocation && (
                <div className="pt-2 border-t">
                  <div className="text-sm font-medium mb-1">Check-in Location:</div>
                  <div className="text-xs text-muted-foreground">
                    {todayRecord.checkInLocation.address}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Manual Attendance Requests - Only for own attendance */}
      {isOwnAttendance && manualRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Manual Attendance Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Request Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manualRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>{request.checkIn}</TableCell>
                    <TableCell>{request.checkOut}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={request.reason}>
                        {request.reason}
                      </div>
                    </TableCell>
                    <TableCell>{getRequestStatusBadge(request.status)}</TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Calendar Filter */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Attendance History</CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Working Hours</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {record.checkIn}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {record.checkOut}
                    </div>
                  </TableCell>
                  <TableCell>{record.workingHours}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {record.location}
                      </div>
                      {record.checkInLocation && (
                        <div className="text-xs text-muted-foreground">
                          {record.checkInLocation.address}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {record.fingerprintVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <div>
                        {record.fingerprintVerified ? "Verified" : "Manual"}
                        {record.isManual && record.manualReason && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {record.manualReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}