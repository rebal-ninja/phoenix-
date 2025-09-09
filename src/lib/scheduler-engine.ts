// Core types for the scheduler engine
export interface TimeSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // Format: "HH:MM"
  endTime: string;   // Format: "HH:MM"
  duration: number;  // in minutes
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  subject: string;
  maxHoursPerWeek: number;
  preferredTimeSlots: TimeSlot[];
  unavailableTimeSlots: TimeSlot[];
  department: string;
  role: 'professor' | 'lecturer';
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  professorId?: string;
  lecturerId?: string;
  requiredRoomType: 'Classroom' | 'Laboratory' | 'Computer Lab' | 'Seminar Hall';
  maxStudents: number;
  duration: number; // in minutes
  frequency: number; // times per week
}

export interface Room {
  id: string;
  number: string;
  type: 'Classroom' | 'Laboratory' | 'Computer Lab' | 'Seminar Hall' | 'Library' | 'Club Room';
  capacity: number;
  equipment: string[];
  location: string;
  isAvailable: boolean;
}

export interface ScheduledClass {
  id: string;
  courseId: string;
  professorId: string;
  lecturerId: string;
  roomId: string;
  timeSlot: TimeSlot;
  period: number;
  studentCount: number;
  status: 'scheduled' | 'conflict' | 'pending';
}

export interface ScheduleConstraints {
  maxClassesPerDay: number;
  maxClassesPerFaculty: number;
  minBreakBetweenClasses: number; // in minutes
  workingHours: {
    start: string;
    end: string;
  };
  lunchBreak: {
    start: string;
    end: string;
  };
}

export interface ScheduleResult {
  scheduledClasses: ScheduledClass[];
  conflicts: Conflict[];
  utilization: {
    roomUtilization: number;
    facultyUtilization: number;
    timeSlotUtilization: number;
  };
  score: number; // Overall schedule quality score (0-100)
}

export interface Conflict {
  type: 'faculty_conflict' | 'room_conflict' | 'time_conflict' | 'capacity_conflict';
  description: string;
  affectedClasses: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Time slot generation
export class TimeSlotGenerator {
  private static readonly PERIODS = [
    { period: 1, start: "09:00", end: "09:50", duration: 50 },
    { period: 2, start: "10:00", end: "10:50", duration: 50 },
    { period: 3, start: "11:00", end: "11:50", duration: 50 },
    { period: 4, start: "12:00", end: "12:50", duration: 50 },
    { period: 5, start: "14:00", end: "14:50", duration: 50 },
    { period: 6, start: "15:00", end: "15:50", duration: 50 },
    { period: 7, start: "16:00", end: "16:50", duration: 50 },
    { period: 8, start: "17:00", end: "17:50", duration: 50 },
  ];

  static generateTimeSlots(days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']): TimeSlot[] {
    const slots: TimeSlot[] = [];
    
    days.forEach(day => {
      this.PERIODS.forEach((period) => {
        slots.push({
          id: `${day.toLowerCase()}-${period.period}`,
          day: day as any,
          startTime: period.start,
          endTime: period.end,
          duration: period.duration
        });
      });
    });
    
    return slots;
  }

  static getPeriodNumber(timeSlot: TimeSlot): number {
    const period = this.PERIODS.find(p => p.start === timeSlot.startTime);
    return period ? period.period : 1;
  }
}

// Conflict detection engine
export class ConflictDetector {
  static detectConflicts(classes: ScheduledClass[]): Conflict[] {
    const conflicts: Conflict[] = [];
    
    // Check for faculty conflicts
    const facultyConflicts = this.detectFacultyConflicts(classes);
    conflicts.push(...facultyConflicts);
    
    // Check for room conflicts
    const roomConflicts = this.detectRoomConflicts(classes);
    conflicts.push(...roomConflicts);
    
    // Check for time conflicts
    const timeConflicts = this.detectTimeConflicts(classes);
    conflicts.push(...timeConflicts);
    
    // Check for capacity conflicts
    const capacityConflicts = this.detectCapacityConflicts(classes);
    conflicts.push(...capacityConflicts);
    
    return conflicts;
  }
  
