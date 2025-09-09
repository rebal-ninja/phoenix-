import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Users, BookOpen, Calendar, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Faculty {
  id: string;
  name: string;
  subject: string;
  email: string;
  department: string;
}

interface RemedialSession {
  id: string;
  facultyId: string;
  subject: string;
  timeSlot: string;
  day: string;
  room: string;
  capacity: number;
  enrolled: number;
  type: "doubt-clearing" | "remedial-class" | "extra-session";
  status: "scheduled" | "ongoing" | "completed";
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
  "17:00 - 18:00"
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const facultyData: Faculty[] = [
  {
    id: "f1",
    name: "Dr. John Smith",
    subject: "Computer Science",
    email: "john.smith@university.edu",
    department: "CSE"
  },
  {
    id: "f2", 
    name: "Prof. Sarah Johnson",
    subject: "Mathematics",
    email: "sarah.johnson@university.edu",
    department: "Mathematics"
  },
  {
    id: "f3",
    name: "Dr. Michael Williams", 
    subject: "Physics",
    email: "michael.williams@university.edu",
    department: "Physics"
  },
  {
    id: "f4",
    name: "Prof. Emily Brown",
    subject: "Chemistry",
    email: "emily.brown@university.edu", 
    department: "Chemistry"
  },
  {
    id: "f5",
    name: "Dr. Robert Davis",
    subject: "Electrical Engineering", 
    email: "robert.davis@university.edu",
    department: "EEE"
  }
];

const remedialSessions: RemedialSession[] = [
  {
    id: "rs1",
    facultyId: "f1",
    subject: "Data Structures",
    timeSlot: "16:00 - 17:00",
    day: "Monday",
    room: "A101",
    capacity: 25,
    enrolled: 18,
    type: "doubt-clearing",
    status: "scheduled"
  },
  {
    id: "rs2",
    facultyId: "f2", 
    subject: "Calculus",
    timeSlot: "17:00 - 18:00",
    day: "Tuesday",
    room: "A102",
    capacity: 30,
    enrolled: 22,
    type: "remedial-class",
    status: "scheduled"
  },
  {
    id: "rs3",
    facultyId: "f3",
    subject: "Quantum Physics",
    timeSlot: "15:00 - 16:00", 
    day: "Wednesday",
    room: "A103",
    capacity: 20,
    enrolled: 15,
    type: "doubt-clearing",
    status: "scheduled"
  },
  {
    id: "rs4",
    facultyId: "f4",
    subject: "Organic Chemistry",
    timeSlot: "16:00 - 17:00",
    day: "Thursday", 
    room: "S001",
    capacity: 15,
    enrolled: 12,
    type: "extra-session",
    status: "scheduled"
  },
  {
    id: "rs5",
    facultyId: "f5",
    subject: "Digital Circuits",
    timeSlot: "14:00 - 15:00",
    day: "Friday",
    room: "L001",
    capacity: 25,
    enrolled: 20,
    type: "doubt-clearing", 
    status: "ongoing"
  }
];

export default function Remedial() {
  const [faculty] = useState<Faculty[]>(facultyData);
  const [sessions] = useState<RemedialSession[]>(remedialSessions);
  const [selectedDay, setSelectedDay] = useState("Monday");

  const getFacultyById = (id: string) => {
    return faculty.find(f => f.id === id);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "doubt-clearing": return "default";
      case "remedial-class": return "secondary";
      case "extra-session": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "outline";
      case "ongoing": return "default";
      case "completed": return "secondary";
      default: return "outline";
    }
  };

  // Get available faculty for each time slot
  const getAvailableFaculty = (day: string, timeSlot: string) => {
    const busyFacultyIds = sessions
      .filter(s => s.day === day && s.timeSlot === timeSlot)
      .map(s => s.facultyId);
    
    return faculty.filter(f => !busyFacultyIds.includes(f.id));
  };

