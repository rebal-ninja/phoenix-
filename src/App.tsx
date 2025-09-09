import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PhoenixSidebar } from "@/components/layout/phoenix-sidebar";
import { PhoenixHeader } from "@/components/layout/phoenix-header";

// Pages
import Dashboard from "./pages/Dashboard";
import ScheduleGenerator from "./pages/ScheduleGenerator";
import Timetable from "./pages/Timetable";
import Reports from "./pages/Reports";
import Library from "./pages/Library";
import Labs from "./pages/Labs";
import Clubs from "./pages/Clubs";
import Faculty from "./pages/Faculty";
import Remedial from "./pages/Remedial";
import LostFound from "./pages/LostFound";
import Feedback from "./pages/Feedback";
import Helpdesk from "./pages/Helpdesk";
import Notices from "./pages/Notices";
import AcademicCalendar from "./pages/AcademicCalendar";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="phoenix-scheduler-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <SidebarProvider defaultOpen>
                    <div className="min-h-screen flex w-full bg-background">
                      <PhoenixSidebar />
                      <div className="flex-1 flex flex-col">
                        <PhoenixHeader />
                        <main className="flex-1 overflow-auto">
                          <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/schedule" element={<ScheduleGenerator />} />
                            <Route path="/timetable" element={<Timetable />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/library" element={<Library />} />
                            <Route path="/labs" element={<Labs />} />
                            <Route path="/clubs" element={<Clubs />} />
                            <Route path="/faculty" element={<Faculty />} />
                            <Route path="/remedial" element={<Remedial />} />
                            <Route path="/lost-found" element={<LostFound />} />
                            <Route path="/feedback" element={<Feedback />} />
                            <Route path="/helpdesk" element={<Helpdesk />} />
                            <Route path="/notices" element={<Notices />} />
                            <Route path="/calendar" element={<AcademicCalendar />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
