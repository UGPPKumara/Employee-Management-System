import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Search, Fingerprint, Clock, MapPin, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

const attendanceRecords = [
  {
    id: 1,
    employeeName: "John Smith",
    date: "2024-01-22",
    checkIn: "08:45 AM",
    checkOut: "06:15 PM",
    workingHours: "9h 30m",
    location: "Downtown District",
    fingerprintVerified: true,
    status: "present",
  },
  {
    id: 2,
    employeeName: "Sarah Johnson",
    date: "2024-01-22",
    checkIn: "09:00 AM",
    checkOut: "05:45 PM",
    workingHours: "8h 45m",
    location: "Business Park",
    fingerprintVerified: true,
    status: "present",
  },
  {
    id: 3,
    employeeName: "Mike Wilson",
    date: "2024-01-22",
    checkIn: "-",
    checkOut: "-",
    workingHours: "-",
    location: "-",
    fingerprintVerified: false,
    status: "absent",
  },
  {
    id: 4,
    employeeName: "Emily Davis",
    date: "2024-01-22",
    checkIn: "08:30 AM",
    checkOut: "06:00 PM",
    workingHours: "9h 30m",
    location: "Tech Hub",
    fingerprintVerified: true,
    status: "present",
  },
  {
    id: 5,
    employeeName: "John Smith",
    date: "2024-01-21",
    checkIn: "08:50 AM",
    checkOut: "06:20 PM",
    workingHours: "9h 30m",
    location: "Downtown District",
    fingerprintVerified: true,
    status: "present",
  },
  {
    id: 6,
    employeeName: "Sarah Johnson",
    date: "2024-01-21",
    checkIn: "09:15 AM",
    checkOut: "05:30 PM",
    workingHours: "8h 15m",
    location: "Business Park",
    fingerprintVerified: true,
    status: "late",
  },
];

export function Attendance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const filteredRecords = attendanceRecords.filter(record =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedDate ? record.date === format(selectedDate, "yyyy-MM-dd") : true)
  );

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

  const todayStats = {
    totalEmployees: 4,
    present: attendanceRecords.filter(r => r.date === "2024-01-22" && r.status === "present").length,
    late: attendanceRecords.filter(r => r.date === "2024-01-22" && r.status === "late").length,
    absent: attendanceRecords.filter(r => r.date === "2024-01-22" && r.status === "absent").length,
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Date */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Attendance Tracking</h2>
          <p className="text-muted-foreground">Monitor employee attendance with fingerprint verification</p>
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
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">{todayStats.totalEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Present</p>
                <p className="text-2xl font-bold text-green-600">{todayStats.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Late</p>
                <p className="text-2xl font-bold text-yellow-600">{todayStats.late}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold text-red-600">{todayStats.absent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
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
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.employeeName}</TableCell>
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
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {record.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Fingerprint className={`h-4 w-4 ${record.fingerprintVerified ? 'text-green-600' : 'text-muted-foreground'}`} />
                      {record.fingerprintVerified ? "Verified" : "Not Verified"}
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