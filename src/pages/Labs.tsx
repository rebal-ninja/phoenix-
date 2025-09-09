import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Laptop, Wifi, WifiOff, Monitor, HardDrive, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Lab {
  id: string;
  name: string;
  totalComputers: number;
  bookedComputers: number;
  internetAccess: number;
  status: "operational" | "maintenance" | "offline";
  type: "general" | "specialized";
  software: string[];
}

const labData: Lab[] = [
  {
    id: "lab1",
    name: "Computer Lab 1",
    totalComputers: 40,
    bookedComputers: 32,
    internetAccess: 40,
    status: "operational",
    type: "general",
    software: ["Windows 11", "MS Office", "Visual Studio", "Chrome"]
  },
  {
    id: "lab2", 
    name: "Computer Lab 2",
    totalComputers: 35,
    bookedComputers: 28,
    internetAccess: 35,
    status: "operational",
    type: "general",
    software: ["Windows 11", "MS Office", "AutoCAD", "MATLAB"]
  },
  {
    id: "lab3",
    name: "Programming Lab",
    totalComputers: 45,
    bookedComputers: 41,
    internetAccess: 45,
    status: "operational",
    type: "specialized",
    software: ["Linux", "Python", "Java", "Node.js", "VS Code"]
  },
  {
    id: "lab4",
    name: "Graphics Lab",
    totalComputers: 30,
    bookedComputers: 18,
    internetAccess: 30,
    status: "operational",
    type: "specialized", 
    software: ["Windows 11", "Adobe Creative Suite", "Blender", "Maya"]
  },
  {
    id: "lab5",
    name: "Data Science Lab",
    totalComputers: 25,
    bookedComputers: 20,
    internetAccess: 25,
    status: "operational",
    type: "specialized",
    software: ["Linux", "Python", "R", "Jupyter", "TensorFlow"]
  },
  {
    id: "lab6",
    name: "Network Lab",
    totalComputers: 20,
    bookedComputers: 0,
    internetAccess: 15,
    status: "maintenance",
    type: "specialized",
    software: ["Cisco Packet Tracer", "Wireshark", "Linux", "Windows Server"]
  },
  {
    id: "lab7",
    name: "Hardware Lab",
    totalComputers: 15,
    bookedComputers: 12,
    internetAccess: 15,
    status: "operational",
    type: "specialized",
    software: ["Windows 11", "Circuit Simulators", "PCB Design Tools"]
  },
  {
    id: "lab8",
    name: "Mobile Dev Lab",
    totalComputers: 35,
    bookedComputers: 26,
    internetAccess: 35,
    status: "operational",
    type: "specialized",
    software: ["Android Studio", "Xcode", "React Native", "Flutter"]
  },
  {
    id: "lab9",
    name: "AI/ML Lab",
    totalComputers: 30,
    bookedComputers: 25,
    internetAccess: 30,
    status: "operational",
    type: "specialized",
    software: ["Python", "PyTorch", "TensorFlow", "CUDA", "Jupyter"]
  },
  {
    id: "lab10",
    name: "Web Dev Lab",
    totalComputers: 40,
    bookedComputers: 33,
    internetAccess: 40,
    status: "operational",
    type: "specialized",
    software: ["VS Code", "Node.js", "React", "Docker", "Git"]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "operational": return "text-success";
    case "maintenance": return "text-warning";
    case "offline": return "text-destructive";
    default: return "text-muted-foreground";
  }
};

const getUtilizationColor = (utilization: number) => {
  if (utilization >= 90) return "text-destructive";
  if (utilization >= 70) return "text-warning";
  return "text-success";
};

export default function Labs() {
  const [labs, setLabs] = useState<Lab[]>(labData);

  const totalComputers = labs.reduce((sum, lab) => sum + lab.totalComputers, 0);
  const totalBooked = labs.reduce((sum, lab) => sum + lab.bookedComputers, 0);
  const totalInternet = labs.reduce((sum, lab) => sum + lab.internetAccess, 0);
  const operationalLabs = labs.filter(lab => lab.status === "operational").length;

  const overallUtilization = Math.round((totalBooked / totalComputers) * 100);

  const generalLabs = labs.filter(lab => lab.type === "general");
  const specializedLabs = labs.filter(lab => lab.type === "specialized");

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Computer Labs</h1>
        <p className="text-muted-foreground">Monitor and manage computer lab resources and availability</p>
      </motion.div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Computers</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalComputers}</div>
              <p className="text-xs text-muted-foreground">Across {labs.length} labs</p>
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
              <CardTitle className="text-sm font-medium">Currently Booked</CardTitle>
              <Laptop className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBooked}</div>
              <div className="space-y-1">
                <Progress value={overallUtilization} className="h-2" />
                <p className="text-xs text-muted-foreground">{overallUtilization}% utilization</p>
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
              <CardTitle className="text-sm font-medium">Internet Access</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInternet}</div>
              <p className="text-xs text-muted-foreground">Computers with internet</p>
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
              <CardTitle className="text-sm font-medium">Operational Labs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{operationalLabs}/{labs.length}</div>
              <p className="text-xs text-muted-foreground">Labs currently active</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Labs by Type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Labs</TabsTrigger>
            <TabsTrigger value="general">General Purpose</TabsTrigger>
            <TabsTrigger value="specialized">Specialized</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {labs.map((lab, index) => (
                <LabCard key={lab.id} lab={lab} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generalLabs.map((lab, index) => (
                <LabCard key={lab.id} lab={lab} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="specialized" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specializedLabs.map((lab, index) => (
                <LabCard key={lab.id} lab={lab} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

function LabCard({ lab, index }: { lab: Lab; index: number }) {
  const utilization = Math.round((lab.bookedComputers / lab.totalComputers) * 100);
  const available = lab.totalComputers - lab.bookedComputers;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="campus-card h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{lab.name}</CardTitle>
            <Badge 
              variant={lab.status === "operational" ? "default" : 
                      lab.status === "maintenance" ? "secondary" : "destructive"}
            >
              {lab.status}
            </Badge>
          </div>
          <CardDescription className="flex items-center space-x-2">
            <span className="capitalize">{lab.type}</span>
            <span>•</span>
            <span>{lab.totalComputers} computers</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Utilization */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Utilization</span>
              <span className={`font-medium ${getUtilizationColor(utilization)}`}>
                {utilization}%
              </span>
            </div>
            <Progress value={utilization} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{lab.bookedComputers} booked</span>
              <span>{available} available</span>
            </div>
          </div>

          {/* Internet Access */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wifi className="h-4 w-4 text-primary" />
              <span className="text-sm">Internet Access</span>
            </div>
            <span className="text-sm font-medium">{lab.internetAccess}/{lab.totalComputers}</span>
          </div>

          {/* Software */}
          <div>
            <h4 className="text-sm font-medium mb-2">Installed Software</h4>
            <div className="flex flex-wrap gap-1">
              {lab.software.slice(0, 3).map((software) => (
                <Badge key={software} variant="outline" className="text-xs">
                  {software}
                </Badge>
              ))}
              {lab.software.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{lab.software.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Status Indicator */}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                lab.status === "operational" ? "bg-success" :
                lab.status === "maintenance" ? "bg-warning" : "bg-destructive"
              }`} />
              <span className={`text-sm font-medium capitalize ${getStatusColor(lab.status)}`}>
                {lab.status === "operational" ? "Online" : lab.status}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}