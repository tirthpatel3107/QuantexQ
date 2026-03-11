import { useState, useMemo } from "react";
import {
  CommonTabs,
  CommonTabsContent,
  CommonTabsNav,
} from "@/components/common";
import { Users } from "./Users";
import { Roles } from "./Roles";

export function UsersRoles() {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = useMemo(
    () => [
      { value: "users", label: "Users" },
      { value: "roles", label: "Roles" },
    ],
    [],
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CommonTabs value={activeTab} onValueChange={setActiveTab}>
        <CommonTabsNav items={tabs} />

        <CommonTabsContent value="users">
          <Users />
        </CommonTabsContent>

        <CommonTabsContent value="roles">
          <Roles />
        </CommonTabsContent>
      </CommonTabs>
    </div>
  );
}
