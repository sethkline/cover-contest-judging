import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { BaseButton } from '@/components/ui/BaseButton';
import { Eye } from 'lucide-react';

interface Entry {
  id: number;
  entryNumber: string;
  participant: string;
  age: number;
  ageCategory: string;
  status: 'Pending' | 'In Review' | 'Scored';
  averageScore: number | null;
}

interface EntryListProps {
  entries?: Entry[];
  onViewEntry?: (entryId: number) => void;
}

export const EntryList: React.FC<EntryListProps> = ({
  entries = [],
  onViewEntry
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter entries by category if a category is selected
  const filteredEntries = selectedCategory
    ? entries.filter(entry => entry.ageCategory === selectedCategory)
    : entries;

  // Get unique age categories
  const ageCategories = Array.from(new Set(entries.map(entry => entry.ageCategory)));

  return (
    <div className="space-y-4">
      {/* Category filter */}
      {ageCategories.length > 0 && (
        <div className="flex gap-2 mb-4">
          <BaseButton
            size="sm"
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </BaseButton>
          
          {ageCategories.map(category => (
            <BaseButton
              key={category}
              size="sm"
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </BaseButton>
          ))}
        </div>
      )}
      
      {/* Entries table */}
      <Table variant="bordered">
        <TableHeader>
          <TableRow>
            <TableHead>Entry #</TableHead>
            <TableHead>Participant</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.entryNumber}</TableCell>
              <TableCell>{entry.participant}</TableCell>
              <TableCell>{entry.age}</TableCell>
              <TableCell>{entry.ageCategory}</TableCell>
              <TableCell>
                <StatusBadge status={entry.status} />
              </TableCell>
              <TableCell>
                {entry.averageScore !== null ? entry.averageScore : '-'}
              </TableCell>
              <TableCell>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="View Entry"
                  onClick={() => onViewEntry && onViewEntry(entry.id)}
                >
                  <Eye className="h-4 w-4" />
                </BaseButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper component for status badges
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
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
};