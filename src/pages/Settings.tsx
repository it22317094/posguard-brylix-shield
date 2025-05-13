
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SettingsIcon, Bell, User, ShieldAlert, Lock } from "lucide-react";

const Settings = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  
  // Security settings
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [enforceOTP, setEnforceOTP] = useState(true);
  const [bypassAttempts, setBypassAttempts] = useState("3");
  const [logFailedLogins, setLogFailedLogins] = useState(true);
  
  // Notification settings
  const [notifyHighAlerts, setNotifyHighAlerts] = useState(true);
  const [notifyMediumAlerts, setNotifyMediumAlerts] = useState(true);
  const [notifyLowAlerts, setNotifyLowAlerts] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // Profile settings
  const [email, setEmail] = useState(currentUser?.email || "");
  const [name, setName] = useState(currentUser?.name || "");

  const handleSecuritySave = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Security settings saved",
      description: "Your security settings have been updated successfully."
    });
  };

  const handleNotificationSave = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated successfully."
    });
  };

  const handleProfileSave = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
                <p className="text-xs text-muted-foreground">
                  This email will be used for OTP verification and notifications.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input 
                  id="role" 
                  value={currentUser?.role || ""} 
                  disabled 
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Role changes must be made by an administrator.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleProfileSave}
                className="bg-posguard-primary hover:bg-posguard-secondary"
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure which notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-high">High Priority Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications for security breaches, voids, etc.
                  </p>
                </div>
                <Switch 
                  id="notify-high" 
                  checked={notifyHighAlerts}
                  onCheckedChange={setNotifyHighAlerts}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-medium">Medium Priority Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications for pending KOTs, system status, etc.
                  </p>
                </div>
                <Switch 
                  id="notify-medium" 
                  checked={notifyMediumAlerts}
                  onCheckedChange={setNotifyMediumAlerts}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notify-low">Low Priority Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications for minor issues and information.
                  </p>
                </div>
                <Switch 
                  id="notify-low" 
                  checked={notifyLowAlerts}
                  onCheckedChange={setNotifyLowAlerts}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notify">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive a daily digest of all alerts via email.
                  </p>
                </div>
                <Switch 
                  id="email-notify" 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleNotificationSave}
                className="bg-posguard-primary hover:bg-posguard-secondary"
              >
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security settings for POSGuard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input 
                  id="session-timeout" 
                  type="number" 
                  min="5"
                  max="120"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  disabled={!isAdmin}
                />
                {!isAdmin && (
                  <p className="text-xs text-muted-foreground">
                    Only administrators can change this setting.
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enforce-otp">Enforce OTP on Login</Label>
                  <p className="text-xs text-muted-foreground">
                    Always require OTP verification for all users.
                  </p>
                </div>
                <Switch 
                  id="enforce-otp" 
                  checked={enforceOTP}
                  onCheckedChange={setEnforceOTP}
                  disabled={!isAdmin}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bypass-attempts">Max Bypass Attempts</Label>
                <Input 
                  id="bypass-attempts" 
                  type="number" 
                  min="1"
                  max="10"
                  value={bypassAttempts}
                  onChange={(e) => setBypassAttempts(e.target.value)}
                  disabled={!isAdmin}
                />
                <p className="text-xs text-muted-foreground">
                  Number of attempts before logging unauthorized bypass attempts.
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="failed-logins">Log Failed Login Attempts</Label>
                  <p className="text-xs text-muted-foreground">
                    Log all failed login attempts to the activity log.
                  </p>
                </div>
                <Switch 
                  id="failed-logins" 
                  checked={logFailedLogins}
                  onCheckedChange={setLogFailedLogins}
                  disabled={!isAdmin}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-2">
              <Button 
                onClick={handleSecuritySave}
                className="bg-posguard-primary hover:bg-posguard-secondary"
                disabled={!isAdmin}
              >
                Save Security Settings
              </Button>
              
              {!isAdmin && (
                <p className="text-sm text-muted-foreground">
                  You need administrator privileges to change security settings.
                </p>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
