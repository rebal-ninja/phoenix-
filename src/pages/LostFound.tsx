import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Package, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface LostFoundItem {
  id: string;
  type: "lost" | "found";
  itemType: string;
  description: string;
  location: string;
  date: string;
  reporterName: string;
  reporterContact: string;
  status: "unclaimed" | "claimed" | "returned";
  claimedBy?: string;
  claimedDate?: string;
}

const itemTypes = ["Phone", "Charger", "Pendrive", "Books", "Keys", "Wallet", "ID Card", "Laptop", "Other"];

export default function LostFound() {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LostFoundItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "lost" | "found">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "unclaimed" | "claimed" | "returned">("all");
  const [showDialog, setShowDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    type: "lost" as "lost" | "found",
    itemType: "",
    description: "",
    location: "",
    reporterName: "",
    reporterContact: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem("lostFoundItems");
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lostFoundItems", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    let filtered = items;
    
    if (filterType !== "all") {
      filtered = filtered.filter(item => item.type === filterType);
    }
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.itemType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredItems(filtered);
  }, [items, searchTerm, filterType, filterStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItem.itemType || !newItem.description || !newItem.location || !newItem.reporterName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const item: LostFoundItem = {
      id: Date.now().toString(),
      ...newItem,
      date: new Date().toISOString().split('T')[0],
      status: "unclaimed"
    };

    setItems(prev => [...prev, item]);
    setNewItem({
      type: "lost",
      itemType: "",
      description: "",
      location: "",
      reporterName: "",
      reporterContact: ""
    });
    setShowDialog(false);
    
    toast({
      title: "Success",
      description: `${newItem.type === "lost" ? "Lost" : "Found"} item reported successfully`
    });
  };

  const handleClaim = (itemId: string) => {
    const claimerName = prompt("Enter your name to claim this item:");
    if (!claimerName) return;

    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status: "claimed", claimedBy: claimerName, claimedDate: new Date().toISOString().split('T')[0] }
        : item
    ));
    
    toast({
      title: "Item Claimed",
      description: "Admin approval pending. You will be contacted soon."
    });
  };

  const handleMarkReturned = (itemId: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, status: "returned" }
        : item
    ));
    
    toast({
      title: "Item Returned",
      description: "Item marked as successfully returned"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "unclaimed": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "claimed": return <Clock className="w-4 h-4 text-blue-500" />;
      case "returned": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unclaimed": return "yellow";
      case "claimed": return "blue";
      case "returned": return "green";
      default: return "gray";
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
            <h1 className="text-4xl font-bold text-foreground">Lost & Found</h1>
            <p className="text-muted-foreground mt-2">Report and track lost or found items</p>
          </div>
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Report Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Report Lost or Found Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={newItem.type} onValueChange={(value: "lost" | "found") => setNewItem(prev => ({...prev, type: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lost">Lost Item</SelectItem>
                        <SelectItem value="found">Found Item</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="itemType">Item Type</Label>
                    <Select value={newItem.itemType} onValueChange={(value) => setNewItem(prev => ({...prev, itemType: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item type" />
                      </SelectTrigger>
                      <SelectContent>
                        {itemTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the item..."
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({...prev, description: e.target.value}))}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Where was it lost/found?"
                    value={newItem.location}
                    onChange={(e) => setNewItem(prev => ({...prev, location: e.target.value}))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reporterName">Your Name</Label>
                    <Input
                      id="reporterName"
                      placeholder="Full name"
                      value={newItem.reporterName}
                      onChange={(e) => setNewItem(prev => ({...prev, reporterName: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reporterContact">Contact</Label>
                    <Input
                      id="reporterContact"
                      placeholder="Phone or email"
                      value={newItem.reporterContact}
                      onChange={(e) => setNewItem(prev => ({...prev, reporterContact: e.target.value}))}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">Submit Report</Button>
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
              <Search className="w-5 h-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lost">Lost Items</SelectItem>
                  <SelectItem value="found">Found Items</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unclaimed">Unclaimed</SelectItem>
                  <SelectItem value="claimed">Claimed</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        {item.itemType}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant={item.type === "lost" ? "destructive" : "default"}>
                          {item.type.toUpperCase()}
                        </Badge>
                        <Badge style={{ backgroundColor: `var(--${getStatusColor(item.status)}-500)` }}>
                          {getStatusIcon(item.status)}
                          {item.status.toUpperCase()}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="text-sm">
                      <p><strong>Location:</strong> {item.location}</p>
                      <p><strong>Date:</strong> {item.date}</p>
                      <p><strong>Reporter:</strong> {item.reporterName}</p>
                      {item.claimedBy && (
                        <p><strong>Claimed by:</strong> {item.claimedBy} on {item.claimedDate}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      {item.status === "unclaimed" && (
                        <Button 
                          size="sm" 
                          onClick={() => handleClaim(item.id)}
                          className="flex-1"
                        >
                          Claim Item
                        </Button>
                      )}
                      {item.status === "claimed" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkReturned(item.id)}
                          className="flex-1"
                        >
                          Mark Returned
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No items found</h3>
              <p className="text-muted-foreground mb-4">No items match your current filters</p>
              <Button onClick={() => setShowDialog(true)}>Report an Item</Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}