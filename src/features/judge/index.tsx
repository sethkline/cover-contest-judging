import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@/components/ui/Tabs';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EntryList } from './components/EntryList';
import { EntryDetails } from './components/EntryDetails';
import { Card, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/progress-loading';

// Mock data for entries
const mockEntries = [
  { 
    id: 1, 
    entryNumber: '127', 
    participant: 'Emma Johnson', 
    age: 9, 
    ageCategory: 'Ages 8-11',
    frontImageUrl: '/api/placeholder/400/613',
    backImageUrl: '/api/placeholder/400/613',
    artistStatement: 'I created this cover to show how God\'s grace helps us dance through life\'s challenges.',
    status: 'Pending' as const, 
    averageScore: null 
  },
  { 
    id: 2, 
    entryNumber: '128', 
    participant: 'Noah Williams', 
    age: 6, 
    ageCategory: 'Ages 3-7',
    frontImageUrl: '/api/placeholder/400/613',
    status: 'Pending' as const, 
    averageScore: null 
  },
  { 
    id: 3, 
    entryNumber: '129', 
    participant: 'Olivia Brown', 
    age: 14, 
    ageCategory: 'Ages 12+',
    frontImageUrl: '/api/placeholder/400/613',
    artistStatement: 'My design represents how God\'s grace transforms us and our stories.',
    status: 'Scored' as const, 
    averageScore: 7.4 
  },
  { 
    id: 4, 
    entryNumber: '130', 
    participant: 'Liam Davis', 
    age: 10, 
    ageCategory: 'Ages 8-11',
    frontImageUrl: '/api/placeholder/400/613',
    backImageUrl: '/api/placeholder/400/613',
    status: 'In Review' as const, 
    averageScore: null 
  },
  { 
    id: 5, 
    entryNumber: '131', 
    participant: 'Ava Miller', 
    age: 5, 
    ageCategory: 'Ages 3-7',
    frontImageUrl: '/api/placeholder/400/613',
    status: 'Scored' as const, 
    averageScore: 9.2 
  },
];

export const JudgingFeature: React.FC = () => {
  const [activeTab, setActiveTab] = useState('entries');
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null);

  // Find the selected entry
  const selectedEntry = selectedEntryId 
    ? mockEntries.find(entry => entry.id === selectedEntryId) 
    : undefined;

  // Calculate progress
  const totalEntries = mockEntries.length;
  const scoredEntries = mockEntries.filter(entry => entry.status === 'Scored').length;
  const progressPercentage = Math.round((scoredEntries / totalEntries) * 100);

  // Handle view entry
  const handleViewEntry = (entryId: number) => {
    setSelectedEntryId(entryId);
    setActiveTab('detail');
  };

  // Handle back to entries
  const handleBackToEntries = () => {
    setSelectedEntryId(null);
    setActiveTab('entries');
  };

  // Handle navigation between entries
  const handleNextEntry = () => {
    if (!selectedEntryId) return;
    
    const currentIndex = mockEntries.findIndex(entry => entry.id === selectedEntryId);
    if (currentIndex < mockEntries.length - 1) {
      setSelectedEntryId(mockEntries[currentIndex + 1].id);
    }
  };

  const handlePreviousEntry = () => {
    if (!selectedEntryId) return;
    
    const currentIndex = mockEntries.findIndex(entry => entry.id === selectedEntryId);
    if (currentIndex > 0) {
      setSelectedEntryId(mockEntries[currentIndex - 1].id);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <Header title="Reverence Studios Judging Portal" />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-4">
            2025 Spring Recital Cover Design Contest
          </h1>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">Your Judging Progress</h3>
                  <ProgressBar 
                    value={progressPercentage} 
                    variant="success" 
                    showValue
                    formatValue={() => `${scoredEntries} of ${totalEntries} entries scored`}
                  />
                </div>
                
                <div className="flex-1 md:flex md:justify-end">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-primary-600">{scoredEntries}</div>
                      <div className="text-sm text-neutral-500">Scored</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-primary-600">{totalEntries - scoredEntries}</div>
                      <div className="text-sm text-neutral-500">Remaining</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="entries">All Entries</Tab>
            {selectedEntryId && (
              <Tab value="detail">Entry #{selectedEntry?.entryNumber}</Tab>
            )}
          </TabList>
          
          <TabPanels>
            <TabPanel value="entries">
              <div className="mt-6">
                <EntryList 
                  entries={mockEntries} 
                  onViewEntry={handleViewEntry}
                />
              </div>
            </TabPanel>
            
            <TabPanel value="detail">
              <div className="mt-6">
                <EntryDetails 
                  entry={selectedEntry}
                  onBack={handleBackToEntries}
                  onNext={handleNextEntry}
                  onPrevious={handlePreviousEntry}
                />
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        <Footer />
      </div>
    </main>
  );
};