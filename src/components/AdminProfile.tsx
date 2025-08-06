import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { User, Settings, Lock, Bell, Shield, Check, X, Clock, MapPin, Fingerprint, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface AdminProfileProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface ManualAttendanceRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  date: string;
  checkIn: string;
  checkOut: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  adminNote?: string;
  location?: string;
}

// Mock password change requests
const mockPasswordRequests = [
  {
    id: 1,
    employeeId: 2,
    employeeName: "John Smith",
    employeeEmail: "john.smith@company.com",
    requestDate: "2024-01-22",
    reason: "Forgot current password",
    status: "pending",
  },
  {
    id: 2,
    employeeId: 3,
    employeeName: "Sarah Johnson",
    employeeEmail: "sarah.j@company.com",
    requestDate: "2024-01-21",
    reason: "Security concern - possible breach",
    status: "pending",
  },
  {
    id: 3,
    employeeId: 4,
    employeeName: "Mike Wilson",
    employeeEmail: "mike.w@company.com",
    requestDate: "2024-01-20",
    reason: "Password expired",
    status: "approved",
  },
];

// Mock manual attendance requests
const mockManualAttendanceRequests: ManualAttendanceRequest[] = [
  {
    id: 1,
    employeeId: 2,
    employeeName: "John Smith",
    employeeEmail: "john.smith@company.com",
    date: "2024-01-23",
    checkIn: "09:00",
    checkOut: "18:00",
    reason: "Fingerprint scanner was malfunctioning in the morning",
    status: 'pending',
    requestDate: "2024-01-23",
    location: "Downtown District Office",
  },
  {
    id: 2,
    employeeId: 3,
    employeeName: "Sarah Johnson",
    employeeEmail: "sarah.j@company.com",
    date: "2024-01-22",
    checkIn: "08:45",
    checkOut: "17:30",
    reason: "Forgot to check in - was already working on urgent client issue",
    status: 'pending',
    requestDate: "2024-01-22",
    location: "Business Park Office",
  },
  {
    id: 3,
    employeeId: 4,
    employeeName: "Mike Wilson",
    employeeEmail: "mike.w@company.com",
    date: "2024-01-21",
    checkIn: "09:30",
    checkOut: "18:15",
    reason: "System was down for maintenance",
    status: 'approved',
    requestDate: "2024-01-21",
    location: "North Branch Office",
    adminNote: "Confirmed with IT - system was indeed down",
  },
  {
    id: 4,
    employeeId: 1,
    employeeName: "Emily Davis",
    employeeEmail: "emily.d@company.com",
    date: "2024-01-20",
    checkIn: "08:30",
    checkOut: "17:45",
    reason: "Emergency client meeting - rushed in without checking",
    status: 'rejected',
    requestDate: "2024-01-20",
    location: "Tech Hub Office",
    adminNote: "Please ensure to check in even during emergencies",
  },
];

