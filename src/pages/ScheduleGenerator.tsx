import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Users, MapPin, BookOpen, AlertCircle, Zap, Download, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { schedulerService } from "@/lib/scheduler-service";
import { ScheduleResult, ScheduledClass, Conflict } from "@/lib/scheduler-engine";

interface Faculty {
  id: string;
  name: string;
  email: string;
  subject: string;
}

interface Course {
  id: string;
  code: string;
  name: string;
  facultyId?: string;
  credits: number;
}

interface Room {
  id: string;
  number: string;
  type: string;
  capacity: number;
  utilization: number;
}

const roomTypes = ["Classroom", "Laboratory", "Library", "Seminar Hall", "Computer Lab", "Club Room"];

export default function ScheduleGenerator() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newFaculty, setNewFaculty] = useState({ name: "", email: "", subject: "" });
  const [newCourse, setNewCourse] = useState({ code: "", name: "", facultyId: "", credits: 3 });
  const [isAddingFaculty, setIsAddingFaculty] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  
  // Schedule generation state
  const [scheduleResult, setScheduleResult] = useState<ScheduleResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [scheduleError, setScheduleError] = useState("");

  // Load data from localStorage
  useEffect(() => {
    const savedFaculty = localStorage.getItem("phoenix-faculty");
    const savedCourses = localStorage.getItem("phoenix-courses");
    const savedRooms = localStorage.getItem("phoenix-rooms");

    if (savedFaculty) setFaculty(JSON.parse(savedFaculty));
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms));
    } else {
      // Generate initial rooms
      generateRooms();
    }
    
    // Load existing schedule result
    loadScheduleResult();
  }, []);
  
  const loadScheduleResult = async () => {
    try {
      const result = await schedulerService.getScheduleResult();
      setScheduleResult(result);
    } catch (error) {
      console.error('Error loading schedule result:', error);
    }
  };

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("phoenix-faculty", JSON.stringify(faculty));
  }, [faculty]);

  useEffect(() => {
    localStorage.setItem("phoenix-courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("phoenix-rooms", JSON.stringify(rooms));
  }, [rooms]);

  const generateSampleData = () => {
    // Generate sample faculty with professors and lecturers
    const sampleFaculty: Faculty[] = [
      // Professors
      { id: "prof-1", name: "Dr. Sarah Johnson", email: "sarah.johnson@phoenix.edu", subject: "Computer Science", role: "professor" },
      { id: "prof-2", name: "Prof. Michael Chen", email: "michael.chen@phoenix.edu", subject: "Mathematics", role: "professor" },
      { id: "prof-3", name: "Dr. Emily Rodriguez", email: "emily.rodriguez@phoenix.edu", subject: "Physics", role: "professor" },
      { id: "prof-4", name: "Prof. David Kim", email: "david.kim@phoenix.edu", subject: "Chemistry", role: "professor" },
      { id: "prof-5", name: "Dr. Lisa Wang", email: "lisa.wang@phoenix.edu", subject: "Biology", role: "professor" },
      
      // Lecturers
      { id: "lect-1", name: "Ms. Priya Sharma", email: "priya.sharma@phoenix.edu", subject: "Computer Science", role: "lecturer" },
      { id: "lect-2", name: "Mr. James Wilson", email: "james.wilson@phoenix.edu", subject: "Mathematics", role: "lecturer" },
      { id: "lect-3", name: "Dr. Maria Garcia", email: "maria.garcia@phoenix.edu", subject: "Physics", role: "lecturer" },
      { id: "lect-4", name: "Ms. Anna Lee", email: "anna.lee@phoenix.edu", subject: "Chemistry", role: "lecturer" },
      { id: "lect-5", name: "Mr. Robert Brown", email: "robert.brown@phoenix.edu", subject: "Biology", role: "lecturer" }
    ];

    // Generate sample courses with professor and lecturer assignments
    const sampleCourses: Course[] = [
      { id: "course-1", code: "CS101", name: "Introduction to Programming", professorId: "prof-1", lecturerId: "lect-1", credits: 3 },
      { id: "course-2", code: "MATH201", name: "Calculus I", professorId: "prof-2", lecturerId: "lect-2", credits: 4 },
      { id: "course-3", code: "PHYS101", name: "General Physics", professorId: "prof-3", lecturerId: "lect-3", credits: 3 },
      { id: "course-4", code: "CHEM101", name: "General Chemistry", professorId: "prof-4", lecturerId: "lect-4", credits: 3 },
      { id: "course-5", code: "BIO101", name: "General Biology", professorId: "prof-5", lecturerId: "lect-5", credits: 3 },
      { id: "course-6", code: "CS201", name: "Data Structures", professorId: "prof-1", lecturerId: "lect-1", credits: 3 },
      { id: "course-7", code: "MATH202", name: "Calculus II", professorId: "prof-2", lecturerId: "lect-2", credits: 4 },
      { id: "course-8", code: "CS301", name: "Algorithms", professorId: "prof-1", lecturerId: "lect-1", credits: 3 },
      { id: "course-9", code: "PHYS201", name: "Advanced Physics", professorId: "prof-3", lecturerId: "lect-3", credits: 4 },
      { id: "course-10", code: "CHEM201", name: "Organic Chemistry", professorId: "prof-4", lecturerId: "lect-4", credits: 4 }
    ];

    setFaculty(sampleFaculty);
    setCourses(sampleCourses);
  };

  const generateRooms = () => {
    const generatedRooms: Room[] = [];
    
    // Regular classrooms (40 rooms)
    for (let i = 1; i <= 40; i++) {
      generatedRooms.push({
        id: `room-${i}`,
        number: `A${i.toString().padStart(3, "0")}`,
        type: "Classroom",
        capacity: Math.floor(Math.random() * 40) + 30,
        utilization: Math.floor(Math.random() * 100)
      });
    }

    // Computer labs (10 rooms)
    for (let i = 1; i <= 10; i++) {
      generatedRooms.push({
        id: `lab-${i}`,
        number: `L${i.toString().padStart(3, "0")}`,
        type: "Computer Lab",
        capacity: Math.floor(Math.random() * 20) + 20,
        utilization: Math.floor(Math.random() * 100)
      });
    }

    // Science labs (8 rooms)
    for (let i = 1; i <= 8; i++) {
      generatedRooms.push({
        id: `scilab-${i}`,
        number: `S${i.toString().padStart(3, "0")}`,
        type: "Laboratory",
        capacity: Math.floor(Math.random() * 15) + 15,
        utilization: Math.floor(Math.random() * 100)
      });
    }

    // Library sections (3 rooms)
    for (let i = 1; i <= 3; i++) {
      generatedRooms.push({
        id: `lib-${i}`,
        number: `LIB${i}`,
        type: "Library",
        capacity: Math.floor(Math.random() * 50) + 100,
        utilization: Math.floor(Math.random() * 100)
      });
    }

    // Seminar halls (5 rooms)
    for (let i = 1; i <= 5; i++) {
      generatedRooms.push({
        id: `sem-${i}`,
        number: `SH${i}`,
        type: "Seminar Hall",
        capacity: Math.floor(Math.random() * 100) + 50,
        utilization: Math.floor(Math.random() * 100)
      });
    }

    // Club rooms (7 rooms)
    const clubNames = ["Music", "Drama", "Debate", "Art", "Sports", "Tech", "Cultural"];
    clubNames.forEach((club, i) => {
      generatedRooms.push({
        id: `club-${i + 1}`,
        number: `CR${i + 1}`,
        type: "Club Room",
        capacity: Math.floor(Math.random() * 30) + 20,
        utilization: Math.floor(Math.random() * 100)
      });
    });

    setRooms(generatedRooms);
  };

  const addFaculty = () => {
    if (newFaculty.name && newFaculty.email && newFaculty.subject) {
      const faculty_member: Faculty = {
        id: `faculty-${Date.now()}`,
        ...newFaculty
      };
      setFaculty([...faculty, faculty_member]);
      setNewFaculty({ name: "", email: "", subject: "" });
      setIsAddingFaculty(false);
    }
  };

  const addCourse = () => {
    if (newCourse.code && newCourse.name) {
      const course: Course = {
        id: `course-${Date.now()}`,
        ...newCourse
      };
      setCourses([...courses, course]);
      setNewCourse({ code: "", name: "", facultyId: "", credits: 3 });
      setIsAddingCourse(false);
    }
  };

  const deleteFaculty = (id: string) => {
    setFaculty(faculty.filter(f => f.id !== id));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const getRoomStatusColor = (utilization: number) => {
    if (utilization >= 80) return "status-critical";
    if (utilization >= 70) return "status-warning";
    if (utilization >= 50) return "status-success";
    return "status-normal";
  };

  const getRoomStatusLabel = (utilization: number) => {
    if (utilization >= 80) return "Critical";
    if (utilization >= 70) return "High";
    if (utilization >= 50) return "Good";
    return "Normal";
  };

  const generateSchedule = async () => {
    if (faculty.length === 0 || courses.length === 0 || rooms.length === 0) {
      setScheduleError("Please add faculty, courses, and rooms before generating schedule");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setScheduleError("");

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Convert data to scheduler engine format
      const schedulerFaculty = faculty.map(f => ({
        id: f.id,
        name: f.name,
        email: f.email,
        subject: f.subject,
        maxHoursPerWeek: 20,
        preferredTimeSlots: [],
        unavailableTimeSlots: [],
        department: f.subject,
        role: f.role || 'professor' as const
      }));

      const schedulerCourses = courses.map(c => ({
        id: c.id,
        code: c.code,
        name: c.name,
        credits: c.credits,
        professorId: c.professorId,
        lecturerId: c.lecturerId,
        requiredRoomType: 'Classroom' as const,
        maxStudents: 50,
        duration: 50, // 50-minute periods
        frequency: 1
      }));

      const schedulerRooms = rooms.map(r => ({
        id: r.id,
        number: r.number,
        type: r.type as any,
        capacity: r.capacity,
        equipment: [],
        location: r.number,
        isAvailable: true
      }));

      const result = await schedulerService.generateSchedule(
        schedulerCourses,
        schedulerFaculty,
        schedulerRooms
      );

      clearInterval(progressInterval);
      setGenerationProgress(100);
      setScheduleResult(result);

      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 500);

    } catch (error) {
      setIsGenerating(false);
      setGenerationProgress(0);
      setScheduleError(error instanceof Error ? error.message : "Failed to generate schedule");
    }
  };

  const exportSchedule = async (format: 'json' | 'csv' = 'json') => {
    try {
      const data = await schedulerService.exportSchedule(format);
      const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `schedule.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      setScheduleError(error instanceof Error ? error.message : "Failed to export schedule");
    }
  };

  const exportUniversityTimetable = async (format: 'json' | 'csv' = 'json') => {
    try {
      const data = await schedulerService.exportUniversityTimetable(format);
      const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `university-timetable.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      setScheduleError(error instanceof Error ? error.message : "Failed to export university timetable");
    }
  };

  const clearSchedule = async () => {
    await schedulerService.clearSchedule();
    setScheduleResult(null);
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Schedule Generator</h1>
        <p className="text-muted-foreground">Manage faculty, courses, and rooms for optimal scheduling</p>
      </motion.div>

      <Tabs defaultValue="faculty" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faculty">Faculty Management</TabsTrigger>
          <TabsTrigger value="courses">Course Management</TabsTrigger>
          <TabsTrigger value="rooms">Room Management</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Generator</TabsTrigger>
        </TabsList>

        {/* Faculty Management */}
        <TabsContent value="faculty" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="campus-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Faculty ({faculty.length})</span>
                  </CardTitle>
                  <CardDescription>Manage teaching staff and their subjects</CardDescription>
                </div>
                <Dialog open={isAddingFaculty} onOpenChange={setIsAddingFaculty}>
                  <DialogTrigger asChild>
                    <Button className="campus-button-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Faculty
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Faculty</DialogTitle>
                      <DialogDescription>Enter faculty member details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newFaculty.name}
                          onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})}
                          placeholder="Dr. John Smith"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newFaculty.email}
                          onChange={(e) => setNewFaculty({...newFaculty, email: e.target.value})}
                          placeholder="john.smith@university.edu"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={newFaculty.subject}
                          onChange={(e) => setNewFaculty({...newFaculty, subject: e.target.value})}
                          placeholder="Computer Science"
                        />
                      </div>
                      <Button onClick={addFaculty} className="w-full campus-button-primary">
                        Add Faculty Member
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {faculty.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteFaculty(member.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge variant="outline">{member.subject}</Badge>
                    </motion.div>
                  ))}
                </div>
                {faculty.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No faculty members added yet. Click "Add Faculty" to get started.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Course Management */}
        <TabsContent value="courses" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="campus-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Courses ({courses.length})</span>
                  </CardTitle>
                  <CardDescription>Manage courses and faculty assignments</CardDescription>
                </div>
                <Dialog open={isAddingCourse} onOpenChange={setIsAddingCourse}>
                  <DialogTrigger asChild>
                    <Button className="campus-button-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Course
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Course</DialogTitle>
                      <DialogDescription>Enter course details and assign faculty</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="code">Course Code</Label>
                        <Input
                          id="code"
                          value={newCourse.code}
                          onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                          placeholder="CS101"
                        />
                      </div>
                      <div>
                        <Label htmlFor="courseName">Course Name</Label>
                        <Input
                          id="courseName"
                          value={newCourse.name}
                          onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                          placeholder="Introduction to Programming"
                        />
                      </div>
                      <div>
                        <Label htmlFor="faculty">Assign Faculty</Label>
                        <Select
                          value={newCourse.facultyId}
                          onValueChange={(value) => setNewCourse({...newCourse, facultyId: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select faculty member" />
                          </SelectTrigger>
                          <SelectContent>
                            {faculty.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.name} - {member.subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="credits">Credits</Label>
                        <Select
                          value={newCourse.credits.toString()}
                          onValueChange={(value) => setNewCourse({...newCourse, credits: parseInt(value)})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Credit</SelectItem>
                            <SelectItem value="2">2 Credits</SelectItem>
                            <SelectItem value="3">3 Credits</SelectItem>
                            <SelectItem value="4">4 Credits</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={addCourse} className="w-full campus-button-primary">
                        Add Course
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {courses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-semibold">{course.code}</h3>
                          <p className="text-sm text-muted-foreground">{course.name}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{course.credits} Credits</Badge>
                          {course.facultyId && (
                            <Badge variant="secondary">
                              {faculty.find(f => f.id === course.facultyId)?.name || "Unknown Faculty"}
                            </Badge>
                          )}
                          {!course.facultyId && (
                            <Badge variant="destructive">Unassigned</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCourse(course.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
                {courses.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No courses added yet. Click "Add Course" to get started.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Room Management */}
        <TabsContent value="rooms" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="campus-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Rooms ({rooms.length})</span>
                </CardTitle>
                <CardDescription>Campus rooms with capacity warnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {rooms.map((room, index) => (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      className={`p-4 border rounded-lg transition-all hover:shadow-md ${getRoomStatusColor(room.utilization)}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{room.number}</h3>
                          <p className="text-sm opacity-80">{room.type}</p>
                        </div>
                        <Badge 
                          variant={room.utilization >= 80 ? "destructive" : 
                                  room.utilization >= 70 ? "default" : "secondary"}
                        >
                          {getRoomStatusLabel(room.utilization)}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Capacity:</span>
                          <span>{room.capacity}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Utilization:</span>
                          <span>{room.utilization}%</span>
                        </div>
                      </div>
                      {room.utilization >= 80 && (
                        <div className="flex items-center mt-2 text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          <span>High utilization warning</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Schedule Generator */}
        <TabsContent value="schedule" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="campus-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>AI-Powered Schedule Generator</span>
                </CardTitle>
                <CardDescription>
                  Generate optimal schedules using exclusive permutations to prevent conflicts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Generation Controls */}
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={generateSampleData}
                    variant="secondary"
                    className="h-11"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Load Sample Data
                  </Button>
                  
                  <Button 
                    onClick={generateSchedule}
                    disabled={isGenerating || faculty.length === 0 || courses.length === 0 || rooms.length === 0}
                    className="campus-button-primary"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Schedule
                      </>
                    )}
                  </Button>
                  
                  {scheduleResult && (
                    <>
                      <Button 
                        onClick={() => exportUniversityTimetable('json')}
                        variant="outline"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export University Timetable
                      </Button>
                      <Button 
                        onClick={() => exportSchedule('json')}
                        variant="outline"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export JSON
                      </Button>
                      <Button 
                        onClick={() => exportSchedule('csv')}
                        variant="outline"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button 
                        onClick={clearSchedule}
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Schedule
                      </Button>
                    </>
                  )}
                </div>

                {/* Progress Bar */}
                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Generating optimal schedule...</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                  </div>
                )}

                {/* Error Display */}
                {scheduleError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{scheduleError}</AlertDescription>
                  </Alert>
                )}

                {/* Schedule Statistics */}
                {scheduleResult && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="text-sm font-medium">Scheduled Classes</p>
                            <p className="text-2xl font-bold">{scheduleResult.scheduledClasses.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <div>
                            <p className="text-sm font-medium">Conflicts</p>
                            <p className="text-2xl font-bold">{scheduleResult.conflicts.length}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">Room Utilization</p>
                            <p className="text-2xl font-bold">{scheduleResult.utilization.roomUtilization}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-purple-500" />
                          <div>
                            <p className="text-sm font-medium">Schedule Score</p>
                            <p className="text-2xl font-bold">{scheduleResult.score}/100</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Conflicts Display */}
                {scheduleResult && scheduleResult.conflicts.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        <span>Schedule Conflicts</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {scheduleResult.conflicts.map((conflict, index) => (
                          <Alert key={index} variant={conflict.severity === 'critical' ? 'destructive' : 'default'}>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{conflict.description}</p>
                                  <p className="text-sm opacity-80">Type: {conflict.type.replace('_', ' ')}</p>
                                </div>
                                <Badge variant={conflict.severity === 'critical' ? 'destructive' : 'secondary'}>
                                  {conflict.severity}
                                </Badge>
                              </div>
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Scheduled Classes Table */}
                {scheduleResult && scheduleResult.scheduledClasses.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Generated Schedule</CardTitle>
                      <CardDescription>
                        {scheduleResult.scheduledClasses.length} classes scheduled successfully
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Course</th>
                              <th className="text-left p-2">Professor</th>
                              <th className="text-left p-2">Lecturer</th>
                              <th className="text-left p-2">Room</th>
                              <th className="text-left p-2">Day</th>
                              <th className="text-left p-2">Period</th>
                              <th className="text-left p-2">Time</th>
                              <th className="text-left p-2">Students</th>
                              <th className="text-left p-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scheduleResult.scheduledClasses.map((cls, index) => {
                              const course = courses.find(c => c.id === cls.courseId);
                              const professor = faculty.find(f => f.id === cls.professorId);
                              const lecturer = faculty.find(f => f.id === cls.lecturerId);
                              const room = rooms.find(r => r.id === cls.roomId);
                              
                              return (
                                <tr key={cls.id} className="border-b hover:bg-muted/50">
                                  <td className="p-2">
                                    <div>
                                      <p className="font-medium">{course?.code}</p>
                                      <p className="text-sm text-muted-foreground">{course?.name}</p>
                                    </div>
                                  </td>
                                  <td className="p-2">{professor?.name}</td>
                                  <td className="p-2">{lecturer?.name}</td>
                                  <td className="p-2">{room?.number}</td>
                                  <td className="p-2">{cls.timeSlot.day}</td>
                                  <td className="p-2">{cls.period}</td>
                                  <td className="p-2">
                                    {cls.timeSlot.startTime} - {cls.timeSlot.endTime}
                                  </td>
                                  <td className="p-2">{cls.studentCount}</td>
                                  <td className="p-2">
                                    <Badge 
                                      variant={cls.status === 'scheduled' ? 'default' : 'destructive'}
                                    >
                                      {cls.status}
                                    </Badge>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* No Schedule Message */}
                {!scheduleResult && !isGenerating && (
                  <div className="text-center py-8">
                    <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Schedule Generated</h3>
                    <p className="text-muted-foreground mb-4">
                      Click "Load Sample Data" to get started, or add your own faculty, courses, and rooms, then click "Generate Schedule" to create an optimal conflict-free timetable.
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <p>Current data:</p>
                      <p>• Faculty: {faculty.length}</p>
                      <p>• Courses: {courses.length}</p>
                      <p>• Rooms: {rooms.length}</p>
                    </div>
                    {faculty.length === 0 && courses.length === 0 && (
                      <div className="mt-4">
                        <Button 
                          onClick={generateSampleData}
                          variant="outline"
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Load Sample Data
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}