import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  MapPin, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Zap,
  Plus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const performanceMetrics = [
  {
    title: "Total Sessions",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Calendar,
    description: "This semester"
  },
  {
    title: "Room Utilization",
    value: "84%",
    change: "+5%",
    trend: "up",
    icon: MapPin,
    description: "Average occupancy"
  },
  {
    title: "Active Faculty",
    value: "156",
    change: "+3%",
    trend: "up",
    icon: Users,
    description: "Currently teaching"
  },
  {
    title: "Unassigned Courses",
    value: "12",
    change: "-8%",
    trend: "down",
    icon: BookOpen,
    description: "Pending assignment"
  }
];

const weeklySchedule = [
  { day: "Monday", sessions: 45, utilization: 89 },
  { day: "Tuesday", sessions: 42, utilization: 83 },
  { day: "Wednesday", sessions: 48, utilization: 95 },
  { day: "Thursday", sessions: 44, utilization: 87 },
  { day: "Friday", sessions: 38, utilization: 75 },
];

const aiInsights = {
  timeSaved: "324",
  efficiency: "92%",
  sessionsOptimized: 156,
  averageMinutesSaved: 12.4
};

export default function Dashboard() {
  const navigate = useNavigate();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-course':
        navigate('/schedule');
        break;
      case 'generate-schedule':
        navigate('/schedule');
        break;
      case 'view-reports':
        navigate('/reports');
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to Phoenix Scheduler - Your university management hub</p>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="metric-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className={`font-medium ${
                    metric.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`}>
                    {metric.change}
                  </span>
                  <span className="text-muted-foreground">{metric.description}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Optimization Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="phoenix-card bg-gradient-primary text-white">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <CardTitle>AI Optimization</CardTitle>
              </div>
              <CardDescription className="text-white/80">
                Intelligent scheduling insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">{aiInsights.timeSaved}</div>
                  <div className="text-sm opacity-80">Hours Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{aiInsights.efficiency}</div>
                  <div className="text-sm opacity-80">Efficiency</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sessions Optimized</span>
                  <span>{aiInsights.sessionsOptimized}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg. Time Saved per Session</span>
                  <span>{aiInsights.averageMinutesSaved} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Schedule Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="phoenix-card">
            <CardHeader>
              <CardTitle>Weekly Schedule Overview</CardTitle>
              <CardDescription>Room utilization and session distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklySchedule.map((day, index) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-4"
                  >
                    <div className="w-20 text-sm font-medium">{day.day}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{day.sessions} sessions</span>
                        <span>{day.utilization}% utilized</span>
                      </div>
                      <Progress value={day.utilization} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="phoenix-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features for efficient management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => handleQuickAction('add-course')}
                className="phoenix-button-primary h-auto py-4 flex-col space-y-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add New Course</span>
              </Button>
              <Button 
                onClick={() => handleQuickAction('generate-schedule')}
                variant="outline" 
                className="h-auto py-4 flex-col space-y-2"
              >
                <Calendar className="h-5 w-5" />
                <span>Generate Schedule</span>
              </Button>
              <Button 
                onClick={() => handleQuickAction('view-reports')}
                variant="outline" 
                className="h-auto py-4 flex-col space-y-2"
              >
                <TrendingUp className="h-5 w-5" />
                <span>View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}