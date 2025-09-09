import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Clock, Users, Wifi, WifiOff, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface LibraryBooking {
  id: string;
  studentName: string;
  date: string;
  timeSlot: string;
  hours: number;
  type: "digital" | "physical";
  status: "active" | "completed";
}

const timeSlots = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00", 
  "11:00 - 12:00",
  "12:00 - 13:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00"
];

const libraryStats = {
  digitalCapacity: 120,
  physicalCapacity: 80,
  digitalOccupied: 87,
  physicalOccupied: 62,
  totalBookings: 149,
  peakHours: "14:00 - 16:00"
};

export default function Library() {
  const [bookings, setBookings] = useState<LibraryBooking[]>([]);
  const [newBooking, setNewBooking] = useState({
    studentName: "",
    date: "",
    timeSlot: "",
    hours: 1,
    type: "physical" as "digital" | "physical"
  });
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  useEffect(() => {
    const savedBookings = localStorage.getItem("phoenix-library-bookings");
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      // Generate some sample bookings
      const sampleBookings: LibraryBooking[] = [
        {
          id: "1",
          studentName: "John Doe",
          date: "2024-01-15",
          timeSlot: "09:00 - 10:00",
          hours: 2,
          type: "physical",
          status: "active"
        },
        {
          id: "2", 
          studentName: "Jane Smith",
          date: "2024-01-15",
          timeSlot: "14:00 - 15:00",
          hours: 1,
          type: "digital",
          status: "active"
        },
        {
          id: "3",
          studentName: "Mike Johnson",
          date: "2024-01-16",
          timeSlot: "10:00 - 11:00",
          hours: 3,
          type: "physical",
          status: "active"
        }
      ];
      setBookings(sampleBookings);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("phoenix-library-bookings", JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = () => {
    if (newBooking.studentName && newBooking.date && newBooking.timeSlot) {
      const booking: LibraryBooking = {
        id: `booking-${Date.now()}`,
        ...newBooking,
        status: "active"
      };
      setBookings([...bookings, booking]);
      setNewBooking({
        studentName: "",
        date: "",
        timeSlot: "",
        hours: 1,
        type: "physical"
      });
      setIsBookingDialogOpen(false);
    }
  };

  const deleteBooking = (id: string) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  const digitalUtilization = Math.round((libraryStats.digitalOccupied / libraryStats.digitalCapacity) * 100);
  const physicalUtilization = Math.round((libraryStats.physicalOccupied / libraryStats.physicalCapacity) * 100);

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Library Management</h1>
        <p className="text-muted-foreground">Book study slots and track library utilization</p>
      </motion.div>

      {/* Library Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Digital Library</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{libraryStats.digitalOccupied}/{libraryStats.digitalCapacity}</div>
              <div className="space-y-2">
                <Progress value={digitalUtilization} className="h-2" />
                <p className="text-xs text-muted-foreground">{digitalUtilization}% occupied</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Physical Library</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{libraryStats.physicalOccupied}/{libraryStats.physicalCapacity}</div>
              <div className="space-y-2">
                <Progress value={physicalUtilization} className="h-2" />
                <p className="text-xs text-muted-foreground">{physicalUtilization}% occupied</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{libraryStats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">Active reservations</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peak Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{libraryStats.peakHours}</div>
              <p className="text-xs text-muted-foreground">Highest utilization</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Booking Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="campus-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Library Bookings ({bookings.length})</span>
              </CardTitle>
              <CardDescription>Manage student library slot reservations</CardDescription>
            </div>
            <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
              <DialogTrigger asChild>
                <Button className="campus-button-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Book Slot
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Book Library Slot</DialogTitle>
                  <DialogDescription>Reserve a study slot in the library</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input
                      id="studentName"
                      value={newBooking.studentName}
                      onChange={(e) => setNewBooking({...newBooking, studentName: e.target.value})}
                      placeholder="Enter student name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newBooking.date}
                      onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeSlot">Time Slot</Label>
                    <Select
                      value={newBooking.timeSlot}
                      onValueChange={(value) => setNewBooking({...newBooking, timeSlot: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="hours">Duration (Hours)</Label>
                    <Select
                      value={newBooking.hours.toString()}
                      onValueChange={(value) => setNewBooking({...newBooking, hours: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Hour</SelectItem>
                        <SelectItem value="2">2 Hours</SelectItem>
                        <SelectItem value="3">3 Hours</SelectItem>
                        <SelectItem value="4">4 Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">Library Type</Label>
                    <Select
                      value={newBooking.type}
                      onValueChange={(value: "digital" | "physical") => setNewBooking({...newBooking, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="physical">Physical Library</SelectItem>
                        <SelectItem value="digital">Digital Library</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addBooking} className="w-full campus-button-primary">
                    Book Slot
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      {booking.type === "digital" ? (
                        <Wifi className="h-5 w-5 text-primary" />
                      ) : (
                        <BookOpen className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{booking.studentName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{booking.date}</span>
                        <span>{booking.timeSlot}</span>
                        <span>{booking.hours} hour{booking.hours > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={booking.type === "digital" ? "default" : "secondary"}
                    >
                      {booking.type === "digital" ? "Digital" : "Physical"}
                    </Badge>
                    <Badge 
                      variant={booking.status === "active" ? "default" : "outline"}
                    >
                      {booking.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteBooking(booking.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            {bookings.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No bookings yet. Click "Book Slot" to make a reservation.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Capacity Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="campus-card">
          <CardHeader>
            <CardTitle>Real-time Capacity Status</CardTitle>
            <CardDescription>Current library utilization across different sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wifi className="h-5 w-5 text-primary" />
                    <span className="font-medium">Digital Library</span>
                  </div>
                  <span className="text-sm font-medium">{digitalUtilization}%</span>
                </div>
                <Progress value={digitalUtilization} className="h-3" />
                <div className="text-sm text-muted-foreground">
                  {libraryStats.digitalOccupied} of {libraryStats.digitalCapacity} seats occupied
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-secondary" />
                    <span className="font-medium">Physical Library</span>
                  </div>
                  <span className="text-sm font-medium">{physicalUtilization}%</span>
                </div>
                <Progress value={physicalUtilization} className="h-3" />
                <div className="text-sm text-muted-foreground">
                  {libraryStats.physicalOccupied} of {libraryStats.physicalCapacity} seats occupied
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}