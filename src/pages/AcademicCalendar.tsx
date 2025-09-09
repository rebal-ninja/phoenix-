import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, Edit, Trash2, BookOpen, Sun, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";

interface AcademicEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: "exam" | "holiday" | "regular" | "assignment" | "meeting";
  category: string;
  department: string;
  isRecurring: boolean;
  color: string;
  priority: "low" | "medium" | "high";
}

const eventTypes = [
  { value: "exam", label: "Exam", color: "#ef4444" },
  { value: "holiday", label: "Holiday", color: "#f59e0b" },
  { value: "regular", label: "Regular Class", color: "#10b981" },
  { value: "assignment", label: "Assignment", color: "#8b5cf6" },
  { value: "meeting", label: "Meeting", color: "#3b82f6" }
];

const categories = ["Academic", "Administrative", "Cultural", "Sports", "Technical", "General"];
const departments = ["All Departments", "Computer Science", "Electronics", "Mechanical", "Civil"];

export default function AcademicCalendar() {
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AcademicEvent | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    type: "regular" as "exam" | "holiday" | "regular" | "assignment" | "meeting",
    category: "",
    department: "",
    isRecurring: false,
    priority: "medium" as "low" | "medium" | "high"
  });

  useEffect(() => {
    const stored = localStorage.getItem("academicEvents");
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      // Sample data
      const sampleEvents: AcademicEvent[] = [
        {
          id: "1",
          title: "Mid-term Exams",
          description: "Mid-semester examinations for all departments",
          startDate: "2024-03-15",
          endDate: "2024-03-25",
          type: "exam",
          category: "Academic",
          department: "All Departments",
          isRecurring: false,
          color: "#ef4444",
          priority: "high"
        },
        {
          id: "2",
          title: "Spring Break",
          description: "Spring holiday break",
          startDate: "2024-04-01",
          endDate: "2024-04-07",
          type: "holiday",
          category: "Academic",
          department: "All Departments",
          isRecurring: false,
          color: "#f59e0b",
          priority: "medium"
        }
      ];
      setEvents(sampleEvents);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("academicEvents", JSON.stringify(events));
  }, [events]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.startDate || !newEvent.endDate || !newEvent.category || !newEvent.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const eventType = eventTypes.find(t => t.value === newEvent.type);
    const event: AcademicEvent = {
      id: editingEvent ? editingEvent.id : Date.now().toString(),
      ...newEvent,
      color: eventType?.color || "#10b981"
    };

    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? event : e));
      toast({
        title: "Event Updated",
        description: "Academic event has been updated successfully"
      });
    } else {
      setEvents(prev => [...prev, event]);
      toast({
        title: "Event Added",
        description: "Academic event has been added successfully"
      });
    }

    setNewEvent({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      type: "regular",
      category: "",
      department: "",
      isRecurring: false,
      priority: "medium"
    });
    setEditingEvent(null);
    setShowDialog(false);
  };

  const handleEdit = (event: AcademicEvent) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      type: event.type,
      category: event.category,
      department: event.department,
      isRecurring: event.isRecurring,
      priority: event.priority
    });
    setShowDialog(true);
  };

  const handleDelete = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      toast({
        title: "Event Deleted",
        description: "Academic event has been deleted successfully"
      });
    }
  };

  const getFilteredEvents = () => {
    let filtered = events;
    
    if (filterType !== "all") {
      filtered = filtered.filter(event => event.type === filterType);
    }
    
    if (filterDepartment !== "all") {
      filtered = filtered.filter(event => 
        event.department === filterDepartment || event.department === "All Departments"
      );
    }
    
    return filtered;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return getFilteredEvents().filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const currentDate = new Date(dateStr);
      
      return currentDate >= eventStart && currentDate <= eventEnd;
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "exam": return <AlertTriangle className="w-4 h-4" />;
      case "holiday": return <Sun className="w-4 h-4" />;
      case "regular": return <BookOpen className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => {
    setCurrentDate(prev => addDays(prev, 32));
  };

  const prevMonth = () => {
    setCurrentDate(prev => addDays(prev, -32));
  };

  const upcomingEvents = getFilteredEvents()
    .filter(event => new Date(event.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Academic Calendar</h1>
            <p className="text-muted-foreground mt-2">Track academic events, exams, and holidays</p>
          </div>
          
          <Dialog open={showDialog} onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) {
              setEditingEvent(null);
              setNewEvent({
                title: "",
                description: "",
                startDate: "",
                endDate: "",
                type: "regular",
                category: "",
                department: "",
                isRecurring: false,
                priority: "medium"
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingEvent ? "Edit Event" : "Add Academic Event"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({...prev, title: e.target.value}))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter event description..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({...prev, description: e.target.value}))}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newEvent.startDate}
                      onChange={(e) => setNewEvent(prev => ({...prev, startDate: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newEvent.endDate}
                      onChange={(e) => setNewEvent(prev => ({...prev, endDate: e.target.value}))}
                      min={newEvent.startDate}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Event Type</Label>
                    <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent(prev => ({...prev, type: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newEvent.priority} onValueChange={(value: any) => setNewEvent(prev => ({...prev, priority: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newEvent.category} onValueChange={(value) => setNewEvent(prev => ({...prev, category: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={newEvent.department} onValueChange={(value) => setNewEvent(prev => ({...prev, department: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    {editingEvent ? "Update Event" : "Add Event"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {format(currentDate, 'MMMM yyyy')}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={prevMonth}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={nextMonth}>
                      Next
                    </Button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      {eventTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map(day => {
                    const dayEvents = getEventsForDate(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isSelectedDay = selectedDate && isSameDay(day, selectedDate);
                    const isTodayDate = isToday(day);
                    
                    return (
                      <div
                        key={day.toISOString()}
                        className={`p-2 min-h-24 border rounded cursor-pointer transition-colors ${
                          isCurrentMonth ? 'bg-background hover:bg-muted' : 'bg-muted/50'
                        } ${isSelectedDay ? 'ring-2 ring-primary' : ''} ${
                          isTodayDate ? 'bg-primary/10 border-primary' : ''
                        }`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                        } ${isTodayDate ? 'text-primary font-bold' : ''}`}>
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.id}
                              className="text-xs p-1 rounded truncate"
                              style={{ backgroundColor: event.color + '20', color: event.color }}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-3 h-3 rounded-full mt-1" style={{ backgroundColor: event.color }}></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{event.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(event.startDate), 'MMM dd')}
                          {event.startDate !== event.endDate && 
                            ` - ${format(new Date(event.endDate), 'MMM dd')}`
                          }
                        </div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {upcomingEvents.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No upcoming events
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Events */}
            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {format(selectedDate, 'MMMM dd, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getEventsForDate(selectedDate).map(event => (
                      <div key={event.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            {getEventIcon(event.type)}
                            <span className="font-medium text-sm">{event.title}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(event)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(event.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{event.description}</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">{event.type}</Badge>
                          <Badge variant="secondary" className="text-xs">{event.department}</Badge>
                        </div>
                      </div>
                    ))}
                    {getEventsForDate(selectedDate).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No events on this date
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}