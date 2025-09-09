import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Mail, BookOpen, Users, Plus, Edit2, Trash2, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Faculty {
  id: string;
  name: string;
  email: string;
  subject: string;
  department: string;
  courses: string[];
  workload: number; // hours per week
  experience: number; // years
  qualifications: string[];
  status: "active" | "on-leave" | "retired";
}

const sampleFaculty: Faculty[] = [
  {
    id: "faculty1",
    name: "Dr. John Smith",
    email: "john.smith@university.edu",
    subject: "Computer Science",
    department: "Computer Science & Engineering",
    courses: ["Data Structures", "Algorithms", "Database Management"],
    workload: 24,
    experience: 12,
    qualifications: ["Ph.D. Computer Science", "M.S. Software Engineering"],
    status: "active"
  },
  {
    id: "faculty2",
    name: "Prof. Sarah Johnson",
    email: "sarah.johnson@university.edu", 
    subject: "Mathematics",
    department: "Mathematics",
    courses: ["Calculus I", "Linear Algebra", "Statistics"],
    workload: 20,
    experience: 8,
    qualifications: ["Ph.D. Mathematics", "M.S. Applied Mathematics"],
    status: "active"
  },
  {
    id: "faculty3",
    name: "Dr. Michael Williams",
    email: "michael.williams@university.edu",
    subject: "Physics", 
    department: "Physics",
    courses: ["Quantum Physics", "Thermodynamics", "Electronics"],
    workload: 22,
    experience: 15,
    qualifications: ["Ph.D. Physics", "M.S. Theoretical Physics"],
    status: "active"
  },
  {
    id: "faculty4",
    name: "Prof. Emily Brown",
    email: "emily.brown@university.edu",
    subject: "Chemistry",
    department: "Chemistry",
    courses: ["Organic Chemistry", "Analytical Chemistry", "Biochemistry"],
    workload: 18,
    experience: 6,
    qualifications: ["Ph.D. Chemistry", "M.S. Organic Chemistry"],
    status: "active"
  },
  {
    id: "faculty5",
    name: "Dr. Robert Davis",
    email: "robert.davis@university.edu",
    subject: "Electrical Engineering",
    department: "Electrical & Electronics Engineering",
    courses: ["Digital Circuits", "Microprocessors", "Signal Processing"],
    workload: 26,
    experience: 10,
    qualifications: ["Ph.D. Electrical Engineering", "M.S. Electronics"],
    status: "active"
  }
];

