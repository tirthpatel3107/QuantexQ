import { useState } from "react";
import {
  PageLayout,
  CommonAlertDialog,
  CommonButton,
  PageLoader,
} from "@/components/common";
import { PanelCard } from "@/components/dashboard/PanelCard";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Check,
} from "lucide-react";
import { useInitialSkeleton } from "@/hooks/useInitialSkeleton";
import { useTheme } from "@/components/theme-provider";

const sessions = [
  {
    device: "Rugged Tablet · Rig Control Room",
    location: "DW-0347",
    status: "Active",
    lastSeen: "Now",
  },
  {
    device: "Laptop · Ops HQ",
    location: "Houston, TX",
    status: "Idle",
    lastSeen: "12m ago",
  },
  {
    device: "Mobile · Field Engineer",
    location: "Offshore Block A-7",
    status: "Offline",
    lastSeen: "3h ago",
  },
];

const Profile = () => {
  const [maintenanceOpen, setMaintenanceOpen] = useState<
    false | "access" | "profile"
  >(false);
  const { theme, setTheme } = useTheme();

  const [prefs, setPrefs] = useState({
    alerts: false,
    notifications: false,
  });
  const showSkeleton = useInitialSkeleton();

  if (showSkeleton) {
    return <PageLoader />;
  }

  return (
    <PageLayout>
      <main className="flex-1 p-4 text-foreground">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero */}
          <Card className="dashboard-panel overflow-hidden border-0 shadow-none">
            <CardContent className="p-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-primary/40 shadow-lg shadow-primary/20">
                  <AvatarFallback className="text-lg font-semibold">
                    QX
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">QuantexQ Operator</h1>
                    <Badge
                      variant="outline"
                      className="border-primary/40 text-primary"
                    >
                      On Shift
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Systems Engineer · Live Monitoring
                  </p>
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
                <CommonButton
                  variant="outline"
                  className="border-primary/20 text-primary hover:bg-primary/5 dark:bg-black/20"
                  onClick={() => setMaintenanceOpen("profile")}
                >
                  Edit Profile
                </CommonButton>
                <CommonButton
                  className="bg-primary text-primary-foreground hover:bg-primary/95 shadow-md"
                  onClick={() => setMaintenanceOpen("access")}
                >
                  Manage Access
                </CommonButton>
              </div>
            </CardContent>
          </Card>

          {/* Grids */}
          <div className="grid gap-5 lg:grid-cols-3">
            <PanelCard
              title={
                <>
                  <UserRound className="h-4 w-4 text-primary" />
                  Account
                </>
              }
              contentClassName="space-y-4 text-sm text-muted-foreground"
            >
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
            </PanelCard>

            <PanelCard
              title={
                <>
                  <MoonStar className="h-4 w-4 text-primary" />
                  Preferences
                </>
              }
              contentClassName="space-y-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-foreground">Theme</span>
                  <p className="text-xs text-muted-foreground">
                    Select interface appearance
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"}`}
                    style={{ backgroundColor: "hsl(0 0% 4%)" }}
                    onClick={() => setTheme("dark")}
                    title="Dark Black"
                  >
                    {theme === "dark" && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                  {/* <button
                    className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${theme === "midnight" ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"}`}
                    style={{ backgroundColor: "hsl(0 0% 12%)" }}
                    onClick={() => setTheme("midnight")}
                    title="Midnight Grey"
                  >
                    {theme === "midnight" && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button> */}
                  <button
                    className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${theme === "light" ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"}`}
                    style={{ backgroundColor: "hsl(0 0% 98%)" }}
                    onClick={() => setTheme("light")}
                    title="Light"
                  >
                    {theme === "light" && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-foreground">Alerts</span>
                  <p className="text-xs text-muted-foreground">
                    Critical + Warning
                  </p>
                </div>
                <Switch
                  checked={prefs.alerts}
                  onCheckedChange={(checked) =>
                    setPrefs((p) => ({ ...p, alerts: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-foreground">Notifications</span>
                  <p className="text-xs text-muted-foreground">
                    In-app + Email
                  </p>
                </div>
                <Switch
                  checked={prefs.notifications}
                  onCheckedChange={(checked) =>
                    setPrefs((p) => ({ ...p, notifications: checked }))
                  }
                />
              </div>
            </PanelCard>

            <PanelCard
              title={
                <>
                  <BellRing className="h-4 w-4 text-primary" />
                  Alerts & Coverage
                </>
              }
              contentClassName="space-y-3 text-sm text-muted-foreground"
            >
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
            </PanelCard>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <PanelCard
              title={
                <>
                  <Globe2 className="h-4 w-4 text-primary" />
                  Current Session
                </>
              }
              contentClassName="space-y-3 text-sm text-muted-foreground"
            >
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
            </PanelCard>

            <PanelCard
              title={
                <>
                  <Smartphone className="h-4 w-4 text-primary" />
                  Sessions & Devices
                </>
              }
              contentClassName="p-0"
            >
              <ScrollArea className="max-h-[260px]">
                <div className="divide-y divide-border/50">
                  {sessions.map((session) => (
                    <div
                      key={session.device}
                      className="py-3 flex items-center justify-between text-sm"
                    >
                      <div className="space-y-0.5">
                        <div className="text-foreground">{session.device}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {session.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            session.status === "Active" ? "default" : "outline"
                          }
                        >
                          {session.status}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {session.lastSeen}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PanelCard>
          </div>
        </div>
      </main>

      <CommonAlertDialog
        open={!!maintenanceOpen}
        onOpenChange={(open) => setMaintenanceOpen(open ? "access" : false)}
        title="Feature under maintenance"
        description={
          maintenanceOpen === "access"
            ? "Manage Access is temporarily unavailable while we perform maintenance. Please try again later."
            : maintenanceOpen === "profile"
              ? "Update Profile is temporarily unavailable while we perform maintenance. Please try again later."
              : "This feature is currently under maintenance. Please try again later."
        }
        actionText="OK"
        onAction={() => setMaintenanceOpen(false)}
      />
    </PageLayout>
  );
};

export default Profile;
