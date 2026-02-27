import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
  type PaginationState,
} from "@tanstack/react-table";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  CommonButton,
  CommonSearchInput,
  CommonTable,
  CommonDialog,
} from "@/components/common";
import { CommonAlertDialog } from "@/components/common/CommonAlertDialog";
import { CommonInput } from "@/components/common/CommonInput";
import { Label } from "@/components/ui/label";

type Role = {
  id: number;
  role: string;
  description: string;
};

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

const roleColumnHelper = createColumnHelper<Role>();

export function Roles() {
  const [roleSearch, setRoleSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

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
              }}
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              className="p-1.5 rounded-md text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all"
              title="Delete Role"
              onClick={() => {
                setSelectedRole(info.row.original);
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
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
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

      <CommonAlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Role?"
        description={`Are you sure you want to delete the role "${selectedRole?.role}"? This action cannot be undone and will remove all associated permissions.`}
        actionText="Delete"
        cancelText="Cancel"
        onAction={() => setIsDeleteConfirmOpen(false)}
        actionClassName="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      />
    </div>
  );
}