export function AdminProfile({ user }: AdminProfileProps) {
  const [passwordRequests, setPasswordRequests] = useState(mockPasswordRequests);
  const [manualAttendanceRequests, setManualAttendanceRequests] = useState(mockManualAttendanceRequests);
  const [selectedRequest, setSelectedRequest] = useState<ManualAttendanceRequest | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: "+1 (555) 000-0000",
    address: "123 Admin Street, HQ Building",
    bio: "System Administrator",
  });

  const [systemSettings, setSystemSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    autoApproveAttendance: false,
    requireFingerprint: true,
    workingHours: "9:00 AM - 6:00 PM",
    timezone: "UTC-5",
  });

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleApprovePasswordRequest = (requestId: number) => {
    setPasswordRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { ...request, status: "approved" }
        : request
    ));
    toast.success("Password change request approved");
  };

  const handleRejectPasswordRequest = (requestId: number) => {
    setPasswordRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { ...request, status: "rejected" }
        : request
    ));
    toast.success("Password change request rejected");
  };

  const handleReviewAttendanceRequest = (request: ManualAttendanceRequest) => {
    setSelectedRequest(request);
    setAdminNote(request.adminNote || "");
    setReviewDialogOpen(true);
  };

  const handleApproveAttendanceRequest = () => {
    if (selectedRequest) {
      setManualAttendanceRequests(prev => prev.map(request => 
        request.id === selectedRequest.id 
          ? { ...request, status: 'approved', adminNote }
          : request
      ));
      toast.success("Manual attendance request approved");
      setReviewDialogOpen(false);
      setSelectedRequest(null);
      setAdminNote("");
    }
  };

  const handleRejectAttendanceRequest = () => {
    if (selectedRequest) {
      setManualAttendanceRequests(prev => prev.map(request => 
        request.id === selectedRequest.id 
          ? { ...request, status: 'rejected', adminNote }
          : request
      ));
      toast.success("Manual attendance request rejected");
      setReviewDialogOpen(false);
      setSelectedRequest(null);
      setAdminNote("");
    }
  };

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully");
  };

  const handleSaveSettings = () => {
    toast.success("System settings updated successfully");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    toast.success("Password changed successfully");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setChangePasswordOpen(false);
  };

  const getStatusBadge = (status: string) => {
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

  const pendingPasswordRequests = passwordRequests.filter(req => req.status === "pending");
  const pendingAttendanceRequests = manualAttendanceRequests.filter(req => req.status === "pending");
  const totalPendingRequests = pendingPasswordRequests.length + pendingAttendanceRequests.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Admin Profile & Settings</h2>
          <p className="text-muted-foreground">Manage your profile and system settings</p>
        </div>
      </div>

      {/* Alert for pending requests */}
      {totalPendingRequests > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">
                {totalPendingRequests} request{totalPendingRequests > 1 ? 's' : ''} pending approval
                ({pendingPasswordRequests.length} password, {pendingAttendanceRequests.length} attendance)
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password-requests">
            Password Requests
            {pendingPasswordRequests.length > 0 && (
              <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">
                {pendingPasswordRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="attendance-requests">
            Attendance Requests
            {pendingAttendanceRequests.length > 0 && (
              <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">
                {pendingAttendanceRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Brief description about yourself"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </div>

                <Button onClick={handleSaveProfile} className="w-full">
                  Save Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                    </div>
                    <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">Change Password</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                        </DialogHeader>
                        
                        <form onSubmit={handleChangePassword} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                              id="currentPassword"
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              required
                            />
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setChangePasswordOpen(false)} className="flex-1">
                              Cancel
                            </Button>
                            <Button type="submit" className="flex-1">
                              Change Password
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Secure your account with 2FA</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Login Sessions</p>
                      <p className="text-sm text-muted-foreground">Manage active sessions</p>
                    </div>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Password Requests Tab */}
        <TabsContent value="password-requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Password Change Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passwordRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.employeeName}</div>
                          <div className="text-sm text-muted-foreground">{request.employeeEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={request.reason}>
                          {request.reason}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>
                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprovePasswordRequest(request.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectPasswordRequest(request.id)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {request.status !== "pending" && (
                          <span className="text-sm text-muted-foreground">
                            {request.status === "approved" ? "Approved" : "Rejected"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manual Attendance Requests Tab */}
        <TabsContent value="attendance-requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="h-5 w-5" />
                Manual Attendance Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manualAttendanceRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.employeeName}</div>
                          <div className="text-sm text-muted-foreground">{request.employeeEmail}</div>
                          <div className="text-xs text-muted-foreground">Requested: {request.requestDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>In: {request.checkIn}</div>
                          <div>Out: {request.checkOut}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {request.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={request.reason}>
                          {request.reason}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(request.status)}
                          {request.adminNote && (
                            <div className="text-xs text-muted-foreground">
                              Note: {request.adminNote}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {request.status === "pending" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReviewAttendanceRequest(request)}
                          >
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {request.status === "approved" ? "Approved" : "Rejected"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email alerts</p>
                  </div>
                  <Switch
                    checked={systemSettings.emailNotifications}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive SMS alerts</p>
                  </div>
                  <Switch
                    checked={systemSettings.smsNotifications}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, smsNotifications: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-approve Attendance</p>
                    <p className="text-sm text-muted-foreground">Automatically approve attendance</p>
                  </div>
                  <Switch
                    checked={systemSettings.autoApproveAttendance}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoApproveAttendance: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require Fingerprint</p>
                    <p className="text-sm text-muted-foreground">Mandatory fingerprint verification</p>
                  </div>
                  <Switch
                    checked={systemSettings.requireFingerprint}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, requireFingerprint: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <Input
                    id="workingHours"
                    value={systemSettings.workingHours}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, workingHours: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={systemSettings.timezone}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Manual Attendance Request Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Manual Attendance Request</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Employee Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedRequest.employeeName}</div>
                    <div><strong>Email:</strong> {selectedRequest.employeeEmail}</div>
                    <div><strong>Request Date:</strong> {selectedRequest.requestDate}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Attendance Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Date:</strong> {selectedRequest.date}</div>
                    <div><strong>Check In:</strong> {selectedRequest.checkIn}</div>
                    <div><strong>Check Out:</strong> {selectedRequest.checkOut}</div>
                    <div><strong>Location:</strong> {selectedRequest.location}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Reason for Manual Entry</h3>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  {selectedRequest.reason}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminNote">Admin Note (Optional)</Label>
                <Textarea
                  id="adminNote"
                  placeholder="Add a note about your decision..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setReviewDialogOpen(false)} 
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleRejectAttendanceRequest}
                  className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button 
                  onClick={handleApproveAttendanceRequest}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}