  const sessionsForDay = sessions.filter(s => s.day === selectedDay);
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter(s => s.status === "ongoing").length;
  const totalEnrolled = sessions.reduce((sum, s) => sum + s.enrolled, 0);
  const averageUtilization = Math.round(
    (sessions.reduce((sum, s) => sum + (s.enrolled / s.capacity), 0) / sessions.length) * 100
  );

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Remedial Sessions</h1>
        <p className="text-muted-foreground">Faculty availability for doubt clearing and remedial classes</p>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSessions}</div>
              <p className="text-xs text-muted-foreground">Scheduled weekly</p>
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
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeSessions}</div>
              <p className="text-xs text-muted-foreground">Currently ongoing</p>
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
              <CardTitle className="text-sm font-medium">Students Enrolled</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEnrolled}</div>
              <p className="text-xs text-muted-foreground">Across all sessions</p>
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
              <CardTitle className="text-sm font-medium">Avg. Utilization</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageUtilization}%</div>
              <p className="text-xs text-muted-foreground">Session capacity</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedule">Session Schedule</TabsTrigger>
          <TabsTrigger value="availability">Faculty Availability</TabsTrigger>
        </TabsList>

        {/* Session Schedule */}
        <TabsContent value="schedule" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="campus-card">
              <CardHeader>
                <CardTitle>Remedial Sessions</CardTitle>
                <CardDescription>Scheduled doubt clearing and remedial classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sessions.map((session, index) => {
                    const facultyMember = getFacultyById(session.facultyId);
                    const utilizationPercentage = Math.round((session.enrolled / session.capacity) * 100);

                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="campus-card h-full">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{session.subject}</CardTitle>
                                <CardDescription>{facultyMember?.name}</CardDescription>
                              </div>
                              <div className="flex flex-col space-y-1">
                                <Badge variant={getSessionTypeColor(session.type)}>
                                  {session.type.replace('-', ' ')}
                                </Badge>
                                <Badge variant={getStatusColor(session.status)}>
                                  {session.status}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Schedule Details */}
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{session.day}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{session.timeSlot}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>Room {session.room}</span>
                              </div>
                            </div>

                            {/* Enrollment */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Enrollment</span>
                                <span className="font-medium">{session.enrolled}/{session.capacity}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${utilizationPercentage}%` }}
                                />
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {utilizationPercentage}% capacity
                              </div>
                            </div>

                            {/* Faculty Contact */}
                            <div className="pt-2 border-t border-border">
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                    {facultyMember ? getInitials(facultyMember.name) : '?'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium">{facultyMember?.name}</div>
                                  <div className="text-xs text-muted-foreground">{facultyMember?.department}</div>
                                </div>
                              </div>
                            </div>

                            {/* Action Button */}
                            <Button 
                              className="w-full campus-button-secondary"
                              disabled={session.enrolled >= session.capacity}
                            >
                              {session.enrolled >= session.capacity ? "Session Full" : "Join Session"}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Faculty Availability */}
        <TabsContent value="availability" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {/* Day Selector */}
            <div className="flex items-center space-x-4 mb-6">
              <label className="text-sm font-medium">Select Day:</label>
              <div className="flex space-x-2">
                {days.map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDay(day)}
                  >
                    {day.substring(0, 3)}
                  </Button>
                ))}
              </div>
            </div>

            <Card className="campus-card">
              <CardHeader>
                <CardTitle>Faculty Availability - {selectedDay}</CardTitle>
                <CardDescription>View which faculty are available for each time slot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeSlots.map((timeSlot, index) => {
                    const availableFaculty = getAvailableFaculty(selectedDay, timeSlot);
                    const scheduledSession = sessionsForDay.find(s => s.timeSlot === timeSlot);

                    return (
                      <motion.div
                        key={timeSlot}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">{timeSlot}</h3>
                          </div>
                          {scheduledSession && (
                            <Badge variant="default">
                              Session Scheduled
                            </Badge>
                          )}
                        </div>

                        {scheduledSession ? (
                          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{scheduledSession.subject}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {getFacultyById(scheduledSession.facultyId)?.name} • Room {scheduledSession.room}
                                </p>
                              </div>
                              <Badge variant={getSessionTypeColor(scheduledSession.type)}>
                                {scheduledSession.type.replace('-', ' ')}
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                              Available Faculty ({availableFaculty.length})
                            </h4>
                            {availableFaculty.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {availableFaculty.map((facultyMember) => (
                                  <div
                                    key={facultyMember.id}
                                    className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                                  >
                                    <Avatar className="w-8 h-8">
                                      <AvatarFallback className="bg-success/10 text-success text-xs font-semibold">
                                        {getInitials(facultyMember.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h5 className="text-sm font-medium">{facultyMember.name}</h5>
                                      <p className="text-xs text-muted-foreground">{facultyMember.subject}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 text-muted-foreground">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm">No faculty available at this time</span>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}