  private static detectFacultyConflicts(classes: ScheduledClass[]): Conflict[] {
    const conflicts: Conflict[] = [];
    const professorSchedule = new Map<string, ScheduledClass[]>();
    const lecturerSchedule = new Map<string, ScheduledClass[]>();
    
    // Group classes by professor and lecturer
    classes.forEach(cls => {
      if (!professorSchedule.has(cls.professorId)) {
        professorSchedule.set(cls.professorId, []);
      }
      professorSchedule.get(cls.professorId)!.push(cls);
      
      if (!lecturerSchedule.has(cls.lecturerId)) {
        lecturerSchedule.set(cls.lecturerId, []);
      }
      lecturerSchedule.get(cls.lecturerId)!.push(cls);
    });
    
    // Check for professor conflicts
    professorSchedule.forEach((professorClasses, professorId) => {
      for (let i = 0; i < professorClasses.length; i++) {
        for (let j = i + 1; j < professorClasses.length; j++) {
          const class1 = professorClasses[i];
          const class2 = professorClasses[j];
          
          if (this.isTimeOverlapping(class1.timeSlot, class2.timeSlot)) {
            conflicts.push({
              type: 'faculty_conflict',
              description: `Professor has overlapping classes: ${class1.timeSlot.day} ${class1.timeSlot.startTime}-${class1.timeSlot.endTime}`,
              affectedClasses: [class1.id, class2.id],
              severity: 'critical'
            });
          }
        }
      }
    });
    
    // Check for lecturer conflicts
    lecturerSchedule.forEach((lecturerClasses, lecturerId) => {
      for (let i = 0; i < lecturerClasses.length; i++) {
        for (let j = i + 1; j < lecturerClasses.length; j++) {
          const class1 = lecturerClasses[i];
          const class2 = lecturerClasses[j];
          
          if (this.isTimeOverlapping(class1.timeSlot, class2.timeSlot)) {
            conflicts.push({
              type: 'faculty_conflict',
              description: `Lecturer has overlapping classes: ${class1.timeSlot.day} ${class1.timeSlot.startTime}-${class1.timeSlot.endTime}`,
              affectedClasses: [class1.id, class2.id],
              severity: 'critical'
            });
          }
        }
      }
    });
    
    return conflicts;
  }
  
  private static detectRoomConflicts(classes: ScheduledClass[]): Conflict[] {
    const conflicts: Conflict[] = [];
    const roomSchedule = new Map<string, ScheduledClass[]>();
    
    // Group classes by room
    classes.forEach(cls => {
      if (!roomSchedule.has(cls.roomId)) {
        roomSchedule.set(cls.roomId, []);
      }
      roomSchedule.get(cls.roomId)!.push(cls);
    });
    
    // Check for overlapping time slots
    roomSchedule.forEach((roomClasses, roomId) => {
      for (let i = 0; i < roomClasses.length; i++) {
        for (let j = i + 1; j < roomClasses.length; j++) {
          const class1 = roomClasses[i];
          const class2 = roomClasses[j];
          
          if (this.isTimeOverlapping(class1.timeSlot, class2.timeSlot)) {
            conflicts.push({
              type: 'room_conflict',
              description: `Room has overlapping classes: ${class1.timeSlot.day} ${class1.timeSlot.startTime}-${class1.timeSlot.endTime}`,
              affectedClasses: [class1.id, class2.id],
              severity: 'critical'
            });
          }
        }
      }
    });
    
    return conflicts;
  }
  
