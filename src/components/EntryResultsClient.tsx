// src/components/EntryResultsClient.tsx
'use client';

import { useState } from 'react';
import EntryViewerModal from './EntryViewerModal';

export default function EntryResultsClient({ entriesByCategory }) {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openEntryModal = (entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };
  
  const closeEntryModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className="space-y-8">
      {Object.keys(entriesByCategory).map((category) => (
        <div key={category} className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-xl font-bold">Age Category: {category}</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entry #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Creativity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Execution
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Impact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judges
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entriesByCategory[category].map((entry, index) => (
                  <tr key={entry.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {index === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          🥇 1st
                        </span>
                      ) : index === 1 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          🥈 2nd
                        </span>
                      ) : index === 2 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                          🥉 3rd
                        </span>
                      ) : (
                        <span className="text-gray-700">{index + 1}</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{entry.entry_number}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.participant_name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{entry.participant_age}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{entry.scores.creativity}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{entry.scores.execution}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{entry.scores.impact}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.scores.total}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{entry.judgeCount}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                      <button 
                        onClick={() => openEntryModal(entry)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      
      <EntryViewerModal 
        isOpen={isModalOpen} 
        entry={selectedEntry} 
        onClose={closeEntryModal} 
      />
    </div>
  );
}