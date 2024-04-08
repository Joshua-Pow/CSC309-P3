"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Send } from "lucide-react";
import {
  StopwatchIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  CircleIcon,
} from "@radix-ui/react-icons";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import axiosInstance from "@/lib/axiosUtil";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: StopwatchIcon,
  },
  {
    value: "accepted",
    label: "Accepted",
    icon: CheckCircledIcon,
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: CrossCircledIcon,
  },
  {
    value: "notInvited",
    label: "Not Invited",
    icon: CircleIcon,
  },
];

export type Invitation = {
  id: string;
  calendar_id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "pending" | "accepted" | "rejected" | "notInvited";
};

export const columns: ColumnDef<Invitation>[] = [
  {
    id: "name",
    accessorKey: "name",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    id: "email",
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return <p className="font-medium">{row.original.email}</p>;
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const icon = {
        pending: <StopwatchIcon />,
        accepted: <CheckCircledIcon />,
        rejected: <CrossCircledIcon />,
        notInvited: <CircleIcon />,
      };
      return (
        <span className="flex items-center gap-2">
          {icon[row.original.status]}{" "}
          {row.original.status === "notInvited"
            ? "Not Invited"
            : row.original.status.charAt(0).toUpperCase() +
              row.original.status.slice(1)}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "sendInvite",
    accessorKey: "sendInvite",
    header: "Send Invite",
    cell: ({ row }) => {
      const sendInviteToCalendar = async (invitee_username: string) => {
        await axiosInstance
          .post(`/calendars/${row.original.calendar_id}/invitations/`, {
            invitee_username,
          })
          .catch((error) => {
            console.error("Error sending invitation:", error);
            toast.error("Error sending invitation");
          });
        toast.success("Invitation sent!");
        queryClient.invalidateQueries({
          queryKey: ["invitations", row.original.calendar_id],
        });
      };

      return (
        <Button
          size="icon"
          disabled={
            row.original.status === "accepted" ||
            row.original.status === "pending"
          }
          onClick={() => sendInviteToCalendar(row.original.username)}
        >
          <Send width={16} height={16} strokeWidth={2} />
        </Button>
      );
    },
  },
];