  private static detectTimeConflicts(classes: ScheduledClass[]): Conflict[] {
    const conflicts: Conflict[] = [];
    
    // Check for classes scheduled outside working hours
    classes.forEach(cls => {
      const startTime = this.timeToMinutes(cls.timeSlot.startTime);
      const endTime = this.timeToMinutes(cls.timeSlot.endTime);
      const workingStart = this.timeToMinutes("08:00");
      const workingEnd = this.timeToMinutes("18:30");
      
      if (startTime < workingStart || endTime > workingEnd) {
        conflicts.push({
          type: 'time_conflict',
          description: `Class scheduled outside working hours: ${cls.timeSlot.day} ${cls.timeSlot.startTime}-${cls.timeSlot.endTime}`,
          affectedClasses: [cls.id],
          severity: 'high'
        });
      }
    });
    
    return conflicts;
  }
  
  private static detectCapacityConflicts(classes: ScheduledClass[]): Conflict[] {
    const conflicts: Conflict[] = [];
    
    // This would require room capacity data - simplified for now
    classes.forEach(cls => {
      if (cls.studentCount > 100) { // Assuming max capacity
        conflicts.push({
          type: 'capacity_conflict',
          description: `Class exceeds room capacity: ${cls.studentCount} students`,
          affectedClasses: [cls.id],
          severity: 'medium'
        });
      }
    });
    
    return conflicts;
  }
  
  private static isTimeOverlapping(slot1: TimeSlot, slot2: TimeSlot): boolean {
    if (slot1.day !== slot2.day) return false;
    
    const start1 = this.timeToMinutes(slot1.startTime);
    const end1 = this.timeToMinutes(slot1.endTime);
    const start2 = this.timeToMinutes(slot2.startTime);
    const end2 = this.timeToMinutes(slot2.endTime);
    
    return !(end1 <= start2 || end2 <= start1);
  }
  
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

// Main scheduler engine with exclusive permutations
export class SchedulerEngine {
  private constraints: ScheduleConstraints;
  private timeSlots: TimeSlot[];
  
  constructor(constraints: ScheduleConstraints) {
    this.constraints = constraints;
    this.timeSlots = TimeSlotGenerator.generateTimeSlots();
  }
  
  generateSchedule(
    courses: Course[],
    faculty: Faculty[],
    rooms: Room[]
  ): ScheduleResult {
    console.log('Starting schedule generation...');
    
    // Filter available rooms by type
    const availableRooms = rooms.filter(room => room.isAvailable);
    
    // Try to generate a conflict-free schedule first
    const conflictFreeSchedule = this.generateConflictFreeSchedule(courses, faculty, availableRooms);
    
    if (conflictFreeSchedule.length > 0) {
      console.log('Generated conflict-free schedule with', conflictFreeSchedule.length, 'classes');
      const utilization = this.calculateUtilization(conflictFreeSchedule, faculty, availableRooms);
      
      return {
        scheduledClasses: conflictFreeSchedule,
        conflicts: [],
        utilization,
        score: 100
      };
    }
    
    // If no conflict-free schedule found, generate best possible schedule
    console.log('No conflict-free schedule found, generating best possible schedule...');
    const permutations = this.generatePermutations(courses, faculty, availableRooms);
    
    // Find the best schedule
    let bestSchedule: ScheduledClass[] = [];
    let bestScore = -1;
    let bestConflicts: Conflict[] = [];
    
    // Limit permutations to prevent infinite loops
    const maxPermutations = Math.min(permutations.length, 1000);
    
    for (let i = 0; i < maxPermutations; i++) {
      const permutation = permutations[i];
      const conflicts = ConflictDetector.detectConflicts(permutation);
      const score = this.calculateScheduleScore(permutation, conflicts);
      
      if (score > bestScore) {
        bestScore = score;
        bestSchedule = permutation;
        bestConflicts = conflicts;
      }
      
      // If we found a perfect schedule (no critical conflicts), use it
      const criticalConflicts = conflicts.filter(c => c.severity === 'critical');
      if (criticalConflicts.length === 0) {
        break;
      }
    }
    
    // Calculate utilization metrics
    const utilization = this.calculateUtilization(bestSchedule, faculty, availableRooms);
    
    return {
      scheduledClasses: bestSchedule,
      conflicts: bestConflicts,
      utilization,
      score: bestScore
    };
  }