export default function Faculty() {
  const [faculty, setFaculty] = useState<Faculty[]>(sampleFaculty);
  const [searchTerm, setSearchTerm] = useState("");
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    subject: "",
    department: "",
    experience: 0,
    qualifications: ""
  });
  const [isAddingFaculty, setIsAddingFaculty] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  useEffect(() => {
    const savedFaculty = localStorage.getItem("phoenix-faculty-detailed");
    if (savedFaculty) {
      setFaculty(JSON.parse(savedFaculty));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("phoenix-faculty-detailed", JSON.stringify(faculty));
  }, [faculty]);

  const addFaculty = () => {
    if (newFaculty.name && newFaculty.email && newFaculty.subject) {
      const facultyMember: Faculty = {
        id: `faculty-${Date.now()}`,
        ...newFaculty,
        courses: [],
        workload: 0,
        qualifications: newFaculty.qualifications.split(',').map(q => q.trim()).filter(q => q),
        status: "active"
      };
      setFaculty([...faculty, facultyMember]);
      setNewFaculty({
        name: "",
        email: "",
        subject: "",
        department: "",
        experience: 0,
        qualifications: ""
      });
      setIsAddingFaculty(false);
    }
  };

  const deleteFaculty = (id: string) => {
    setFaculty(faculty.filter(f => f.id !== id));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const departments = [...new Set(faculty.map(f => f.department))];
  
  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || f.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const totalFaculty = faculty.length;
  const activeFaculty = faculty.filter(f => f.status === "active").length;
  const averageExperience = Math.round(faculty.reduce((sum, f) => sum + f.experience, 0) / faculty.length);
  const totalWorkload = faculty.reduce((sum, f) => sum + f.workload, 0);

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Faculty Management</h1>
        <p className="text-muted-foreground">Manage faculty members, their subjects, and workload distribution</p>
      </motion.div>

      {/* Faculty Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="metric-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFaculty}</div>
              <p className="text-xs text-muted-foreground">{activeFaculty} active</p>
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
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
              <p className="text-xs text-muted-foreground">Academic departments</p>
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
              <CardTitle className="text-sm font-medium">Avg. Experience</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageExperience}</div>
              <p className="text-xs text-muted-foreground">Years</p>
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
              <CardTitle className="text-sm font-medium">Total Workload</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWorkload}h</div>
              <p className="text-xs text-muted-foreground">Per week</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search faculty by name, subject, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background"
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <Dialog open={isAddingFaculty} onOpenChange={setIsAddingFaculty}>
          <DialogTrigger asChild>
            <Button className="phoenix-button-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Faculty Member</DialogTitle>
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
                <Label htmlFor="subject">Primary Subject</Label>
                <Input
                  id="subject"
                  value={newFaculty.subject}
                  onChange={(e) => setNewFaculty({...newFaculty, subject: e.target.value})}
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newFaculty.department}
                  onChange={(e) => setNewFaculty({...newFaculty, department: e.target.value})}
                  placeholder="Computer Science & Engineering"
                />
              </div>
              <div>
                <Label htmlFor="experience">Experience (Years)</Label>
                <Input
                  id="experience"
                  type="number"
                  value={newFaculty.experience}
                  onChange={(e) => setNewFaculty({...newFaculty, experience: parseInt(e.target.value) || 0})}
                  placeholder="5"
                />
              </div>
              <div>
                <Label htmlFor="qualifications">Qualifications (comma-separated)</Label>
                <Input
                  id="qualifications"
                  value={newFaculty.qualifications}
                  onChange={(e) => setNewFaculty({...newFaculty, qualifications: e.target.value})}
                  placeholder="Ph.D. Computer Science, M.S. Software Engineering"
                />
              </div>
              <Button onClick={addFaculty} className="w-full phoenix-button-primary">
                Add Faculty Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Faculty Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="phoenix-card">
          <CardHeader>
            <CardTitle>Faculty Directory ({filteredFaculty.length})</CardTitle>
            <CardDescription>Complete list of faculty members with their details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFaculty.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="phoenix-card h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{member.name}</CardTitle>
                            <CardDescription>{member.subject}</CardDescription>
                          </div>
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
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Contact */}
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{member.email}</span>
                      </div>

                      {/* Department */}
                      <div>
                        <Badge variant="outline">{member.department}</Badge>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Experience</span>
                          <div className="font-semibold">{member.experience} years</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Workload</span>
                          <div className="font-semibold">{member.workload}h/week</div>
                        </div>
                      </div>

                      {/* Courses */}
                      {member.courses.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Current Courses</h4>
                          <div className="flex flex-wrap gap-1">
                            {member.courses.slice(0, 2).map((course) => (
                              <Badge key={course} variant="secondary" className="text-xs">
                                {course}
                              </Badge>
                            ))}
                            {member.courses.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{member.courses.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Qualifications */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Qualifications</h4>
                        <div className="space-y-1">
                          {member.qualifications.slice(0, 2).map((qual, i) => (
                            <div key={i} className="text-xs text-muted-foreground">
                              • {qual}
                            </div>
                          ))}
                          {member.qualifications.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              • +{member.qualifications.length - 2} more...
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="pt-2 border-t border-border">
                        <Badge 
                          variant={member.status === "active" ? "default" : "secondary"}
                        >
                          {member.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            {filteredFaculty.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No faculty members found matching your search criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}