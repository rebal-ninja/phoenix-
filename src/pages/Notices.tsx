import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Megaphone, Plus, Pin, Calendar, Eye, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

interface Notice {
  id: string;
  title: string;
  description: string;
  department: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  isPinned: boolean;
  datePosted: string;
  expiryDate: string;
  postedBy: string;
  views: number;
  isActive: boolean;
}

const departments = ["All Departments", "Computer Science", "Electronics", "Mechanical", "Civil", "Administration"];
const categories = ["Exam", "Class Schedule", "Event", "Holiday", "Administrative", "Academic", "General"];

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [newNotice, setNewNotice] = useState({
    title: "",
    description: "",
    department: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    isPinned: false,
    expiryDate: "",
    postedBy: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem("noticeBoard");
    if (stored) {
      const loadedNotices = JSON.parse(stored);
      // Filter out expired notices
      const activeNotices = loadedNotices.map((notice: Notice) => ({
        ...notice,
        isActive: new Date(notice.expiryDate) > new Date()
      }));
      setNotices(activeNotices);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("noticeBoard", JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    let filtered = notices.filter(notice => notice.isActive);
    
    if (filterDepartment !== "all") {
      filtered = filtered.filter(notice => 
        notice.department === filterDepartment || notice.department === "All Departments"
      );
    }
    
    if (filterCategory !== "all") {
      filtered = filtered.filter(notice => notice.category === filterCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(notice => 
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort by pinned first, then by date
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.priority !== b.priority) {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
    });
    
    setFilteredNotices(filtered);
  }, [notices, filterDepartment, filterCategory, searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newNotice.title || !newNotice.description || !newNotice.department || 
        !newNotice.category || !newNotice.expiryDate || !newNotice.postedBy) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const notice: Notice = {
      id: editingNotice ? editingNotice.id : Date.now().toString(),
      ...newNotice,
      datePosted: editingNotice ? editingNotice.datePosted : new Date().toISOString().split('T')[0],
      views: editingNotice ? editingNotice.views : 0,
      isActive: new Date(newNotice.expiryDate) > new Date()
    };

    if (editingNotice) {
      setNotices(prev => prev.map(n => n.id === editingNotice.id ? notice : n));
      toast({
        title: "Notice Updated",
        description: "Notice has been updated successfully"
      });
    } else {
      setNotices(prev => [...prev, notice]);
      toast({
        title: "Notice Posted",
        description: "Notice has been posted successfully"
      });
    }

    setNewNotice({
      title: "",
      description: "",
      department: "",
      category: "",
      priority: "medium",
      isPinned: false,
      expiryDate: "",
      postedBy: ""
    });
    setEditingNotice(null);
    setShowDialog(false);
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setNewNotice({
      title: notice.title,
      description: notice.description,
      department: notice.department,
      category: notice.category,
      priority: notice.priority,
      isPinned: notice.isPinned,
      expiryDate: notice.expiryDate,
      postedBy: notice.postedBy
    });
    setShowDialog(true);
  };

  const handleDelete = (noticeId: string) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      setNotices(prev => prev.filter(notice => notice.id !== noticeId));
      toast({
        title: "Notice Deleted",
        description: "Notice has been deleted successfully"
      });
    }
  };

  const handleView = (noticeId: string) => {
    setNotices(prev => prev.map(notice => 
      notice.id === noticeId 
        ? { ...notice, views: notice.views + 1 }
        : notice
    ));
  };

  const togglePin = (noticeId: string) => {
    setNotices(prev => prev.map(notice => 
      notice.id === noticeId 
        ? { ...notice, isPinned: !notice.isPinned }
        : notice
    ));
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

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "urgent": return "destructive";
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
            <h1 className="text-4xl font-bold text-foreground">Notice Board</h1>
            <p className="text-muted-foreground mt-2">Campus announcements and updates</p>
          </div>
          
          <Dialog open={showDialog} onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) {
              setEditingNotice(null);
              setNewNotice({
                title: "",
                description: "",
                department: "",
                category: "",
                priority: "medium",
                isPinned: false,
                expiryDate: "",
                postedBy: ""
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Post Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingNotice ? "Edit Notice" : "Post New Notice"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Notice Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter notice title"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice(prev => ({...prev, title: e.target.value}))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter notice description..."
                    value={newNotice.description}
                    onChange={(e) => setNewNotice(prev => ({...prev, description: e.target.value}))}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={newNotice.department} onValueChange={(value) => setNewNotice(prev => ({...prev, department: value}))}>
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
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newNotice.category} onValueChange={(value) => setNewNotice(prev => ({...prev, category: value}))}>
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
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newNotice.priority} onValueChange={(value: any) => setNewNotice(prev => ({...prev, priority: value}))}>
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
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={newNotice.expiryDate}
                      onChange={(e) => setNewNotice(prev => ({...prev, expiryDate: e.target.value}))}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="postedBy">Posted By</Label>
                  <Input
                    id="postedBy"
                    placeholder="Your name"
                    value={newNotice.postedBy}
                    onChange={(e) => setNewNotice(prev => ({...prev, postedBy: e.target.value}))}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPinned"
                    checked={newNotice.isPinned}
                    onCheckedChange={(checked) => setNewNotice(prev => ({...prev, isPinned: checked}))}
                  />
                  <Label htmlFor="isPinned">Pin this notice</Label>
                </div>
                
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    {editingNotice ? "Update Notice" : "Post Notice"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              Search & Filter Notices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Input
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-64"
              />
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
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice, index) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`hover:shadow-lg transition-shadow ${notice.isPinned ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      {notice.isPinned && <Pin className="w-4 h-4 text-primary" />}
                      <span className="text-base">{notice.title}</span>
                    </CardTitle>
                    <div className="flex gap-1">
                      <Badge variant={getPriorityBadgeVariant(notice.priority)}>
                        {notice.priority}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <Badge variant="outline">{notice.category}</Badge>
                      <Badge variant="secondary">{notice.department}</Badge>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">{notice.description}</p>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><strong>Posted:</strong> {format(new Date(notice.datePosted), 'MMM dd, yyyy')}</p>
                      <p><strong>Expires:</strong> {format(new Date(notice.expiryDate), 'MMM dd, yyyy')}</p>
                      <p><strong>Posted by:</strong> {notice.postedBy}</p>
                      <div className="flex items-center gap-2">
                        <Eye className="w-3 h-3" />
                        <span>{notice.views} views</span>
                        {getDaysUntilExpiry(notice.expiryDate) <= 3 && (
                          <Badge variant="destructive" className="text-xs">Expiring Soon</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleView(notice.id)}
                        className="flex-1"
                      >
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => togglePin(notice.id)}
                      >
                        <Pin className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(notice)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(notice.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredNotices.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Megaphone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notices found</h3>
              <p className="text-muted-foreground mb-4">No notices match your current filters</p>
              <Button onClick={() => setShowDialog(true)}>Post a Notice</Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}