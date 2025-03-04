// src/stories/Table.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableEmptyState,
} from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { BaseButton } from "../components/ui/BaseButton";
import { Check, X, AlertCircle, Edit, Trash, Eye } from "lucide-react";

const meta: Meta<typeof Table> = {
  title: "Data Display/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "bordered", "striped"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    stickyHeader: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

// Sample data for entries
const entriesData = [
  {
    id: 1,
    entryNumber: "127",
    participant: "Emma Johnson",
    age: 9,
    ageCategory: "Ages 8-11",
    status: "Scored",
    averageScore: 8.7,
  },
  {
    id: 2,
    entryNumber: "128",
    participant: "Noah Williams",
    age: 6,
    ageCategory: "Ages 3-7",
    status: "Pending",
    averageScore: null,
  },
  {
    id: 3,
    entryNumber: "129",
    participant: "Olivia Brown",
    age: 14,
    ageCategory: "Ages 12+",
    status: "Scored",
    averageScore: 7.4,
  },
  {
    id: 4,
    entryNumber: "130",
    participant: "Liam Davis",
    age: 10,
    ageCategory: "Ages 8-11",
    status: "In Review",
    averageScore: null,
  },
  {
    id: 5,
    entryNumber: "131",
    participant: "Ava Miller",
    age: 5,
    ageCategory: "Ages 3-7",
    status: "Scored",
    averageScore: 9.2,
  },
];

// Sample data for judges
const judgesData = [
  {
    id: 1,
    name: "Sarah Connor",
    email: "sarah.connor@example.com",
    status: "Active",
    entriesJudged: 24,
    totalEntries: 30,
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@example.com",
    status: "Active",
    entriesJudged: 18,
    totalEntries: 30,
  },
  {
    id: 3,
    name: "Emily Parker",
    email: "emily.parker@example.com",
    status: "Pending",
    entriesJudged: 0,
    totalEntries: 30,
  },
];

// Basic table
export const Default: Story = {
  render: () => (
    <Table className="w-full max-w-3xl">
      <TableCaption>List of contest entries</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Entry #</TableHead>
          <TableHead>Participant</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Age Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entriesData.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{entry.entryNumber}</TableCell>
            <TableCell>{entry.participant}</TableCell>
            <TableCell>{entry.age}</TableCell>
            <TableCell>{entry.ageCategory}</TableCell>
            <TableCell>
              <StatusBadge status={entry.status} />
            </TableCell>
            <TableCell>
              {entry.averageScore !== null ? entry.averageScore : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Average Score</TableCell>
          <TableCell>8.4</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

// Bordered variant
export const Bordered: Story = {
  render: () => (
    <Table variant="bordered" className="w-full max-w-3xl">
      <TableHeader>
        <TableRow>
          <TableHead>Entry #</TableHead>
          <TableHead>Participant</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Age Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entriesData.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{entry.entryNumber}</TableCell>
            <TableCell>{entry.participant}</TableCell>
            <TableCell>{entry.age}</TableCell>
            <TableCell>{entry.ageCategory}</TableCell>
            <TableCell>
              <StatusBadge status={entry.status} />
            </TableCell>
            <TableCell>
              {entry.averageScore !== null ? entry.averageScore : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// Striped variant
export const Striped: Story = {
  render: () => (
    <Table variant="striped" className="w-full max-w-3xl">
      <TableHeader>
        <TableRow>
          <TableHead>Entry #</TableHead>
          <TableHead>Participant</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Age Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entriesData.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{entry.entryNumber}</TableCell>
            <TableCell>{entry.participant}</TableCell>
            <TableCell>{entry.age}</TableCell>
            <TableCell>{entry.ageCategory}</TableCell>
            <TableCell>
              <StatusBadge status={entry.status} />
            </TableCell>
            <TableCell>
              {entry.averageScore !== null ? entry.averageScore : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// Compact size
export const Small: Story = {
  render: () => (
    <Table variant="bordered" size="sm" className="w-full max-w-3xl">
      <TableHeader>
        <TableRow>
          <TableHead>Entry #</TableHead>
          <TableHead>Participant</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Age Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entriesData.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{entry.entryNumber}</TableCell>
            <TableCell>{entry.participant}</TableCell>
            <TableCell>{entry.age}</TableCell>
            <TableCell>{entry.ageCategory}</TableCell>
            <TableCell>
              <StatusBadge status={entry.status} size="sm" />
            </TableCell>
            <TableCell>
              {entry.averageScore !== null ? entry.averageScore : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// Large size
export const Large: Story = {
  render: () => (
    <Table variant="bordered" size="lg" className="w-full max-w-3xl">
      <TableHeader>
        <TableRow>
          <TableHead>Entry #</TableHead>
          <TableHead>Participant</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Age Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entriesData.slice(0, 3).map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{entry.entryNumber}</TableCell>
            <TableCell>{entry.participant}</TableCell>
            <TableCell>{entry.age}</TableCell>
            <TableCell>{entry.ageCategory}</TableCell>
            <TableCell>
              <StatusBadge status={entry.status} size="lg" />
            </TableCell>
            <TableCell>
              {entry.averageScore !== null ? entry.averageScore : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// With sorting
export const WithSorting: Story = {
  render: function Render() {
    const [data, setData] = useState(entriesData);
    const [sortConfig, setSortConfig] = useState({
      key: "entryNumber",
      direction: "asc" as "asc" | "desc" | null,
    });

    const handleSort = (key: string) => {
      let direction: "asc" | "desc" | null = "asc";

      if (sortConfig.key === key) {
        if (sortConfig.direction === "asc") {
          direction = "desc";
        } else if (sortConfig.direction === "desc") {
          direction = null;
        } else {
          direction = "asc";
        }
      }

      setSortConfig({ key, direction });

      if (direction === null) {
        // Reset to original order
        setData([...entriesData]);
        return;
      }

      // Sort data
      const sortedData = [...data].sort((a: any, b: any) => {
        if (a[key] === null) return 1;
        if (b[key] === null) return -1;

        if (a[key] < b[key]) {
          return direction === "asc" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      });

      setData(sortedData);
    };

    return (
      <Table variant="bordered" className="w-full max-w-3xl">
        <TableCaption>Click on column headers to sort</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead
              isSortable
              sortDirection={
                sortConfig.key === "entryNumber" ? sortConfig.direction : null
              }
              onClick={() => handleSort("entryNumber")}
            >
              Entry #
            </TableHead>
            <TableHead
              isSortable
              sortDirection={
                sortConfig.key === "participant" ? sortConfig.direction : null
              }
              onClick={() => handleSort("participant")}
            >
              Participant
            </TableHead>
            <TableHead
              isSortable
              sortDirection={
                sortConfig.key === "age" ? sortConfig.direction : null
              }
              onClick={() => handleSort("age")}
            >
              Age
            </TableHead>
            <TableHead>Age Category</TableHead>
            <TableHead
              isSortable
              sortDirection={
                sortConfig.key === "status" ? sortConfig.direction : null
              }
              onClick={() => handleSort("status")}
            >
              Status
            </TableHead>
            <TableHead
              isSortable
              sortDirection={
                sortConfig.key === "averageScore" ? sortConfig.direction : null
              }
              onClick={() => handleSort("averageScore")}
            >
              Score
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.entryNumber}</TableCell>
              <TableCell>{entry.participant}</TableCell>
              <TableCell>{entry.age}</TableCell>
              <TableCell>{entry.ageCategory}</TableCell>
              <TableCell>
                <StatusBadge status={entry.status} />
              </TableCell>
              <TableCell>
                {entry.averageScore !== null ? entry.averageScore : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

// With selection
export const WithSelection: Story = {
  render: function Render() {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const toggleRowSelection = (id: number) => {
      if (selectedRows.includes(id)) {
        setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
      } else {
        setSelectedRows([...selectedRows, id]);
      }
    };

    return (
      <div className="space-y-4 max-w-3xl">
        <div className="flex justify-between items-center">
          <div>
            {selectedRows.length > 0 && (
              <span className="text-sm">
                {selectedRows.length} entries selected
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {selectedRows.length > 0 && (
              <BaseButton
                variant="outline"
                size="sm"
                onClick={() => setSelectedRows([])}
              >
                Clear Selection
              </BaseButton>
            )}
          </div>
        </div>

        <Table variant="bordered" className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Entry #</TableHead>
              <TableHead>Participant</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Age Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entriesData.map((entry) => (
              <TableRow
                key={entry.id}
                isSelected={selectedRows.includes(entry.id)}
                isClickable
                onClick={() => toggleRowSelection(entry.id)}
              >
                <TableCell>{entry.entryNumber}</TableCell>
                <TableCell>{entry.participant}</TableCell>
                <TableCell>{entry.age}</TableCell>
                <TableCell>{entry.ageCategory}</TableCell>
                <TableCell>
                  <StatusBadge status={entry.status} />
                </TableCell>
                <TableCell>
                  {entry.averageScore !== null ? entry.averageScore : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  },
};

// With actions
export const WithActions: Story = {
  render: () => (
    <Table variant="bordered" className="w-full max-w-3xl">
      <TableHeader>
        <TableRow>
          <TableHead>Entry #</TableHead>
          <TableHead>Participant</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entriesData.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell>{entry.entryNumber}</TableCell>
            <TableCell>{entry.participant}</TableCell>
            <TableCell>{entry.age}</TableCell>
            <TableCell>
              <StatusBadge status={entry.status} />
            </TableCell>
            <TableCell>
              {entry.averageScore !== null ? entry.averageScore : "-"}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <BaseButton
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="View Entry"
                >
                  <Eye className="h-4 w-4" />
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Edit Entry"
                >
                  <Edit className="h-4 w-4" />
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-error-500"
                  title="Delete Entry"
                >
                  <Trash className="h-4 w-4" />
                </BaseButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// Judges table
export const JudgesTable: Story = {
  render: () => (
    <Table variant="bordered" className="w-full max-w-3xl">
      <TableCaption>Judges assigned to this contest</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {judgesData.map((judge) => (
          <TableRow key={judge.id}>
            <TableCell>{judge.name}</TableCell>
            <TableCell truncate>{judge.email}</TableCell>
            <TableCell>
              {judge.status === "Active" ? (
                <Badge variant="success" icon={<Check size={12} />}>
                  Active
                </Badge>
              ) : (
                <Badge variant="warning" icon={<AlertCircle size={12} />}>
                  Pending
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <div className="w-full flex items-center">
                <div className="flex-1 mr-2">
                  <div className="bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                      style={{
                        width: `${(judge.entriesJudged / judge.totalEntries) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-xs whitespace-nowrap">
                  {judge.entriesJudged}/{judge.totalEntries}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <BaseButton
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="View Judge Details"
                >
                  <Eye className="h-4 w-4" />
                </BaseButton>
                {judge.status === "Pending" && (
                  <BaseButton
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-warning-500"
                    title="Resend Invitation"
                  >
                    <AlertCircle className="h-4 w-4" />
                  </BaseButton>
                )}
                <BaseButton
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-error-500"
                  title="Remove Judge"
                >
                  <X className="h-4 w-4" />
                </BaseButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

// Empty state
export const EmptyState: Story = {
  render: () => (
    <Table variant="bordered" className="w-full max-w-3xl">
      <TableHeader>
        <TableRow>
          <TableHead>Entry #</TableHead>
          <TableHead>Participant</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Age Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmptyState colSpan={6}>
          <AlertCircle className="h-8 w-8 text-neutral-400 mb-2" />
          <h3 className="text-lg font-medium mb-1">No entries found</h3>
          <p className="text-sm text-neutral-500 max-w-xs mb-4">
            There are no entries available for this contest yet. Entries will
            appear here once they are submitted.
          </p>
          <BaseButton variant="outline">Add Entry</BaseButton>
        </TableEmptyState>
      </TableBody>
    </Table>
  ),
};

// Helper component for status badges
function StatusBadge({
  status,
  size = "default",
}: {
  status: string;
  size?: "sm" | "default" | "lg";
}) {
  switch (status) {
    case "Scored":
      return (
        <Badge
          variant="success"
          size={size}
          icon={<Check size={size === "sm" ? 10 : 12} />}
        >
          Scored
        </Badge>
      );
    case "Pending":
      return (
        <Badge
          variant="warning"
          size={size}
          icon={<AlertCircle size={size === "sm" ? 10 : 12} />}
        >
          Pending
        </Badge>
      );
    case "In Review":
      return (
        <Badge variant="info" size={size}>
          In Review
        </Badge>
      );
    default:
      return (
        <Badge variant="default" size={size}>
          {status}
        </Badge>
      );
  }
}
