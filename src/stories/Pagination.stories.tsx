import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from '../components/ui/Pagination';
import { Card, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
    },
    totalPages: {
      control: { type: 'number', min: 1 },
    },
    siblingCount: {
      control: { type: 'number', min: 0, max: 3 },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'minimal', 'compact'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

// Helper function to generate mock entry data
const generateMockEntries = (count: number, startIndex = 0) => {
  return Array.from({ length: count }, (_, i) => ({
    id: startIndex + i + 1,
    entryNumber: `${100 + startIndex + i}`,
    participant: `Participant ${startIndex + i + 1}`,
    ageCategory: i % 3 === 0 ? 'Ages 3-7' : i % 3 === 1 ? 'Ages 8-11' : 'Ages 12+',
    status: i % 4 === 0 ? 'Pending' : i % 4 === 1 ? 'In Review' : 'Scored',
  }));
};

export const Default: Story = {
  render: function Render() {
    const [page, setPage] = useState(1);
    const totalPages = 10;
    
    return (
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="w-full max-w-lg"
      />
    );
  },
};

export const Minimal: Story = {
  render: function Render() {
    const [page, setPage] = useState(1);
    const totalPages = 10;
    
    return (
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        variant="minimal"
        className="w-full max-w-lg"
      />
    );
  },
};

export const Compact: Story = {
  render: function Render() {
    const [page, setPage] = useState(1);
    const totalPages = 10;
    
    return (
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        variant="compact"
        className="w-full max-w-lg"
      />
    );
  },
};

export const Small: Story = {
  render: function Render() {
    const [page, setPage] = useState(1);
    const totalPages = 10;
    
    return (
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        size="sm"
        className="w-full max-w-lg"
      />
    );
  },
};

export const Large: Story = {
  render: function Render() {
    const [page, setPage] = useState(1);
    const totalPages = 10;
    
    return (
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        size="lg"
        className="w-full max-w-lg"
      />
    );
  },
};

export const ManyPages: Story = {
  render: function Render() {
    const [page, setPage] = useState(1);
    const totalPages = 50;
    
    return (
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="w-full max-w-lg"
      />
    );
  },
};

export const FewPages: Story = {
  render: function Render() {
    const [page, setPage] = useState(1);
    const totalPages = 3;
    
    return (
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="w-full max-w-lg"
      />
    );
  },
};

export const WithSiblings: Story = {
  render: function Render() {
    const [page, setPage] = useState(5);
    const totalPages = 20;
    
    return (
      <div className="space-y-6 w-full max-w-lg">
        <div>
          <h3 className="text-sm font-medium mb-2">With 0 siblings:</h3>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            siblingCount={0}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">With 1 sibling (default):</h3>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            siblingCount={1}
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">With 2 siblings:</h3>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            siblingCount={2}
          />
        </div>
      </div>
    );
  },
};

export const WithTable: Story = {
  render: function Render() {
    const [page, setPage] = useState(1);
    const totalPages = 10;
    const itemsPerPage = 5;
    
    // Generate entries for current page
    const entries = generateMockEntries(itemsPerPage, (page - 1) * itemsPerPage);
    
    return (
      <Card className="w-full max-w-3xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Contest Entries</h2>
          
          <Table variant="bordered" className="mb-4">
            <TableHeader>
              <TableRow>
                <TableHead>Entry #</TableHead>
                <TableHead>Participant</TableHead>
                <TableHead>Age Category</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} isClickable>
                  <TableCell>{entry.entryNumber}</TableCell>
                  <TableCell>{entry.participant}</TableCell>
                  <TableCell>{entry.ageCategory}</TableCell>
                  <TableCell>
                    <StatusBadge status={entry.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    );
  },
};

export const WithVariants: Story = {
  render: function Render() {
    const [page, setPage] = useState(1);
    const totalPages = 10;
    
    return (
      <div className="space-y-8 w-full max-w-2xl">
        <div>
          <h3 className="text-sm font-medium mb-2">Default:</h3>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            variant="default"
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Minimal:</h3>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            variant="minimal"
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Compact:</h3>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            variant="compact"
          />
        </div>
      </div>
    );
  },
};

// Helper component for status badges
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'Scored':
      return <Badge variant="success">Scored</Badge>;
    case 'Pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'In Review':
      return <Badge variant="info">In Review</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}