  private generateConflictFreeSchedule(
    courses: Course[],
    faculty: Faculty[],
    rooms: Room[]
  ): ScheduledClass[] {
    const schedule: ScheduledClass[] = [];
    const usedTimeSlots = new Set<string>();
    const professorSchedule = new Map<string, ScheduledClass[]>();
    const lecturerSchedule = new Map<string, ScheduledClass[]>();
    const roomSchedule = new Map<string, ScheduledClass[]>();
    
    // Initialize tracking maps
    faculty.forEach(f => {
      if (f.role === 'professor') {
        professorSchedule.set(f.id, []);
      } else {
        lecturerSchedule.set(f.id, []);
      }
    });
    rooms.forEach(r => {
      roomSchedule.set(r.id, []);
    });
    
    // Sort courses by priority (credits, then name)
    const sortedCourses = [...courses].sort((a, b) => {
      if (a.credits !== b.credits) return b.credits - a.credits;
      return a.name.localeCompare(b.name);
    });
    
    for (const course of sortedCourses) {
      // Find suitable professor and lecturer for this course
      const professors = faculty.filter(f => 
        f.role === 'professor' && (
          f.subject.toLowerCase().includes(course.name.toLowerCase()) ||
          f.department.toLowerCase().includes(course.name.toLowerCase()) ||
          f.subject.toLowerCase().includes('computer') ||
          f.subject.toLowerCase().includes('science')
        )
      );
      
      const lecturers = faculty.filter(f => 
        f.role === 'lecturer' && (
          f.subject.toLowerCase().includes(course.name.toLowerCase()) ||
          f.department.toLowerCase().includes(course.name.toLowerCase()) ||
          f.subject.toLowerCase().includes('computer') ||
          f.subject.toLowerCase().includes('science')
        )
      );
      
      if (professors.length === 0 || lecturers.length === 0) continue;
      
      // Find suitable rooms for this course
      const suitableRooms = rooms.filter(room => 
        room.type === course.requiredRoomType && 
        room.capacity >= course.maxStudents &&
        room.isAvailable
      );
      
      if (suitableRooms.length === 0) continue;
      
      // Try to schedule this course without conflicts
      let scheduled = false;
      
      for (const professor of professors) {
        if (scheduled) break;
        
        const professorClasses = professorSchedule.get(professor.id) || [];
        if (professorClasses.length >= this.constraints.maxClassesPerFaculty) continue;
        
        for (const lecturer of lecturers) {
          if (scheduled) break;
          
          const lecturerClasses = lecturerSchedule.get(lecturer.id) || [];
          if (lecturerClasses.length >= this.constraints.maxClassesPerFaculty) continue;
          
          for (const room of suitableRooms) {
            if (scheduled) break;
            
            for (const timeSlot of this.timeSlots) {
              if (scheduled) break;
              
              const timeSlotKey = `${timeSlot.day}-${timeSlot.startTime}-${room.id}`;
              
              // Check if time slot is already used
              if (usedTimeSlots.has(timeSlotKey)) continue;
              
              // Check professor availability for this time slot
              const hasProfessorConflict = professorClasses.some(cls => 
                cls.timeSlot.day === timeSlot.day &&
                this.isTimeOverlapping(cls.timeSlot, timeSlot)
              );
              
              if (hasProfessorConflict) continue;
              
              // Check lecturer availability for this time slot
              const hasLecturerConflict = lecturerClasses.some(cls => 
                cls.timeSlot.day === timeSlot.day &&
                this.isTimeOverlapping(cls.timeSlot, timeSlot)
              );
              
              if (hasLecturerConflict) continue;
              
              // Check room availability for this time slot
              const roomClasses = roomSchedule.get(room.id) || [];
              const hasRoomConflict = roomClasses.some(cls => 
                cls.timeSlot.day === timeSlot.day &&
                this.isTimeOverlapping(cls.timeSlot, timeSlot)
              );
              
              if (hasRoomConflict) continue;
              
              // Create scheduled class
              const scheduledClass: ScheduledClass = {
                id: `class-${course.id}-${Date.now()}-${Math.random()}`,
                courseId: course.id,
                professorId: professor.id,
                lecturerId: lecturer.id,
                roomId: room.id,
                timeSlot,
                period: TimeSlotGenerator.getPeriodNumber(timeSlot),
                studentCount: Math.min(course.maxStudents, room.capacity),
                status: 'scheduled'
              };
              
              // Add to schedule
              schedule.push(scheduledClass);
              
              // Mark time slot as used
              usedTimeSlots.add(timeSlotKey);
              
              // Update tracking maps
              professorClasses.push(scheduledClass);
              professorSchedule.set(professor.id, professorClasses);
              
              lecturerClasses.push(scheduledClass);
              lecturerSchedule.set(lecturer.id, lecturerClasses);
              
              const roomClassesList = roomSchedule.get(room.id) || [];
              roomClassesList.push(scheduledClass);
              roomSchedule.set(room.id, roomClassesList);
              
              scheduled = true;
            }
          }
        }
      }
    }
    
    return schedule;
  }
  
