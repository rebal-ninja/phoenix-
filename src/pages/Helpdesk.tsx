import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Headphones, Phone, Mail, User, Plus, Ticket, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Contact {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  office: string;
  availability: string;
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: "IT" | "facilities" | "academics" | "general";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  submittedBy: string;
  submittedDate: string;
  assignedTo?: string;
  resolvedDate?: string;
  resolution?: string;
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    role: "Principal",
    department: "Administration",
    email: "principal@university.edu",
    phone: "+1 (555) 123-4567",
    office: "Admin Block - Room 101",
    availability: "Mon-Fri: 9:00 AM - 5:00 PM"
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    role: "Dean of Engineering",
    department: "Engineering",
    email: "dean.engineering@university.edu",
    phone: "+1 (555) 123-4568",
    office: "Engineering Block - Room 201",
    availability: "Mon-Fri: 10:00 AM - 4:00 PM"
  },
  {
    id: "3",
    name: "Dr. Emily Davis",
    role: "HOD Computer Science",
    department: "Computer Science",
    email: "hod.cs@university.edu",
    phone: "+1 (555) 123-4569",
    office: "CS Block - Room 301",
    availability: "Mon-Fri: 11:00 AM - 3:00 PM"
  },
  {
    id: "4",
    name: "John Williams",
    role: "IT Administrator",
    department: "IT Services",
    email: "it.admin@university.edu",
    phone: "+1 (555) 123-4570",
    office: "IT Center - Room 101",
    availability: "Mon-Fri: 8:00 AM - 6:00 PM"
  },
  {
    id: "5",
    name: "Lisa Rodriguez",
    role: "Registrar",
    department: "Academic Records",
    email: "registrar@university.edu",
    phone: "+1 (555) 123-4571",
    office: "Admin Block - Room 205",
    availability: "Mon-Fri: 9:00 AM - 4:00 PM"
  },
  {
    id: "6",
    name: "Mark Thompson",
    role: "Facilities Manager",
    department: "Facilities",
    email: "facilities@university.edu",
    phone: "+1 (555) 123-4572",
    office: "Maintenance Block - Room 102",
    availability: "Mon-Fri: 7:00 AM - 5:00 PM"
  }
];

const ticketCategories = ["IT", "facilities", "academics", "general"];
const priorities = ["low", "medium", "high", "urgent"];

export default function Helpdesk() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    category: "general" as "IT" | "facilities" | "academics" | "general",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    submittedBy: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem("supportTickets");
    if (stored) {
      setTickets(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("supportTickets", JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    let filtered = tickets;
    
    if (filterCategory !== "all") {
      filtered = filtered.filter(ticket => ticket.category === filterCategory);
    }
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(ticket => ticket.status === filterStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTickets(filtered);
  }, [tickets, filterCategory, filterStatus, searchTerm]);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTicket.title || !newTicket.description || !newTicket.submittedBy) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const ticket: SupportTicket = {
      id: Date.now().toString(),
      ...newTicket,
      status: "open",
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setTickets(prev => [...prev, ticket]);
    setNewTicket({
      title: "",
      description: "",
      category: "general",
      priority: "medium",
      submittedBy: ""
    });
    setShowTicketDialog(false);
    
    toast({
      title: "Ticket Submitted",
      description: `Ticket #${ticket.id} has been created successfully`
    });
  };

  const updateTicketStatus = (ticketId: string, newStatus: SupportTicket["status"]) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            status: newStatus,
            resolvedDate: newStatus === "resolved" ? new Date().toISOString().split('T')[0] : undefined
          }
        : ticket
    ));
    
    toast({
      title: "Ticket Updated",
      description: `Ticket status changed to ${newStatus}`
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <Clock className="w-4 h-4 text-blue-500" />;
      case "in-progress": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "resolved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "closed": return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-orange-500";
      case "urgent": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-4xl font-bold text-foreground">Helpdesk & Directory</h1>
            <p className="text-muted-foreground mt-2">Contact administration and get support</p>
          </div>
          
          <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Raise Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Raise a Support Ticket</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitTicket} className="space-y-6">
                <div>
                  <Label htmlFor="submittedBy">Your Name</Label>
                  <Input
                    id="submittedBy"
                    placeholder="Full name"
                    value={newTicket.submittedBy}
                    onChange={(e) => setNewTicket(prev => ({...prev, submittedBy: e.target.value}))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="title">Issue Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket(prev => ({...prev, title: e.target.value}))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newTicket.category} onValueChange={(value: any) => setNewTicket(prev => ({...prev, category: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT">IT Support</SelectItem>
                        <SelectItem value="facilities">Facilities</SelectItem>
                        <SelectItem value="academics">Academics</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTicket.priority} onValueChange={(value: any) => setNewTicket(prev => ({...prev, priority: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the issue..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({...prev, description: e.target.value}))}
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">Submit Ticket</Button>
                  <Button type="button" variant="outline" onClick={() => setShowTicketDialog(false)}>Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="directory" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="directory">Directory</TabsTrigger>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="directory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Search Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search by name, role, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {contact.name}
                      </CardTitle>
                      <CardDescription>
                        <Badge variant="outline">{contact.role}</Badge>
                        <br />
                        {contact.department}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{contact.phone}</span>
                        </div>
                        <div className="text-sm">
                          <p><strong>Office:</strong> {contact.office}</p>
                          <p><strong>Hours:</strong> {contact.availability}</p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Mail className="w-4 h-4 mr-1" />
                            Email
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tickets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Filter Tickets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Input
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 min-w-64"
                  />
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {ticketCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(ticket.status)}
                          <span className="text-sm">#{ticket.id}</span>
                        </CardTitle>
                        <div className="flex gap-1">
                          <Badge variant="outline">{ticket.category}</Badge>
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`} title={ticket.priority}></div>
                        </div>
                      </div>
                      <CardDescription className="font-medium">
                        {ticket.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">{ticket.description}</p>
                        <div className="text-sm">
                          <p><strong>Submitted by:</strong> {ticket.submittedBy}</p>
                          <p><strong>Date:</strong> {ticket.submittedDate}</p>
                          <p><strong>Status:</strong> {ticket.status.replace('-', ' ')}</p>
                          {ticket.resolvedDate && (
                            <p><strong>Resolved:</strong> {ticket.resolvedDate}</p>
                          )}
                        </div>
                        
                        {ticket.status === "open" && (
                          <div className="flex gap-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateTicketStatus(ticket.id, "in-progress")}
                              className="flex-1"
                            >
                              Start Progress
                            </Button>
                          </div>
                        )}
                        
                        {ticket.status === "in-progress" && (
                          <div className="flex gap-2 pt-2">
                            <Button 
                              size="sm" 
                              onClick={() => updateTicketStatus(ticket.id, "resolved")}
                              className="flex-1"
                            >
                              Mark Resolved
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredTickets.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
                  <p className="text-muted-foreground mb-4">No tickets match your current filters</p>
                  <Button onClick={() => setShowTicketDialog(true)}>Raise a Ticket</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}