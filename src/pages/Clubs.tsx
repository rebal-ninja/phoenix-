import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users2, Plus, Calendar, MapPin, Trophy, Book, Music, Palette, Code } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface Club {
  id: string;
  name: string;
  category: string;
  description: string;
  members: number;
  maxMembers: number;
  advisor: string;
  room: string;
  meetingDay: string;
  meetingTime: string;
  status: "active" | "recruiting" | "full";
  activities: string[];
}

interface ClubRequest {
  id: string;
  studentName: string;
  proposedName: string;
  category: string;
  description: string;
  justification: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
}

const clubCategories = [
  "Academic", "Cultural", "Technical", "Sports", "Arts", "Music", "Drama", "Literature", "Science"
];

const clubIcons = {
  "Academic": Book,
  "Cultural": Users2,
  "Technical": Code,
  "Sports": Trophy,
  "Arts": Palette,
  "Music": Music,
  "Drama": Users2,
  "Literature": Book,
  "Science": Book
};

const existingClubs: Club[] = [
  {
    id: "club1",
    name: "Computer Science Society",
    category: "Technical",
    description: "Promoting coding, hackathons, and tech innovation among students",
    members: 45,
    maxMembers: 50,
    advisor: "Dr. Smith",
    room: "CR1",
    meetingDay: "Wednesday", 
    meetingTime: "16:00 - 17:00",
    status: "recruiting",
    activities: ["Hackathons", "Coding Workshops", "Tech Talks"]
  },
  {
    id: "club2",
    name: "Mathematics Club",
    category: "Academic",
    description: "Exploring advanced mathematics concepts and problem-solving",
    members: 32,
    maxMembers: 40,
    advisor: "Prof. Johnson",
    room: "CR2", 
    meetingDay: "Friday",
    meetingTime: "15:00 - 16:00",
    status: "active",
    activities: ["Math Olympiad", "Research Projects", "Peer Tutoring"]
  },
  {
    id: "club3",
    name: "Cultural Society",
    category: "Cultural",
    description: "Celebrating diverse cultures and organizing cultural events",
    members: 50,
    maxMembers: 50,
    advisor: "Dr. Williams",
    room: "CR3",
    meetingDay: "Thursday",
    meetingTime: "17:00 - 18:00", 
    status: "full",
    activities: ["Cultural Festivals", "Dance Performances", "Food Events"]
  },
  {
    id: "club4",
    name: "Robotics Club",
    category: "Technical",
    description: "Building and programming robots for competitions",
    members: 28,
    maxMembers: 35,
    advisor: "Prof. Brown",
    room: "CR4",
    meetingDay: "Saturday",
    meetingTime: "10:00 - 12:00",
    status: "recruiting",
    activities: ["Robot Building", "Competitions", "Arduino Projects"]
  },
  {
    id: "club5",
    name: "Music Club",
    category: "Music",
    description: "Learning instruments and organizing musical performances",
    members: 38,
    maxMembers: 45,
    advisor: "Ms. Davis",
    room: "CR5",
    meetingDay: "Monday",
    meetingTime: "16:00 - 18:00",
    status: "active",
    activities: ["Band Practice", "Concerts", "Music Theory"]
  }
];

