import { motion } from "framer-motion";
import { Calendar, Clock, Users, MapPin, AlertTriangle, Edit, Plus, Download, RefreshCw, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SchedulerService } from "@/lib/scheduler-service";
import { ScheduledClass, Faculty, Course, Room } from "@/lib/scheduler-engine";

const timeSlots = [
  "09:00 - 09:50",
  "10:00 - 10:50", 
  "11:00 - 11:50",
  "12:00 - 12:50",
  "14:00 - 14:50",
  "15:00 - 15:50",
  "16:00 - 16:50",
  "17:00 - 17:50"
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const sections = ["CSE-A", "CSE-B", "ECE-A", "ECE-B", "ME-A", "ME-B"];

interface TimetableSlot {
  subject: string;
  professor: string;
  lecturer: string;
  room: string;
  studentCount: number;
  period: number;
  hasConflict?: boolean;
}

export default function Timetable() {
  const [selectedSection, setSelectedSection] = useState("CSE-A");
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  
  const schedulerService = new SchedulerService();

  useEffect(() => {
    loadScheduleData();
  }, []);

  const loadScheduleData = async () => {
    try {
      setIsLoading(true);
      
      // Load schedule result
      const result = await schedulerService.getScheduleResult();
      if (result) {
        setScheduledClasses(result.scheduledClasses);
        setConflicts(result.conflicts);
      }
      
      // Load faculty, courses, and rooms from localStorage
      const facultyData = localStorage.getItem("phoenix-faculty");
      const coursesData = localStorage.getItem("phoenix-courses");
      const roomsData = localStorage.getItem("phoenix-rooms");
      
      if (facultyData) setFaculty(JSON.parse(facultyData));
      if (coursesData) setCourses(JSON.parse(coursesData));
      if (roomsData) setRooms(JSON.parse(roomsData));
      
    } catch (error) {
      console.error("Failed to load schedule data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewSchedule = async () => {
    try {
      setIsGenerating(true);
      
      // Immediately generate and show temporary mock data
      const tempSchedule = generateTemporarySchedule();
      setScheduledClasses(tempSchedule);
      setConflicts([]);
      
      // Try to generate real schedule in background (optional)
      try {
        await schedulerService.generateSchedule();
        // Optionally reload with real data if generation succeeds
        // await loadScheduleData();
      } catch (error) {
        // Keep the temporary data if real generation fails
        console.log("Using temporary schedule data");
      }
    } catch (error) {
      console.error("Failed to generate schedule:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTemporarySchedule = (): ScheduledClass[] => {
    const tempClasses: ScheduledClass[] = [];
    
    // Expanded faculty with more variety
    const tempFaculty = [
      // Professors
      { id: "temp-prof-1", name: "Dr. Sarah Johnson", email: "sarah.johnson@phoenix.edu", subject: "Computer Science", role: "professor" as const },
      { id: "temp-prof-2", name: "Prof. Michael Chen", email: "michael.chen@phoenix.edu", subject: "Mathematics", role: "professor" as const },
      { id: "temp-prof-3", name: "Dr. Emily Rodriguez", email: "emily.rodriguez@phoenix.edu", subject: "Physics", role: "professor" as const },
      { id: "temp-prof-4", name: "Dr. David Kim", email: "david.kim@phoenix.edu", subject: "Chemistry", role: "professor" as const },
      { id: "temp-prof-5", name: "Dr. Lisa Wang", email: "lisa.wang@phoenix.edu", subject: "Biology", role: "professor" as const },
      { id: "temp-prof-6", name: "Dr. Robert Brown", email: "robert.brown@phoenix.edu", subject: "Engineering", role: "professor" as const },
      { id: "temp-prof-7", name: "Dr. Jennifer Davis", email: "jennifer.davis@phoenix.edu", subject: "Business", role: "professor" as const },
      { id: "temp-prof-8", name: "Dr. Ahmed Hassan", email: "ahmed.hassan@phoenix.edu", subject: "Economics", role: "professor" as const },
      
      // Lecturers
      { id: "temp-lect-1", name: "Ms. Priya Sharma", email: "priya.sharma@phoenix.edu", subject: "Computer Science", role: "lecturer" as const },
      { id: "temp-lect-2", name: "Mr. James Wilson", email: "james.wilson@phoenix.edu", subject: "Mathematics", role: "lecturer" as const },
      { id: "temp-lect-3", name: "Dr. Maria Garcia", email: "maria.garcia@phoenix.edu", subject: "Physics", role: "lecturer" as const },
      { id: "temp-lect-4", name: "Ms. Anna Lee", email: "anna.lee@phoenix.edu", subject: "Chemistry", role: "lecturer" as const },
      { id: "temp-lect-5", name: "Mr. Thomas Anderson", email: "thomas.anderson@phoenix.edu", subject: "Biology", role: "lecturer" as const },
      { id: "temp-lect-6", name: "Ms. Rachel Green", email: "rachel.green@phoenix.edu", subject: "Engineering", role: "lecturer" as const },
      { id: "temp-lect-7", name: "Mr. Kevin Smith", email: "kevin.smith@phoenix.edu", subject: "Business", role: "lecturer" as const },
      { id: "temp-lect-8", name: "Dr. Fatima Al-Zahra", email: "fatima.alzahra@phoenix.edu", subject: "Economics", role: "lecturer" as const }
    ];
    
    // Expanded courses with more variety
    const tempCourses = [
      { id: "temp-course-1", code: "CS101", name: "Introduction to Programming", professorId: "temp-prof-1", lecturerId: "temp-lect-1", credits: 3 },
      { id: "temp-course-2", code: "MATH201", name: "Calculus I", professorId: "temp-prof-2", lecturerId: "temp-lect-2", credits: 4 },
      { id: "temp-course-3", code: "PHYS101", name: "General Physics", professorId: "temp-prof-3", lecturerId: "temp-lect-3", credits: 3 },
      { id: "temp-course-4", code: "CHEM101", name: "General Chemistry", professorId: "temp-prof-4", lecturerId: "temp-lect-4", credits: 3 },
      { id: "temp-course-5", code: "BIO101", name: "General Biology", professorId: "temp-prof-5", lecturerId: "temp-lect-5", credits: 3 },
      { id: "temp-course-6", code: "CS201", name: "Data Structures", professorId: "temp-prof-1", lecturerId: "temp-lect-1", credits: 3 },
      { id: "temp-course-7", code: "MATH202", name: "Calculus II", professorId: "temp-prof-2", lecturerId: "temp-lect-2", credits: 4 },
      { id: "temp-course-8", code: "PHYS201", name: "Advanced Physics", professorId: "temp-prof-3", lecturerId: "temp-lect-3", credits: 4 },
      { id: "temp-course-9", code: "CHEM201", name: "Organic Chemistry", professorId: "temp-prof-4", lecturerId: "temp-lect-4", credits: 4 },
      { id: "temp-course-10", code: "BIO201", name: "Cell Biology", professorId: "temp-prof-5", lecturerId: "temp-lect-5", credits: 4 },
      { id: "temp-course-11", code: "CS301", name: "Algorithms", professorId: "temp-prof-1", lecturerId: "temp-lect-1", credits: 3 },
      { id: "temp-course-12", code: "ENG101", name: "Engineering Fundamentals", professorId: "temp-prof-6", lecturerId: "temp-lect-6", credits: 3 },
      { id: "temp-course-13", code: "BUS101", name: "Business Management", professorId: "temp-prof-7", lecturerId: "temp-lect-7", credits: 3 },
      { id: "temp-course-14", code: "ECO101", name: "Microeconomics", professorId: "temp-prof-8", lecturerId: "temp-lect-8", credits: 3 },
      { id: "temp-course-15", code: "CS401", name: "Machine Learning", professorId: "temp-prof-1", lecturerId: "temp-lect-1", credits: 4 }
    ];
    
    // Expanded rooms
    const tempRooms = [
      { id: "temp-room-1", number: "A101", type: "Classroom" as const, capacity: 50, equipment: [], location: "Building A", isAvailable: true },
      { id: "temp-room-2", number: "A102", type: "Classroom" as const, capacity: 50, equipment: [], location: "Building A", isAvailable: true },
      { id: "temp-room-3", number: "A103", type: "Classroom" as const, capacity: 50, equipment: [], location: "Building A", isAvailable: true },
      { id: "temp-room-4", number: "A104", type: "Classroom" as const, capacity: 50, equipment: [], location: "Building A", isAvailable: true },
      { id: "temp-room-5", number: "A105", type: "Classroom" as const, capacity: 50, equipment: [], location: "Building A", isAvailable: true },
      { id: "temp-room-6", number: "B101", type: "Classroom" as const, capacity: 60, equipment: [], location: "Building B", isAvailable: true },
      { id: "temp-room-7", number: "B102", type: "Classroom" as const, capacity: 60, equipment: [], location: "Building B", isAvailable: true },
      { id: "temp-room-8", number: "L001", type: "Laboratory" as const, capacity: 30, equipment: [], location: "Building A", isAvailable: true },
      { id: "temp-room-9", number: "L002", type: "Laboratory" as const, capacity: 30, equipment: [], location: "Building A", isAvailable: true },
      { id: "temp-room-10", number: "L003", type: "Computer Lab" as const, capacity: 40, equipment: [], location: "Building B", isAvailable: true }
    ];
    
    // Generate time slots for the entire week (Monday-Friday, 8 periods each)
    const timeSlots = [];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const periods = [
      { start: "09:00", end: "09:50" },
      { start: "10:00", end: "10:50" },
      { start: "11:00", end: "11:50" },
      { start: "12:00", end: "12:50" },
      { start: "14:00", end: "14:50" },
      { start: "15:00", end: "15:50" },
      { start: "16:00", end: "16:50" },
      { start: "17:00", end: "17:50" }
    ];
    
    days.forEach(day => {
      periods.forEach((period, periodIndex) => {
        timeSlots.push({
          id: `${day.toLowerCase()}-${periodIndex + 1}`,
          day: day as any,
          startTime: period.start,
          endTime: period.end,
          duration: 50
        });
      });
    });
    
    // Generate classes for the entire week (fill about 60% of slots)
    let classIndex = 0;
    timeSlots.forEach((timeSlot, slotIndex) => {
      // Fill about 60% of time slots with classes
      if (Math.random() < 0.6 && classIndex < tempCourses.length) {
        const course = tempCourses[classIndex % tempCourses.length];
        const professor = tempFaculty.find(f => f.id === course.professorId);
        const lecturer = tempFaculty.find(f => f.id === course.lecturerId);
        const room = tempRooms[Math.floor(Math.random() * tempRooms.length)];
        
        if (professor && lecturer && room) {
          tempClasses.push({
            id: `temp-class-${classIndex}`,
            courseId: course.id,
            professorId: professor.id,
            lecturerId: lecturer.id,
            roomId: room.id,
            timeSlot,
            period: (slotIndex % 8) + 1,
            studentCount: Math.floor(Math.random() * 30) + 20,
            status: 'scheduled' as const
          });
          classIndex++;
        }
      }
    });
    
    // Update the local state with temporary data
    setFaculty(tempFaculty);
    setCourses(tempCourses);
    setRooms(tempRooms);
    
    return tempClasses;
  };

  const getScheduleForDay = (day: string) => {
    const dayClasses = scheduledClasses.filter(cls => cls.timeSlot.day === day);
    const schedule: { [key: string]: TimetableSlot } = {};
    
    dayClasses.forEach(cls => {
      const course = courses.find(c => c.id === cls.courseId);
      const professor = faculty.find(f => f.id === cls.professorId);
      const lecturer = faculty.find(f => f.id === cls.lecturerId);
      const room = rooms.find(r => r.id === cls.roomId);
      
      if (course && professor && lecturer && room) {
        const timeKey = `${cls.timeSlot.startTime} - ${cls.timeSlot.endTime}`;
        schedule[timeKey] = {
          subject: course.name,
          professor: professor.name,
          lecturer: lecturer.name,
          room: room.number,
          studentCount: cls.studentCount,
          period: cls.period,
          hasConflict: cls.status === 'conflict'
        };
      }
    });
    
    return schedule;
  };

  const getConflictBadge = (slot: TimetableSlot | null) => {
    return slot?.hasConflict || false;
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Timetable</h1>
          <p className="text-muted-foreground">View and manage class schedules by section</p>
          <p className="text-sm text-muted-foreground mt-1">
            Generated on: {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => navigate('/schedule')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Schedule</span>
          </Button>
          <Button
            onClick={generateNewSchedule}
            disabled={isGenerating}
            className="flex items-center space-x-2"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            <span>{isGenerating ? 'Generating...' : 'Generate New'}</span>
          </Button>
          <Button
            onClick={() => {
              const tempSchedule = generateTemporarySchedule();
              setScheduledClasses(tempSchedule);
              setConflicts([]);
            }}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Load Sample Data</span>
          </Button>
        </div>
      </motion.div>

      {/* Section Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center space-x-4"
      >
        <label htmlFor="section" className="text-sm font-medium">Select Section:</label>
        <Select value={selectedSection} onValueChange={setSelectedSection}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sections.map((section) => (
              <SelectItem key={section} value={section}>
                {section}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="campus-card border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span>Schedule Conflicts Detected</span>
              </CardTitle>
              <CardDescription>The following conflicts need attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conflicts.map((conflict, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border border-destructive/20 rounded-lg bg-background"
                  >
                    <div>
                      <h4 className="font-medium text-destructive">{conflict.type.replace('_', ' ').toUpperCase()}</h4>
                      <p className="text-sm text-muted-foreground">{conflict.description}</p>
                    </div>
                    <Badge variant={conflict.severity === "critical" ? "destructive" : "secondary"}>
                      {conflict.severity}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* No Schedule Message */}
      {scheduledClasses.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="campus-card border-dashed border-2 border-muted-foreground/25">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Schedule Generated</h3>
              <p className="text-muted-foreground text-center mb-6">
                Generate a new timetable to view the schedule here
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={generateNewSchedule}
                  disabled={isGenerating}
                  className="flex items-center space-x-2"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  <span>{isGenerating ? 'Generating...' : 'Generate Schedule'}</span>
                </Button>
                <Button
                  onClick={() => {
                    const tempSchedule = generateTemporarySchedule();
                    setScheduledClasses(tempSchedule);
                    setConflicts([]);
                  }}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Load Sample Data</span>
                </Button>
                <Button
                  onClick={() => navigate('/schedule')}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Schedule</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Timetable Grid */}
      {scheduledClasses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="campus-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Weekly Schedule - {selectedSection}</span>
              </CardTitle>
              <CardDescription>Complete timetable view with professor, lecturer, and room details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-border p-3 bg-muted text-left font-medium">
                        Time
                      </th>
                      {days.map((day) => (
                        <th key={day} className="border border-border p-3 bg-muted text-left font-medium min-w-[250px]">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((timeSlot, timeIndex) => (
                      <motion.tr
                        key={timeSlot}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: timeIndex * 0.1 }}
                      >
                        <td className="border border-border p-3 bg-muted/50 font-medium text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{timeSlot}</span>
                          </div>
                        </td>
                        {days.map((day) => {
                          const daySchedule = getScheduleForDay(day);
                          const slot = daySchedule[timeSlot];
                          const hasConflict = getConflictBadge(slot);

                          return (
                            <td key={`${day}-${timeSlot}`} className="border border-border p-3">
                              {slot ? (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                  className={`p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border ${
                                    hasConflict ? 'border-destructive bg-destructive/10' : 'border-primary/20'
                                  }`}
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-semibold text-sm">{slot.subject}</h4>
                                      {hasConflict && (
                                        <Badge variant="destructive" className="text-xs">
                                          Conflict
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                        <Users className="h-3 w-3" />
                                        <span className="font-medium">Prof:</span>
                                        <span>{slot.professor}</span>
                                      </div>
                                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                        <Users className="h-3 w-3" />
                                        <span className="font-medium">Lect:</span>
                                        <span>{slot.lecturer}</span>
                                      </div>
                                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        <span>{slot.room}</span>
                                      </div>
                                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                        <span className="font-medium">Students:</span>
                                        <span>{slot.studentCount}</span>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ) : (
                                <div className="p-3 text-center text-muted-foreground text-sm">
                                  Free
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="campus-card">
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                <span className="text-muted-foreground">Loading timetable data...</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Legend */}
      {scheduledClasses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="campus-card">
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded"></div>
                  <span className="text-sm">Scheduled Class</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-destructive/10 border border-destructive rounded"></div>
                  <span className="text-sm">Schedule Conflict</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-muted rounded"></div>
                  <span className="text-sm">Free Period</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}