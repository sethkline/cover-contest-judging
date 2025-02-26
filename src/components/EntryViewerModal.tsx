// EntryViewerModal.tsx
import { Dialog } from '@headlessui/react';
import { getSupabasePublicUrl } from '@/lib/utils/storage';

export default function EntryViewerModal({ isOpen, entry, onClose }) {
  if (!entry) return null;
  
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-3xl max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <Dialog.Title className="text-lg font-bold">
              Entry #{entry.entry_number} - {entry.participant_name}
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={getSupabasePublicUrl('contest-images', entry.front_image_path)}
                  alt={`Entry ${entry.entry_number} by ${entry.participant_name}`}
                  className="w-full rounded-lg shadow-md"
                />
                {entry.back_image_path && (
                  <img 
                    src={getSupabasePublicUrl('contest-images', entry.back_image_path)}
                    alt={`Entry ${entry.entry_number} back side`}
                    className="w-full rounded-lg shadow-md mt-4"
                  />
                )}
              </div>
              
              <div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Entry Details</h3>
                    <table className="min-w-full mt-2">
                      <tbody>
                        <tr>
                          <td className="py-1 text-sm font-medium text-gray-900">Name:</td>
                          <td className="py-1 text-sm text-gray-500">{entry.participant_name}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-sm font-medium text-gray-900">Age:</td>
                          <td className="py-1 text-sm text-gray-500">{entry.participant_age}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-sm font-medium text-gray-900">Category:</td>
                          <td className="py-1 text-sm text-gray-500">{entry.category}</td>
                        </tr>
                        {entry.artist_statement && (
                          <tr>
                            <td className="py-1 text-sm font-medium text-gray-900">Artist Statement:</td>
                            <td className="py-1 text-sm text-gray-500">{entry.artist_statement}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Scores</h3>
                    <table className="min-w-full mt-2">
                      <tbody>
                        <tr>
                          <td className="py-1 text-sm font-medium text-gray-900">Creativity:</td>
                          <td className="py-1 text-sm text-gray-500">{entry.scores.creativity}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-sm font-medium text-gray-900">Execution:</td>
                          <td className="py-1 text-sm text-gray-500">{entry.scores.execution}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-sm font-medium text-gray-900">Impact:</td>
                          <td className="py-1 text-sm text-gray-500">{entry.scores.impact}</td>
                        </tr>
                        <tr>
                          <td className="py-1 text-sm font-medium text-gray-900">Total:</td>
                          <td className="py-1 text-sm font-bold text-gray-900">{entry.scores.total}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}