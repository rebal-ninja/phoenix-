import { motion } from "framer-motion";
import { Settings as SettingsIcon, Moon, Sun, Bell, Database, Shield, Users, Palette, Monitor } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/use-theme";
import { useState, useEffect } from "react";

interface SystemSettings {
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    conflictAlerts: boolean;
  };
  display: {
    compactMode: boolean;
    showAnimations: boolean;
    autoRefresh: boolean;
    refreshInterval: number;
  };
  data: {
    autoBackup: boolean;
    backupFrequency: string;
    dataRetention: number;
    exportFormat: string;
  };
  security: {
    sessionTimeout: number;
    twoFactorAuth: boolean;
    accessLogging: boolean;
    passwordExpiry: number;
  };
}

const defaultSettings: SystemSettings = {
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    conflictAlerts: true
  },
  display: {
    compactMode: false,
    showAnimations: true,
    autoRefresh: true,
    refreshInterval: 30
  },
  data: {
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: 365,
    exportFormat: "json"
  },
  security: {
    sessionTimeout: 60,
    twoFactorAuth: false,
    accessLogging: true,
    passwordExpiry: 90
  }
};

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem("phoenix-scheduler-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("phoenix-scheduler-settings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (section: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("phoenix-scheduler-settings");
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'phoenix-scheduler-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage system preferences and configuration</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="campus-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Appearance</span>
              </CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className="flex items-center space-x-2"
                  >
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className="flex items-center space-x-2"
                  >
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                    className="flex items-center space-x-2"
                  >
                    <Monitor className="h-4 w-4" />
                    <span>System</span>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Display Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <p className="text-xs text-muted-foreground">Reduce spacing and padding</p>
                  </div>
                  <Switch
                    id="compact-mode"
                    checked={settings.display.compactMode}
                    onCheckedChange={(checked) => updateSettings('display', 'compactMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="animations">Show Animations</Label>
                    <p className="text-xs text-muted-foreground">Enable smooth transitions and effects</p>
                  </div>
                  <Switch
                    id="animations"
                    checked={settings.display.showAnimations}
                    onCheckedChange={(checked) => updateSettings('display', 'showAnimations', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-refresh">Auto Refresh</Label>
                    <p className="text-xs text-muted-foreground">Automatically update data</p>
                  </div>
                  <Switch
                    id="auto-refresh"
                    checked={settings.display.autoRefresh}
                    onCheckedChange={(checked) => updateSettings('display', 'autoRefresh', checked)}
                  />
                </div>

                {settings.display.autoRefresh && (
                  <div className="space-y-2">
                    <Label>Refresh Interval (seconds)</Label>
                    <Select
                      value={settings.display.refreshInterval.toString()}
                      onValueChange={(value) => updateSettings('display', 'refreshInterval', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="campus-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>Configure alert and notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.emailNotifications}
                  onCheckedChange={(checked) => updateSettings('notifications', 'emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Browser push notifications</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.notifications.pushNotifications}
                  onCheckedChange={(checked) => updateSettings('notifications', 'pushNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-xs text-muted-foreground">Get weekly analytics summary</p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={settings.notifications.weeklyReports}
                  onCheckedChange={(checked) => updateSettings('notifications', 'weeklyReports', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="conflict-alerts">Conflict Alerts</Label>
                  <p className="text-xs text-muted-foreground">Alert for scheduling conflicts</p>
                </div>
                <Switch
                  id="conflict-alerts"
                  checked={settings.notifications.conflictAlerts}
                  onCheckedChange={(checked) => updateSettings('notifications', 'conflictAlerts', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data & Backup Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="campus-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Data & Backup</span>
              </CardTitle>
              <CardDescription>Manage data storage and backup preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup">Auto Backup</Label>
                  <p className="text-xs text-muted-foreground">Automatically backup data</p>
                </div>
                <Switch
                  id="auto-backup"
                  checked={settings.data.autoBackup}
                  onCheckedChange={(checked) => updateSettings('data', 'autoBackup', checked)}
                />
              </div>

              {settings.data.autoBackup && (
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select
                    value={settings.data.backupFrequency}
                    onValueChange={(value) => updateSettings('data', 'backupFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Data Retention (days)</Label>
                <Select
                  value={settings.data.dataRetention.toString()}
                  onValueChange={(value) => updateSettings('data', 'dataRetention', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="730">2 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select
                  value={settings.data.exportFormat}
                  onValueChange={(value) => updateSettings('data', 'exportFormat', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="campus-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </CardTitle>
              <CardDescription>Configure security and access control settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Select
                  value={settings.security.sessionTimeout.toString()}
                  onValueChange={(value) => updateSettings('security', 'sessionTimeout', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">Enhanced security with 2FA</p>
                </div>
                <Switch
                  id="two-factor"
                  checked={settings.security.twoFactorAuth}
                  onCheckedChange={(checked) => updateSettings('security', 'twoFactorAuth', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="access-logging">Access Logging</Label>
                  <p className="text-xs text-muted-foreground">Log user access and activities</p>
                </div>
                <Switch
                  id="access-logging"
                  checked={settings.security.accessLogging}
                  onCheckedChange={(checked) => updateSettings('security', 'accessLogging', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Password Expiry (days)</Label>
                <Select
                  value={settings.security.passwordExpiry.toString()}
                  onValueChange={(value) => updateSettings('security', 'passwordExpiry', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="campus-card">
          <CardHeader>
            <CardTitle>System Actions</CardTitle>
            <CardDescription>Export, reset, or manage system settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={exportSettings} variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Export Settings
              </Button>
              <Button onClick={resetSettings} variant="outline">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Reset to Default
              </Button>
              <Button className="campus-button-primary">
                <Shield className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}