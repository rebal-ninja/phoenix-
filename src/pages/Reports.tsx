import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MapPin, Clock, Zap } from "lucide-react";

const facultyWorkloadData = [
  { name: "Dr. Smith", hours: 24, courses: 4 },
  { name: "Prof. Johnson", hours: 20, courses: 3 },
  { name: "Dr. Williams", hours: 18, courses: 3 },
  { name: "Prof. Brown", hours: 22, courses: 4 },
  { name: "Dr. Davis", hours: 16, courses: 2 },
  { name: "Prof. Miller", hours: 26, courses: 5 },
];

const roomTypeData = [
  { name: "Classrooms", value: 40, fill: "hsl(var(--primary))" },
  { name: "Computer Labs", value: 10, fill: "hsl(var(--accent))" },
  { name: "Science Labs", value: 8, fill: "hsl(var(--success))" },
  { name: "Seminar Halls", value: 5, fill: "hsl(var(--warning))" },
  { name: "Library", value: 3, fill: "hsl(var(--secondary))" },
  { name: "Club Rooms", value: 7, fill: "hsl(var(--muted))" },
];

const weeklyScheduleData = [
  { day: "Mon", sessions: 45, faculty: 32, rooms: 38 },
  { day: "Tue", sessions: 42, faculty: 29, rooms: 35 },
  { day: "Wed", sessions: 48, faculty: 35, rooms: 42 },
  { day: "Thu", sessions: 44, faculty: 31, rooms: 39 },
  { day: "Fri", sessions: 38, faculty: 28, rooms: 33 },
];

const timeSlotData = [
  { time: "8:00", usage: 15 },
  { time: "9:00", usage: 45 },
  { time: "10:00", usage: 78 },
  { time: "11:00", usage: 85 },
  { time: "12:00", usage: 32 },
  { time: "13:00", usage: 28 },
  { time: "14:00", usage: 72 },
  { time: "15:00", usage: 89 },
  { time: "16:00", usage: 65 },
  { time: "17:00", usage: 42 },
];

const roomUtilizationData = [
  { room: "A001", type: "Classroom", utilization: 95, status: "Critical" },
  { room: "L001", type: "Computer Lab", utilization: 87, status: "High" },
  { room: "S001", type: "Science Lab", utilization: 72, status: "High" },
  { room: "A002", type: "Classroom", utilization: 65, status: "Good" },
  { room: "SH1", type: "Seminar Hall", utilization: 58, status: "Good" },
  { room: "CR1", type: "Club Room", utilization: 43, status: "Normal" },
];

const systemMetrics = {
  resourceOptimization: 92,
  scheduleEfficiency: 89,
  facultyEngagement: 94,
  conflictResolution: 97,
  aiTimeSaved: 324,
  averageOptimization: 12.4
};

export default function Reports() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground">Comprehensive insights into campus scheduling and resource utilization</p>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Workload Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="campus-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Faculty Workload Distribution</span>
              </CardTitle>
              <CardDescription>Teaching hours per faculty member</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={facultyWorkloadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Room Type Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="campus-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Room Type Distribution</span>
              </CardTitle>
              <CardDescription>Campus facilities breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roomTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {roomTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Schedule Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="campus-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Weekly Schedule Distribution</span>
              </CardTitle>
              <CardDescription>Sessions, faculty, and room usage by day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyScheduleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Area type="monotone" dataKey="sessions" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="faculty" stackId="1" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="rooms" stackId="1" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Time Slot Usage Patterns */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="campus-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Time Slot Usage Patterns</span>
              </CardTitle>
              <CardDescription>Peak hours and utilization trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSlotData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="usage" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analysis Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room Utilization Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="campus-card">
            <CardHeader>
              <CardTitle>Room Utilization Analysis</CardTitle>
              <CardDescription>Individual room performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roomUtilizationData.map((room, index) => (
                  <motion.div
                    key={room.room}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium">{room.room}</h4>
                        <p className="text-sm text-muted-foreground">{room.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24">
                        <Progress value={room.utilization} className="h-2" />
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{room.utilization}%</div>
                        <Badge 
                          variant={
                            room.status === "Critical" ? "destructive" : 
                            room.status === "High" ? "default" : 
                            room.status === "Good" ? "secondary" : "outline"
                          }
                          className="text-xs"
                        >
                          {room.status}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="campus-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>System Performance Summary</span>
              </CardTitle>
              <CardDescription>AI optimization and efficiency metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Resource Optimization</span>
                    <span className="font-medium">{systemMetrics.resourceOptimization}%</span>
                  </div>
                  <Progress value={systemMetrics.resourceOptimization} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Schedule Efficiency</span>
                    <span className="font-medium">{systemMetrics.scheduleEfficiency}%</span>
                  </div>
                  <Progress value={systemMetrics.scheduleEfficiency} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Faculty Engagement</span>
                    <span className="font-medium">{systemMetrics.facultyEngagement}%</span>
                  </div>
                  <Progress value={systemMetrics.facultyEngagement} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Conflict Resolution</span>
                    <span className="font-medium">{systemMetrics.conflictResolution}%</span>
                  </div>
                  <Progress value={systemMetrics.conflictResolution} className="h-2" />
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-semibold mb-3">AI Time Saved Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Hours Saved</span>
                    <span className="font-bold text-lg text-primary">{systemMetrics.aiTimeSaved}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Optimization per Session</span>
                    <span className="font-medium">{systemMetrics.averageOptimization} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Efficiency Improvement</span>
                    <span className="font-medium text-success">+18%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}