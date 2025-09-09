import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Filter, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface FeedbackItem {
  id: string;
  department: string;
  course?: string;
  category: string;
  message: string;
  sentiment: "positive" | "neutral" | "negative";
  date: string;
  tags: string[];
  status: "pending" | "reviewed" | "addressed";
}

const departments = ["Computer Science", "Electronics", "Mechanical", "Civil", "General", "Administration"];
const categories = ["Teaching Quality", "Infrastructure", "Food Services", "Library", "Labs", "Administration", "Other"];
const courses = ["DSA", "Web Development", "Database Systems", "Machine Learning", "Networking", "Operating Systems"];

const sentimentColors = {
  positive: "#10b981",
  neutral: "#f59e0b", 
  negative: "#ef4444"
};

export default function Feedback() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackItem[]>([]);
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterSentiment, setFilterSentiment] = useState<string>("all");
  const [showDialog, setShowDialog] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    department: "",
    course: "",
    category: "",
    message: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem("feedbackItems");
    if (stored) {
      setFeedback(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("feedbackItems", JSON.stringify(feedback));
  }, [feedback]);

  useEffect(() => {
    let filtered = feedback;
    
    if (filterDepartment !== "all") {
      filtered = filtered.filter(item => item.department === filterDepartment);
    }
    
    if (filterCategory !== "all") {
      filtered = filtered.filter(item => item.category === filterCategory);
    }
    
    if (filterSentiment !== "all") {
      filtered = filtered.filter(item => item.sentiment === filterSentiment);
    }
    
    setFilteredFeedback(filtered);
  }, [feedback, filterDepartment, filterCategory, filterSentiment]);

  const analyzeSentiment = (text: string): "positive" | "neutral" | "negative" => {
    const positiveWords = ["good", "excellent", "great", "amazing", "helpful", "efficient", "improved"];
    const negativeWords = ["bad", "poor", "terrible", "awful", "slow", "broken", "issue", "problem"];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  };

  const extractTags = (text: string): string[] => {
    const tagMap: { [key: string]: string } = {
      "teacher": "teaching",
      "professor": "teaching", 
      "lecture": "teaching",
      "wifi": "infrastructure",
      "internet": "infrastructure",
      "building": "infrastructure",
      "food": "food-services",
      "canteen": "food-services",
      "library": "library",
      "book": "library",
      "lab": "labs",
      "computer": "labs"
    };
    
    const lowerText = text.toLowerCase();
    const foundTags = [];
    
    for (const [keyword, tag] of Object.entries(tagMap)) {
      if (lowerText.includes(keyword)) {
        foundTags.push(tag);
      }
    }
    
    return [...new Set(foundTags)];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newFeedback.department || !newFeedback.category || !newFeedback.message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const feedbackItem: FeedbackItem = {
      id: Date.now().toString(),
      ...newFeedback,
      sentiment: analyzeSentiment(newFeedback.message),
      date: new Date().toISOString().split('T')[0],
      tags: extractTags(newFeedback.message),
      status: "pending"
    };

    setFeedback(prev => [...prev, feedbackItem]);
    setNewFeedback({
      department: "",
      course: "",
      category: "",
      message: ""
    });
    setShowDialog(false);
    
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your anonymous feedback!"
    });
  };

  // Analytics data
  const departmentData = departments.map(dept => ({
    name: dept,
    count: feedback.filter(f => f.department === dept).length
  }));

  const sentimentData = [
    { name: "Positive", value: feedback.filter(f => f.sentiment === "positive").length, color: sentimentColors.positive },
    { name: "Neutral", value: feedback.filter(f => f.sentiment === "neutral").length, color: sentimentColors.neutral },
    { name: "Negative", value: feedback.filter(f => f.sentiment === "negative").length, color: sentimentColors.negative }
  ];

  const categoryData = categories.map(cat => ({
    name: cat,
    count: feedback.filter(f => f.category === cat).length
  }));

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "negative": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <MessageCircle className="w-4 h-4 text-yellow-500" />;
    }
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
            <h1 className="text-4xl font-bold text-foreground">Anonymous Feedback Portal</h1>
            <p className="text-muted-foreground mt-2">Share your thoughts to help improve campus services</p>
          </div>
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Send className="w-4 h-4" />
                Submit Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Submit Anonymous Feedback</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={newFeedback.department} onValueChange={(value) => setNewFeedback(prev => ({...prev, department: value}))}>
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
                    <Label htmlFor="course">Course (Optional)</Label>
                    <Select value={newFeedback.course} onValueChange={(value) => setNewFeedback(prev => ({...prev, course: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map(course => (
                          <SelectItem key={course} value={course}>{course}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newFeedback.category} onValueChange={(value) => setNewFeedback(prev => ({...prev, category: value}))}>
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
                  <Label htmlFor="message">Feedback Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Share your constructive feedback..."
                    value={newFeedback.message}
                    onChange={(e) => setNewFeedback(prev => ({...prev, message: e.target.value}))}
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">Submit Anonymously</Button>
                  <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Feedback by Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {sentimentData.map(item => (
                  <div key={item.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryData.filter(cat => cat.count > 0).map(cat => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{cat.name}</span>
                      <span>{cat.count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(cat.count / Math.max(...categoryData.map(c => c.count))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
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
              <Select value={filterSentiment} onValueChange={setFilterSentiment}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeedback.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      {getSentimentIcon(item.sentiment)}
                      {item.category}
                    </CardTitle>
                    <Badge variant="outline">{item.department}</Badge>
                  </div>
                  {item.course && (
                    <CardDescription>Course: {item.course}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{item.message}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Submitted on {item.date}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredFeedback.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No feedback found</h3>
              <p className="text-muted-foreground mb-4">No feedback matches your current filters</p>
              <Button onClick={() => setShowDialog(true)}>Submit Feedback</Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}