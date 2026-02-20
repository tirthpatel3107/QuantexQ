import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import { ShieldCheck, Pencil, Trash2, UserPlus, Filter } from "lucide-react";
import {
  CommonButton,
  CommonSearchInput,
  CommonTable,
  CommonDialog,
  CommonDropdownMenu,
} from "@/components/common";
import { CommonAlertDialog } from "@/components/common/CommonAlertDialog";
import { CommonInput } from "@/components/common/CommonInput";
import { CommonSelect } from "@/components/common/CommonSelect";

type User = {
  id: number;
  name: string;
  username: string;
  role: string;
  lastModified: string;
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

const userColumnHelper = createColumnHelper<User>();

export function Users() {
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const roleOptions = [
    { label: "Admin", value: "Admin" },
    { label: "Rig Operator", value: "Rig Operator" },
    { label: "Rig Supervisor", value: "Rig Supervisor" },
    { label: "Scientist", value: "Scientist" },
    { label: "Technician", value: "Technician" },
    { label: "Supervisor", value: "Supervisor" },
  ];

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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

  const filteredUsers = useMemo(() => {
    if (roleFilter.length === 0) {
      return USERS_DATA;
    }
    return USERS_DATA.filter((user) => roleFilter.includes(user.role));
  }, [roleFilter]);

  const usersTable = useReactTable({
    data: filteredUsers,
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

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
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
              onValueChange={(value) => setRoleFilter(value as string[])}
              options={roleOptions}
              triggerLabel="Roles"
              triggerIcon={Filter}
              menuLabel="Filter by Role"
              title="Filter by Role"
              contentWidth="w-[240px]"
              triggerClassName="px-2.5"
              searchable={true}
              searchPlaceholder="Search roles..."
              multiple={true}
              showBadges={true}
              showCount={true}
            />
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
              options={roleOptions}
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
              options={roleOptions}
              value={selectedUser?.role || ""}
              onValueChange={() => {}}
              placeholder="Select a role"
            />
          </div>
        </div>
      </CommonDialog>

      <CommonAlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete User?"
        description="Are you sure you want to delete this user? This action cannot be undone and will remove all associated permissions."
        actionText="Delete"
        cancelText="Cancel"
        onAction={() => setIsDeleteConfirmOpen(false)}
        actionClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      />
    </div>
  );
}