  private generatePermutations(
    courses: Course[],
    faculty: Faculty[],
    rooms: Room[]
  ): ScheduledClass[][] {
    const permutations: ScheduledClass[][] = [];
    
    // Create a simplified permutation generator
    // In a real implementation, this would be more sophisticated
    const maxAttempts = 100;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const schedule: ScheduledClass[] = [];
      const usedTimeSlots = new Set<string>();
      const facultySchedule = new Map<string, ScheduledClass[]>();
      
      // Initialize faculty schedule tracking
      faculty.forEach(f => {
        facultySchedule.set(f.id, []);
      });
      
      for (const course of courses) {
        // Find suitable faculty for this course
        const suitableFaculty = faculty.filter(f => 
          f.subject.toLowerCase().includes(course.name.toLowerCase()) ||
          f.department.toLowerCase().includes(course.name.toLowerCase())
        );
        
        if (suitableFaculty.length === 0) continue;
        
        // Find suitable rooms for this course
        const suitableRooms = rooms.filter(room => 
          room.type === course.requiredRoomType && 
          room.capacity >= course.maxStudents
        );
        
        if (suitableRooms.length === 0) continue;
        
        // Try to schedule this course
        const scheduled = this.scheduleCourse(
          course,
          suitableFaculty,
          suitableRooms,
          schedule,
          usedTimeSlots,
          facultySchedule
        );
        
        if (scheduled) {
          schedule.push(scheduled);
        }
      }
      
      if (schedule.length > 0) {
        permutations.push(schedule);
      }
    }
    
    return permutations;
  }
  
  private scheduleCourse(
    course: Course,
    faculty: Faculty[],
    rooms: Room[],
    existingSchedule: ScheduledClass[],
    usedTimeSlots: Set<string>,
    facultySchedule: Map<string, ScheduledClass[]>
  ): ScheduledClass | null {
    
    // Shuffle arrays for randomization
    const shuffledFaculty = [...faculty].sort(() => Math.random() - 0.5);
    const shuffledRooms = [...rooms].sort(() => Math.random() - 0.5);
    const shuffledTimeSlots = [...this.timeSlots].sort(() => Math.random() - 0.5);
    
    for (const facultyMember of shuffledFaculty) {
      // Check faculty availability
      const facultyClasses = facultySchedule.get(facultyMember.id) || [];
      if (facultyClasses.length >= this.constraints.maxClassesPerFaculty) {
        continue;
      }
      
      for (const room of shuffledRooms) {
        for (const timeSlot of shuffledTimeSlots) {
          const timeSlotKey = `${timeSlot.day}-${timeSlot.startTime}-${room.id}`;
          
          // Check if time slot is already used
          if (usedTimeSlots.has(timeSlotKey)) {
            continue;
          }
          
          // Check faculty availability for this time slot
          const hasConflict = facultyClasses.some(cls => 
            cls.timeSlot.day === timeSlot.day &&
            this.isTimeOverlapping(cls.timeSlot, timeSlot)
          );
          
          if (hasConflict) {
            continue;
          }
          
          // Check room availability for this time slot
          const roomClasses = existingSchedule.filter(cls => cls.roomId === room.id);
          const roomConflict = roomClasses.some(cls => 
            cls.timeSlot.day === timeSlot.day &&
            this.isTimeOverlapping(cls.timeSlot, timeSlot)
          );
          
          if (roomConflict) {
            continue;
          }
          
          // Create scheduled class
          const scheduledClass: ScheduledClass = {
            id: `class-${course.id}-${Date.now()}-${Math.random()}`,
            courseId: course.id,
            facultyId: facultyMember.id,
            roomId: room.id,
            timeSlot,
            studentCount: Math.min(course.maxStudents, room.capacity),
            status: 'scheduled'
          };
          
          // Mark time slot as used
          usedTimeSlots.add(timeSlotKey);
          
          // Update faculty schedule
          facultyClasses.push(scheduledClass);
          facultySchedule.set(facultyMember.id, facultyClasses);
          
          return scheduledClass;
        }
      }
    }
    
    return null;
  }
  
