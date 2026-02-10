import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  BellRing,
  Globe2,
  Mail,
  MapPin,
  MoonStar,
  ShieldCheck,
  Smartphone,
  UserRound,
  Wifi,
  Clock4,
} from "lucide-react";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";
import { useTheme } from "@/components/theme-provider";

const sessions = [
  { device: "Rugged Tablet · Rig Control Room", location: "DW-0347", status: "Active", lastSeen: "Now" },
  { device: "Laptop · Ops HQ", location: "Houston, TX", status: "Idle", lastSeen: "12m ago" },
  { device: "Mobile · Field Engineer", location: "Offshore Block A-7", status: "Offline", lastSeen: "3h ago" },
];

const Profile = () => {
  const [maintenanceOpen, setMaintenanceOpen] = useState<false | "access" | "profile">(false);
  const { theme, setTheme } = useTheme();

  const [prefs, setPrefs] = useState({
    alerts: false,
    notifications: false,
  });
  const showSkeleton = useInitialSkeleton();

  if (showSkeleton) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header />
        <main className="flex-1 px-6 py-20 pt-24">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Hero skeleton */}
            <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur">
              <CardContent className="p-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="skeleton h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <div className="skeleton h-5 w-48 rounded-md" />
                    <div className="skeleton h-3 w-56 rounded-md" />
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div className="skeleton h-6 w-24 rounded-full" />
                      <div className="skeleton h-6 w-28 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="skeleton h-9 w-32 rounded-md" />
                  <div className="skeleton h-9 w-32 rounded-md" />
                </div>
              </CardContent>
            </Card>

            {/* Grids skeleton */}
            <div className="grid gap-4 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <Card key={i} className="border-border/60 bg-card/70 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="skeleton h-4 w-4 rounded-full" />
                      <div className="skeleton h-4 w-24 rounded-md" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[0, 1, 2].map((j) => (
                      <div key={j} className="space-y-2">
                        <div className="skeleton h-3 w-28 rounded-md" />
                        <div className="skeleton h-3 w-40 rounded-md" />
                        <Separator />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {[0, 1].map((i) => (
                <Card key={i} className="border-border/60 bg-card/70 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="skeleton h-4 w-4 rounded-full" />
                      <div className="skeleton h-4 w-28 rounded-md" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[0, 1, 2].map((j) => (
                      <div key={j} className="skeleton h-3 w-full rounded-md" />
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 px-6 py-20 pt-24">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero */}
          <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur">
            <CardContent className="p-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-primary/40 shadow-lg shadow-primary/20">
                  <AvatarFallback className="text-lg font-semibold">QX</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">QuantexQ Operator</h1>
                    <Badge variant="outline" className="border-primary/40 text-primary">
                      On Shift
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">Systems Engineer · Live Monitoring</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/60 px-2 py-1 text-foreground">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Tier 2 Access
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/40 px-2 py-1 text-foreground">
                      <Clock4 className="h-3.5 w-3.5" />
                      Shift: 08:00–20:00
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-border text-foreground"
                  onClick={() => setMaintenanceOpen("access")}
                >
                  Manage Access
                </Button>
                <Button onClick={() => setMaintenanceOpen("profile")}>Update Profile</Button>
              </div>
            </CardContent>
          </Card>

          {/* Grids */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="border-border/60 bg-card/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <UserRound className="h-4 w-4 text-primary" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Email</span>
                  <span>operator@quantexq.com</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Role</span>
                  <span>Monitoring & Control</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Access</span>
                  <span>Tier 2 (write)</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <MoonStar className="h-4 w-4 text-primary" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-foreground">Theme</span>
                    <p className="text-xs text-muted-foreground">{theme === "dark" ? "Dark mode active" : "Light mode active"}</p>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-foreground">Alerts</span>
                    <p className="text-xs text-muted-foreground">Critical + Warning</p>
                  </div>
                  <Switch
                    checked={prefs.alerts}
                    onCheckedChange={(checked) => setPrefs((p) => ({ ...p, alerts: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-foreground">Notifications</span>
                    <p className="text-xs text-muted-foreground">In-app + Email</p>
                  </div>
                  <Switch
                    checked={prefs.notifications}
                    onCheckedChange={(checked) => setPrefs((p) => ({ ...p, notifications: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <BellRing className="h-4 w-4 text-primary" />
                  Alerts & Coverage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Live coverage</span>
                  <Badge variant="outline">24/7</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">SLA</span>
                  <span>3 min response</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-foreground text-sm">Recent flags</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary">SPP drift +1.8%</Badge>
                    <Badge variant="secondary">Choke variance</Badge>
                    <Badge variant="secondary">Density stable</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-border/60 bg-card/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Globe2 className="h-4 w-4 text-primary" />
                  Current Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-foreground">
                    <Wifi className="h-4 w-4 text-primary" />
                    <span>Connected · Secure</span>
                  </div>
                  <Badge variant="outline">VPN</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Rig Control Room · DW-0347</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>operator@quantexq.com</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/70 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Smartphone className="h-4 w-4 text-primary" />
                  Sessions & Devices
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="max-h-[260px]">
                  <div className="divide-y divide-border/50">
                    {sessions.map((session) => (
                      <div key={session.device} className="px-4 py-3 flex items-center justify-between text-sm">
                        <div className="space-y-0.5">
                          <div className="text-foreground">{session.device}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {session.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={session.status === "Active" ? "default" : "outline"}>
                            {session.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground">{session.lastSeen}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AlertDialog open={!!maintenanceOpen} onOpenChange={(open) => setMaintenanceOpen(open ? "access" : false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Feature under maintenance</AlertDialogTitle>
            <AlertDialogDescription>
              {maintenanceOpen === "access"
                ? "Manage Access is temporarily unavailable while we perform maintenance."
                : "Update Profile is temporarily unavailable while we perform maintenance."}
              {" "}Please try again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setMaintenanceOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
