import { 
  BarChart3, 
  Calendar, 
  Users, 
  BookOpen, 
  Laptop, 
  Users2, 
  GraduationCap, 
  Clock, 
  Settings,
  Home,
  Zap,
  Search,
  MessageCircle,
  HeadphonesIcon,
  Megaphone,
  CalendarDays
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home, description: "Overview & Analytics" },
  { title: "Schedule Generator", url: "/schedule", icon: Zap, description: "AI-Powered Scheduling" },
  { title: "Timetable", url: "/timetable", icon: Calendar, description: "View Schedules" },
  { title: "Reports", url: "/reports", icon: BarChart3, description: "Analytics & Insights" },
  { title: "Library", url: "/library", icon: BookOpen, description: "Book Study Slots" },
  { title: "Labs", url: "/labs", icon: Laptop, description: "Computer Lab Management" },
  { title: "Clubs", url: "/clubs", icon: Users2, description: "Student Organizations" },
  { title: "Faculty", url: "/faculty", icon: GraduationCap, description: "Faculty Management" },
  { title: "Remedial", url: "/remedial", icon: Clock, description: "Doubt Clearing Sessions" },
  { title: "Lost & Found", url: "/lost-found", icon: Search, description: "Report Lost Items" },
  { title: "Feedback Portal", url: "/feedback", icon: MessageCircle, description: "Anonymous Feedback" },
  { title: "Helpdesk", url: "/helpdesk", icon: HeadphonesIcon, description: "Directory & Support" },
  { title: "Notice Board", url: "/notices", icon: Megaphone, description: "Announcements" },
  { title: "Academic Calendar", url: "/calendar", icon: CalendarDays, description: "Events & Holidays" },
  { title: "Settings", url: "/settings", icon: Settings, description: "System Preferences" },
];

export function PhoenixSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <motion.div 
          className="p-6 border-b border-sidebar-border"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <h2 className="font-bold text-lg text-sidebar-foreground">Phoenix Scheduler</h2>
                <p className="text-xs text-sidebar-foreground/70">University Management</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end
                        className={({ isActive }) =>
                          `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                            isActive 
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                          }`
                        }
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {open && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 min-w-0"
                          >
                            <div className="font-medium">{item.title}</div>
                            <div className="text-xs opacity-70 truncate">{item.description}</div>
                          </motion.div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}