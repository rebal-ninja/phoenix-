import { 
  SchedulerEngine, 
  ScheduleResult, 
  Course, 
  Faculty, 
  Room, 
  ScheduleConstraints,
  ScheduledClass,
  Conflict
} from './scheduler-engine';

export class SchedulerService {
  private engine: SchedulerEngine;
  
  constructor() {
    const constraints: ScheduleConstraints = {
      maxClassesPerDay: 6,
      maxClassesPerFaculty: 4,
      minBreakBetweenClasses: 30,
      workingHours: {
        start: "08:00",
        end: "18:30"
      },
      lunchBreak: {
        start: "12:30",
        end: "14:00"
      }
    };
    
    this.engine = new SchedulerEngine(constraints);
  }
  
  async generateSchedule(
    courses: Course[],
    faculty: Faculty[],
    rooms: Room[]
  ): Promise<ScheduleResult> {
    try {
      console.log('Generating schedule with:', {
        courses: courses.length,
        faculty: faculty.length,
        rooms: rooms.length
      });
      
      const result = this.engine.generateSchedule(courses, faculty, rooms);
      
      // Store the result in localStorage for persistence
      localStorage.setItem('phoenix-schedule-result', JSON.stringify(result));
      
      return result;
    } catch (error) {
      console.error('Error generating schedule:', error);
      throw new Error('Failed to generate schedule');
    }
  }
  
  async getScheduleResult(): Promise<ScheduleResult | null> {
    try {
      const stored = localStorage.getItem('phoenix-schedule-result');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error retrieving schedule:', error);
      return null;
    }
  }
  
  async clearSchedule(): Promise<void> {
    localStorage.removeItem('phoenix-schedule-result');
  }
  
  async validateSchedule(schedule: ScheduledClass[]): Promise<{
    isValid: boolean;
    conflicts: Conflict[];
    warnings: string[];
  }> {
    const conflicts = this.engine.detectConflicts(schedule);
    const warnings: string[] = [];
    
    // Check for potential issues
    const facultyWorkload = new Map<string, number>();
    const roomUsage = new Map<string, number>();
    
    schedule.forEach(cls => {
      // Track faculty workload
      const currentWorkload = facultyWorkload.get(cls.facultyId) || 0;
      facultyWorkload.set(cls.facultyId, currentWorkload + 1);
      
      // Track room usage
      const currentUsage = roomUsage.get(cls.roomId) || 0;
      roomUsage.set(cls.roomId, currentUsage + 1);
    });
    
    // Generate warnings
    facultyWorkload.forEach((workload, facultyId) => {
      if (workload > 4) {
        warnings.push(`Faculty ${facultyId} has high workload: ${workload} classes`);
      }
    });
    
    roomUsage.forEach((usage, roomId) => {
      if (usage > 5) {
        warnings.push(`Room ${roomId} is heavily utilized: ${usage} classes`);
      }
    });
    
    return {
      isValid: conflicts.filter(c => c.severity === 'critical').length === 0,
      conflicts,
      warnings
    };
  }
  
  async optimizeSchedule(
    courses: Course[],
    faculty: Faculty[],
    rooms: Room[],
    currentSchedule: ScheduledClass[]
  ): Promise<ScheduleResult> {
    try {
      // Remove conflicts from current schedule
      const conflicts = this.engine.detectConflicts(currentSchedule);
      const conflictClassIds = new Set(
        conflicts
          .filter(c => c.severity === 'critical')
          .flatMap(c => c.affectedClasses)
      );
      
      const cleanSchedule = currentSchedule.filter(cls => !conflictClassIds.has(cls.id));
      
      // Generate new schedule for remaining courses
      const remainingCourses = courses.filter(course => 
        !cleanSchedule.some(cls => cls.courseId === course.id)
      );
      
      const newResult = this.engine.generateSchedule(remainingCourses, faculty, rooms);
      
      // Combine clean schedule with new schedule
      const optimizedResult: ScheduleResult = {
        scheduledClasses: [...cleanSchedule, ...newResult.scheduledClasses],
        conflicts: newResult.conflicts,
        utilization: newResult.utilization,
        score: newResult.score
      };
      
      // Store optimized result
      localStorage.setItem('phoenix-schedule-result', JSON.stringify(optimizedResult));
      
      return optimizedResult;
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      throw new Error('Failed to optimize schedule');
    }
  }
  
