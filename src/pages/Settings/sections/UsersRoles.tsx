import { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import {
  Users,
  ShieldCheck,
  Pencil,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Filter,
} from "lucide-react";
import {
  CommonButton,
  CommonSelect,
  CommonSearchInput,
  CommonTable,
  CommonDialog,
  CommonTabs,
  CommonTabsList,
  CommonTabsTrigger,
  CommonTabsContent,
  CommonTabsNav,
  CommonDropdownMenu,
} from "@/components/common";
import { cn } from "@/lib/utils";
import { CommonAlertDialog } from "@/components/common/CommonAlertDialog";
import { Label } from "@/components/ui/label";
import { CommonInput } from "@/components/common/CommonInput";

type User = {
  id: number;
  name: string;
  username: string;
  role: string;
  lastModified: string;
};

type Role = {
  id: number;
  role: string;
  description: string;
};

const USERS_DATA: User[] = [
  {
    id: 1,
    name: "Tony Carter",
    username: "Admin",
    role: "Admin",
    lastModified: "01 Jul 2020 | 15:21",
  },
  {
    id: 2,
    name: "RigUser",
    username: "RigUser",
    role: "Rig Operator",
    lastModified: "21 Jun 2020 | 12:21",
  },
  {
    id: 3,
    name: "Sand.Patel",
    username: "Sand.Patel",
    role: "Rig Supervisor",
    lastModified: "04 Jan 2010 | 10:21",
  },
  {
    id: 4,
    name: "Amer.Rao",
    username: "Amer.Rao",
    role: "Scientist",
    lastModified: "04 Jul 2020 | 12:21",
  },
  {
    id: 5,
    name: "Gailfoort",
    username: "Gailfoort",
    role: "Supervisor",
    lastModified: "08 Jul 2010 | 12:21",
  },
  {
    id: 6,
    name: "Rebecca.Nilsen",
    username: "Rebecca.Nilsen",
    role: "Technician",
    lastModified: "04 Jun 2010 | 18:21",
  },
  {
    id: 7,
    name: "John Doe",
    username: "j.doe",
    role: "Rig Operator",
    lastModified: "15 Feb 2024 | 09:12",
  },
  {
    id: 8,
    name: "Jane Smith",
    username: "j.smith",
    role: "Admin",
    lastModified: "12 Feb 2024 | 14:45",
  },
];

const ROLES_DATA: Role[] = [
  {
    id: 1,
    role: "Admin",
    description: "Full system access and configuration capabilities.",
  },
  {
    id: 2,
    role: "Rig Operator",
    description: "Access to drilling controls and real-time monitoring.",
  },
  {
    id: 3,
    role: "Rig Supervisor",
    description: "Oversight of rig operations and reporting features.",
  },
  {
    id: 4,
    role: "Technician",
    description: "Maintenance and diagnostic tool access.",
  },
  {
    id: 5,
    role: "Scientist",
    description: "Advanced data analysis and modeling tools.",
  },
];

const userColumnHelper = createColumnHelper<User>();
const roleColumnHelper = createColumnHelper<Role>();

export function UsersRoles() {
  const [activeTab, setActiveTab] = useState("users");
  const [userSearch, setUserSearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const roleOptions = [
    { label: "All Roles", value: "all" },
    { label: "Admin", value: "Admin" },
    { label: "Rig Operator", value: "Rig Operator" },
    { label: "Rig Supervisor", value: "Rig Supervisor" },
    { label: "Scientist", value: "Scientist" },
    { label: "Technician", value: "Technician" },
  ];

  // Modal states
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [deleteType, setDeleteType] = useState<"user" | "role" | null>(null);

  const tabs = useMemo(
    () => [
      { value: "users", label: "Users" },
      { value: "roles", label: "Roles" },
    ],
    [],
  );

  // Users table columns
  const usersColumns = useMemo(
    () => [
      userColumnHelper.accessor("name", {
        header: "Name",
        size: 220,
        cell: (info) => (
          <div className="flex flex-col text-[13px]">
            <span className="font-medium text-foreground/90">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      userColumnHelper.accessor("username", {
        header: "Username",
        size: 180,
        cell: (info) => (
          <span className="text-muted-foreground text-[13px]">
            {info.getValue()}
          </span>
        ),
      }),
      userColumnHelper.accessor("role", {
        header: "Role",
        size: 180,
        cell: (info) => (
          <div className="flex items-center gap-1.5 text-[13px]">
            <ShieldCheck className="h-3.5 w-3.5 text-primary/70" />
            <span className="text-muted-foreground">{info.getValue()}</span>
          </div>
        ),
      }),
      userColumnHelper.accessor("lastModified", {
        header: "Last Modified",
        size: 150,
        cell: (info) => (
          <span className="text-muted-foreground text-[13px]">
            {info.getValue()}
          </span>
        ),
      }),
      userColumnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        size: 100,
        cell: (info) => (
          <div className="flex justify-end gap-1.5">
            <button
              className="p-1.5 rounded-md text-success/70 hover:text-success hover:bg-success/10 transition-all"
              title="Edit User"
              onClick={() => {
                setSelectedUser(info.row.original);
                setIsEditUserModalOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              className="p-1.5 rounded-md text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all"
              title="Delete User"
              onClick={() => {
                setSelectedUser(info.row.original);
                setDeleteType("user");
                setIsDeleteConfirmOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      }),
    ],
    [],
  );

  // Roles table columns
  const rolesColumns = useMemo(
    () => [
      roleColumnHelper.accessor("role", {
        header: "Role Name",
        size: 250,
        cell: (info) => (
          <span className="font-semibold text-foreground/90">
            {info.getValue()}
          </span>
        ),
      }),
      roleColumnHelper.accessor("description", {
        header: "Description",
        size: 400,
        cell: (info) => (
          <span className="text-muted-foreground text-[13px] leading-snug block truncate">
            {info.getValue()}
          </span>
        ),
      }),
      roleColumnHelper.display({
        id: "actions",
        header: () => <div className="text-right px-6">Action</div>,
        size: 150,
        cell: (info) => (
          <div className="flex justify-end gap-1.5 pr-6">
            <button
              className="p-1.5 rounded-md text-success/70 hover:text-success hover:bg-success/10 transition-all"
              title="Edit Role"
              onClick={() => {
                setSelectedRole(info.row.original);
                // The user didn't explicitly ask for edit role modal, but it's good for consistency
                // If we don't have it, we could just say implement edit role logic
              }}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              className="p-1.5 rounded-md text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all"
              title="Delete Role"
              onClick={() => {
                setSelectedRole(info.row.original);
                setDeleteType("role");
                setIsDeleteConfirmOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ),
      }),
    ],
    [],
  );

  const usersTable = useReactTable({
    data: USERS_DATA,
    columns: usersColumns,
    state: {
      sorting,
      pagination,
      globalFilter: userSearch,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });

  // Apply role filter to the "role" column
  useEffect(() => {
    usersTable
      .getColumn("role")
      ?.setFilterValue(roleFilter === "all" ? undefined : roleFilter);
  }, [roleFilter, usersTable]);

  const rolesTable = useReactTable({
    data: ROLES_DATA,
    columns: rolesColumns,
    state: {
      pagination,
      globalFilter: roleSearch,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CommonTabs value={activeTab} onValueChange={setActiveTab}>
        <CommonTabsNav items={tabs} />

        <CommonTabsContent value="users" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <CommonSearchInput
                placeholder="Search users..."
                value={userSearch}
                onChange={setUserSearch}
                className="w-full sm:w-[400px]"
              />
              <div className="relative">
                <CommonDropdownMenu
                  value={roleFilter}
                  onValueChange={setRoleFilter}
                  options={roleOptions}
                  triggerIcon={Filter}
                  menuLabel="Filter by Role"
                  highlightActive={true}
                  defaultValue="all"
                  title="Filter by Role"
                  contentWidth="w-[200px]"
                  triggerClassName="px-2.5"
                />
                {roleFilter !== "all" && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground font-bold shadow-glow pointer-events-none">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
                    1
                  </span>
                )}
              </div>
            </div>
            <CommonButton
              variant="outline"
              size="sm"
              className="h-9 px-4 border-border hover:border-primary/50 hover:bg-primary/5 text-foreground bg-white/5 shadow-sm active:scale-95 whitespace-nowrap"
              icon={UserPlus}
              onClick={() => setIsAddUserModalOpen(true)}
            >
              Add New User
            </CommonButton>
          </div>

          <CommonTable table={usersTable} noDataMessage="No users found." />
        </CommonTabsContent>

        <CommonTabsContent
          value="roles"
          className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <CommonSearchInput
                placeholder="Search roles..."
                value={roleSearch}
                onChange={setRoleSearch}
                className="w-full sm:w-[400px]"
              />
            </div>
            <CommonButton
              variant="outline"
              size="sm"
              className="h-9 px-4 border-border hover:border-primary/50 hover:bg-primary/5 text-foreground bg-white/5 shadow-sm active:scale-95 whitespace-nowrap"
              icon={Plus}
              onClick={() => setIsAddRoleModalOpen(true)}
            >
              Add Custom Role
            </CommonButton>
          </div>

          <CommonTable table={rolesTable} noDataMessage="No roles found." />
        </CommonTabsContent>
      </CommonTabs>

      <CommonDialog
        open={isAddUserModalOpen}
        onOpenChange={setIsAddUserModalOpen}
        title="Add New User"
        description="Create a new system user with specific roles and permissions."
        footer={
          <>
            <CommonButton
              variant="outline"
              size="sm"
              className="h-9 border-border hover:bg-white/5"
              onClick={() => setIsAddUserModalOpen(false)}
            >
              Cancel
            </CommonButton>
            <CommonButton
              size="sm"
              className="h-9"
              onClick={() => setIsAddUserModalOpen(false)}
            >
              Create User
            </CommonButton>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <CommonInput
              label="Full Name"
              id="name"
              placeholder="Enter full name"
            />
          </div>
          <div className="grid gap-2">
            <CommonInput
              label="Username"
              id="username"
              placeholder="Enter username"
            />
          </div>
          <div className="grid gap-2">
            <CommonSelect
              label="Role"
              options={roleOptions.filter((opt) => opt.value !== "all")}
              value=""
              onValueChange={() => {}}
              placeholder="Select a role"
            />
          </div>
        </div>
      </CommonDialog>

      <CommonDialog
        open={isEditUserModalOpen}
        onOpenChange={setIsEditUserModalOpen}
        title="Edit User"
        description={`Modify details for ${selectedUser?.name}.`}
        footer={
          <>
            <CommonButton
              variant="outline"
              size="sm"
              className="h-9 border-border hover:bg-white/5"
              onClick={() => setIsEditUserModalOpen(false)}
            >
              Cancel
            </CommonButton>
            <CommonButton
              size="sm"
              className="h-9"
              onClick={() => setIsEditUserModalOpen(false)}
            >
              Save Changes
            </CommonButton>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <CommonInput
              label="Full Name"
              id="edit-name"
              defaultValue={selectedUser?.name}
              placeholder="Enter full name"
            />
          </div>
          <div className="grid gap-2">
            <CommonInput
              label="Username"
              id="edit-username"
              defaultValue={selectedUser?.username}
              placeholder="Enter username"
            />
          </div>
          <div className="grid gap-2">
            <CommonSelect
              label="Role"
              options={roleOptions.filter((opt) => opt.value !== "all")}
              value={selectedUser?.role || ""}
              onValueChange={() => {}}
              placeholder="Select a role"
            />
          </div>
        </div>
      </CommonDialog>

      <CommonDialog
        open={isAddRoleModalOpen}
        onOpenChange={setIsAddRoleModalOpen}
        title="Add Custom Role"
        description="Define a new role with specific system permissions."
        footer={
          <>
            <CommonButton
              variant="outline"
              size="sm"
              className="h-9 border-border hover:bg-white/5"
              onClick={() => setIsAddRoleModalOpen(false)}
            >
              Cancel
            </CommonButton>
            <CommonButton
              size="sm"
              className="h-9"
              onClick={() => setIsAddRoleModalOpen(false)}
            >
              Add Role
            </CommonButton>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <CommonInput
              label="Role Name"
              id="role-name"
              placeholder="e.g. Lead Engineer"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role-desc">Description</Label>
            <textarea
              id="role-desc"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Briefly describe this role's responsibilities"
            />
          </div>
        </div>
      </CommonDialog>

      {/* Delete Confirmation */}
      <CommonAlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title={`Delete ${deleteType === "user" ? "User" : "Role"}?`}
        description={`Are you sure you want to delete this ${deleteType}? This action cannot be undone and will remove all associated permissions.`}
        actionText="Delete"
        cancelText="Cancel"
        onAction={() => setIsDeleteConfirmOpen(false)}
        actionClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      />
    </div>
  );
}