export default function Clubs() {
  const [clubs, setClubs] = useState<Club[]>(existingClubs);
  const [requests, setRequests] = useState<ClubRequest[]>([]);
  const [newRequest, setNewRequest] = useState({
    studentName: "",
    proposedName: "",
    category: "",
    description: "",
    justification: ""
  });
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  useEffect(() => {
    const savedClubs = localStorage.getItem("phoenix-clubs");
    const savedRequests = localStorage.getItem("phoenix-club-requests");
    
    if (savedClubs) setClubs(JSON.parse(savedClubs));
    if (savedRequests) setRequests(JSON.parse(savedRequests));
  }, []);

  useEffect(() => {
    localStorage.setItem("phoenix-clubs", JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem("phoenix-club-requests", JSON.stringify(requests));
  }, [requests]);

  const submitRequest = () => {
    if (newRequest.studentName && newRequest.proposedName && newRequest.category && newRequest.description) {
      const request: ClubRequest = {
        id: `request-${Date.now()}`,
        ...newRequest,
        status: "pending",
        submittedDate: new Date().toISOString().split('T')[0]
      };
      setRequests([...requests, request]);
      setNewRequest({
        studentName: "",
        proposedName: "",
        category: "",
        description: "",
        justification: ""
      });
      setIsRequestDialogOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "recruiting": return "secondary";
      case "full": return "destructive";
      default: return "outline";
    }
  };

  const totalMembers = clubs.reduce((sum, club) => sum + club.members, 0);
  const averageMembers = Math.round(totalMembers / clubs.length);

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Student Clubs</h1>
        <p className="text-muted-foreground">Discover clubs and request new subject-related organizations</p>
      </motion.div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Clubs</CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clubs.length}</div>
              <p className="text-xs text-muted-foreground">Registered organizations</p>
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
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
              <p className="text-xs text-muted-foreground">Across all clubs</p>
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
              <CardTitle className="text-sm font-medium">Avg. Members</CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageMembers}</div>
              <p className="text-xs text-muted-foreground">Per club</p>
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
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.filter(r => r.status === "pending").length}</div>
              <p className="text-xs text-muted-foreground">New club requests</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Club Request Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex justify-end"
      >
        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button className="phoenix-button-primary">
              <Plus className="h-4 w-4 mr-2" />
              Request New Club
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Request New Club</DialogTitle>
              <DialogDescription>
                Submit a request to create a new subject-related club. All clubs must serve academic purposes.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="studentName">Your Name</Label>
                <Input
                  id="studentName"
                  value={newRequest.studentName}
                  onChange={(e) => setNewRequest({...newRequest, studentName: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="proposedName">Proposed Club Name</Label>
                <Input
                  id="proposedName"
                  value={newRequest.proposedName}
                  onChange={(e) => setNewRequest({...newRequest, proposedName: e.target.value})}
                  placeholder="e.g., Data Science Club"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newRequest.category}
                  onValueChange={(value) => setNewRequest({...newRequest, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {clubCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                  placeholder="Describe the club's purpose and activities"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="justification">Academic Justification</Label>
                <Textarea
                  id="justification"
                  value={newRequest.justification}
                  onChange={(e) => setNewRequest({...newRequest, justification: e.target.value})}
                  placeholder="Explain how this club serves academic/subject-related needs"
                  rows={3}
                />
              </div>
              <Button onClick={submitRequest} className="w-full phoenix-button-primary">
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Existing Clubs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="phoenix-card">
          <CardHeader>
            <CardTitle>Active Clubs</CardTitle>
            <CardDescription>Browse and join existing student organizations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club, index) => {
                const Icon = clubIcons[club.category] || Users2;
                const membershipPercentage = Math.round((club.members / club.maxMembers) * 100);

                return (
                  <motion.div
                    key={club.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="phoenix-card h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{club.name}</CardTitle>
                              <CardDescription>{club.category}</CardDescription>
                            </div>
                          </div>
                          <Badge variant={getStatusColor(club.status)}>
                            {club.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{club.description}</p>
                        
                        {/* Membership */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Members</span>
                            <span className="font-medium">{club.members}/{club.maxMembers}</span>
                          </div>
                          <Progress value={membershipPercentage} className="h-2" />
                        </div>

                        {/* Details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Users2 className="h-4 w-4 text-muted-foreground" />
                            <span>Advisor: {club.advisor}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>Room: {club.room}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{club.meetingDay}, {club.meetingTime}</span>
                          </div>
                        </div>

                        {/* Activities */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Activities</h4>
                          <div className="flex flex-wrap gap-1">
                            {club.activities.map((activity) => (
                              <Badge key={activity} variant="outline" className="text-xs">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Join Button */}
                        <Button 
                          className="w-full phoenix-button-secondary" 
                          disabled={club.status === "full"}
                        >
                          {club.status === "full" ? "Club Full" : "Join Club"}
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

      {/* Pending Requests */}
      {requests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="phoenix-card">
            <CardHeader>
              <CardTitle>Club Requests</CardTitle>
              <CardDescription>Pending and processed club creation requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {requests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="space-y-1">
                      <h4 className="font-semibold">{request.proposedName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Requested by {request.studentName} • {request.category}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Submitted: {request.submittedDate}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        request.status === "pending" ? "secondary" :
                        request.status === "approved" ? "default" : "destructive"
                      }
                    >
                      {request.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