  async exportSchedule(format: 'json' | 'csv' | 'pdf' = 'json'): Promise<string> {
    const result = await this.getScheduleResult();
    if (!result) {
      throw new Error('No schedule to export');
    }
    
    switch (format) {
      case 'json':
        return JSON.stringify(result, null, 2);
      
      case 'csv':
        return this.exportToCSV(result.scheduledClasses);
      
      case 'pdf':
        // In a real implementation, this would generate a PDF
        throw new Error('PDF export not implemented yet');
      
      default:
        throw new Error('Unsupported export format');
    }
  }
  
  private exportToCSV(classes: ScheduledClass[]): string {
    const headers = [
      'Class ID',
      'Course ID',
      'Professor ID',
      'Lecturer ID',
      'Room ID',
      'Day',
      'Period',
      'Start Time',
      'End Time',
      'Student Count',
      'Status'
    ];
    
    const rows = classes.map(cls => [
      cls.id,
      cls.courseId,
      cls.professorId,
      cls.lecturerId,
      cls.roomId,
      cls.timeSlot.day,
      cls.period.toString(),
      cls.timeSlot.startTime,
      cls.timeSlot.endTime,
      cls.studentCount.toString(),
      cls.status
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    return csvContent;
  }

  async exportUniversityTimetable(format: 'json' | 'csv' = 'json'): Promise<string> {
    const result = await this.getScheduleResult();
    if (!result) {
      throw new Error('No schedule to export');
    }
    
    if (format === 'json') {
      // Convert to the specific university timetable format
      const timetable = result.scheduledClasses.map(cls => {
        // Get course, professor, lecturer, and room details
        const course = this.getCourseById(cls.courseId);
        const professor = this.getFacultyById(cls.professorId);
        const lecturer = this.getFacultyById(cls.lecturerId);
        const room = this.getRoomById(cls.roomId);
        
        return {
          day: cls.timeSlot.day,
          period: cls.period,
          startTime: cls.timeSlot.startTime,
          endTime: cls.timeSlot.endTime,
          className: course?.name || 'Unknown Course',
          professor: professor?.name || 'Unknown Professor',
          lecturer: lecturer?.name || 'Unknown Lecturer',
          studentCount: cls.studentCount,
          room: room?.number || 'Unknown Room'
        };
      });
      
      return JSON.stringify(timetable, null, 2);
    }
    
    return this.exportToCSV(result.scheduledClasses);
  }

  private getCourseById(courseId: string): any {
    // This would need to be implemented with access to course data
    return null;
  }

  private getFacultyById(facultyId: string): any {
    // This would need to be implemented with access to faculty data
    return null;
  }

  private getRoomById(roomId: string): any {
    // This would need to be implemented with access to room data
    return null;
  }
  
  async getScheduleStatistics(): Promise<{
    totalClasses: number;
    totalConflicts: number;
    criticalConflicts: number;
    roomUtilization: number;
    facultyUtilization: number;
    timeSlotUtilization: number;
    scheduleScore: number;
  }> {
    const result = await this.getScheduleResult();
    if (!result) {
      return {
        totalClasses: 0,
        totalConflicts: 0,
        criticalConflicts: 0,
        roomUtilization: 0,
        facultyUtilization: 0,
        timeSlotUtilization: 0,
        scheduleScore: 0
      };
    }
    
    return {
      totalClasses: result.scheduledClasses.length,
      totalConflicts: result.conflicts.length,
      criticalConflicts: result.conflicts.filter(c => c.severity === 'critical').length,
      roomUtilization: result.utilization.roomUtilization,
      facultyUtilization: result.utilization.facultyUtilization,
      timeSlotUtilization: result.utilization.timeSlotUtilization,
      scheduleScore: result.score
    };
  }
}

// Singleton instance
export const schedulerService = new SchedulerService();