  private isTimeOverlapping(slot1: TimeSlot, slot2: TimeSlot): boolean {
    if (slot1.day !== slot2.day) return false;
    
    const start1 = this.timeToMinutes(slot1.startTime);
    const end1 = this.timeToMinutes(slot1.endTime);
    const start2 = this.timeToMinutes(slot2.startTime);
    const end2 = this.timeToMinutes(slot2.endTime);
    
    return !(end1 <= start2 || end2 <= start1);
  }
  
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  private calculateScheduleScore(schedule: ScheduledClass[], conflicts: Conflict[]): number {
    let score = 100;
    
    // Deduct points for conflicts
    conflicts.forEach(conflict => {
      switch (conflict.severity) {
        case 'critical':
          score -= 20;
          break;
        case 'high':
          score -= 10;
          break;
        case 'medium':
          score -= 5;
          break;
        case 'low':
          score -= 2;
          break;
      }
    });
    
    // Bonus for scheduling more classes
    const scheduledRatio = schedule.length / 50; // Assuming max 50 classes
    score += scheduledRatio * 10;
    
    return Math.max(0, Math.min(100, score));
  }
  
  // Public method to detect conflicts
  detectConflicts(classes: ScheduledClass[]): Conflict[] {
    return ConflictDetector.detectConflicts(classes);
  }

  private calculateUtilization(
    schedule: ScheduledClass[],
    faculty: Faculty[],
    rooms: Room[]
  ): { roomUtilization: number; facultyUtilization: number; timeSlotUtilization: number } {
    
    // Room utilization
    const totalRoomCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
    const usedRoomCapacity = schedule.reduce((sum, cls) => {
      const room = rooms.find(r => r.id === cls.roomId);
      return sum + (room ? cls.studentCount : 0);
    }, 0);
    const roomUtilization = totalRoomCapacity > 0 ? (usedRoomCapacity / totalRoomCapacity) * 100 : 0;
    
    // Faculty utilization
    const totalFacultyCapacity = faculty.reduce((sum, f) => sum + f.maxHoursPerWeek, 0);
    const usedFacultyHours = schedule.length * 1.5; // Assuming 1.5 hours per class
    const facultyUtilization = totalFacultyCapacity > 0 ? (usedFacultyHours / totalFacultyCapacity) * 100 : 0;
    
    // Time slot utilization
    const totalTimeSlots = this.timeSlots.length;
    const usedTimeSlots = new Set(schedule.map(cls => `${cls.timeSlot.day}-${cls.timeSlot.startTime}`)).size;
    const timeSlotUtilization = totalTimeSlots > 0 ? (usedTimeSlots / totalTimeSlots) * 100 : 0;
    
    return {
      roomUtilization: Math.round(roomUtilization * 100) / 100,
      facultyUtilization: Math.round(facultyUtilization * 100) / 100,
      timeSlotUtilization: Math.round(timeSlotUtilization * 100) / 100
    };
  }
}
