// src/stories/Modal.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal, ModalTitle, ModalDescription, ModalFooter } from '../components/ui/Modal';
import { BaseButton } from '../components/ui/BaseButton';
import { FormField } from '../components/ui/FormField';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { Select } from '../components/ui/Select';
import { AlertCircle } from 'lucide-react';

const meta: Meta<typeof Modal> = {
  title: 'Feedback/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    closeOnOutsideClick: {
      control: 'boolean',
    },
    hideCloseButton: {
      control: 'boolean',
    },
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

// Basic Modal template
export const Basic: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <BaseButton onClick={() => setIsOpen(true)}>Open Modal</BaseButton>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Basic Modal"
          description="This is a simple modal dialog."
        >
          <p className="text-neutral-700 dark:text-neutral-300">
            This is the content of the modal. You can put any React component here.
          </p>
        </Modal>
      </>
    );
  }
};

// Confirmation Dialog
export const ConfirmationDialog: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    
    const handleConfirm = () => {
      setResult('You confirmed the action!');
      setIsOpen(false);
    };
    
    const handleCancel = () => {
      setResult('You cancelled the action.');
      setIsOpen(false);
    };
    
    return (
      <div className="space-y-4">
        <BaseButton onClick={() => setIsOpen(true)} variant="destructive">Delete Entry</BaseButton>
        
        {result && (
          <div className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded">
            Result: {result}
          </div>
        )}
        
        <Modal
          isOpen={isOpen}
          onClose={handleCancel}
          title="Confirm Deletion"
          size="sm"
          footerContent={
            <ModalFooter>
              <BaseButton variant="outline" onClick={handleCancel}>Cancel</BaseButton>
              <BaseButton variant="destructive" onClick={handleConfirm}>Delete</BaseButton>
            </ModalFooter>
          }
        >
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-error-500 mr-3 flex-shrink-0" />
            <div>
              <ModalDescription>
                Are you sure you want to delete this entry? This action cannot be undone.
              </ModalDescription>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
};

// Form Modal
export const FormModal: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    
    const ageOptions = [
      { value: '3-7', label: 'Ages 3-7' },
      { value: '8-11', label: 'Ages 8-11' },
      { value: '12+', label: 'Ages 12+' },
    ];
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsOpen(false);
      // Form submission logic would go here
    };
    
    return (
      <>
        <BaseButton onClick={() => setIsOpen(true)}>Add New Entry</BaseButton>
        
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Add New Contest Entry"
          size="lg"
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormField label="Participant Name" required>
                <Input placeholder="Enter participant name" />
              </FormField>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Age" required>
                  <Input type="number" placeholder="Enter age" min={3} max={18} />
                </FormField>
                
                <FormField label="Age Category" required>
                  <Select options={ageOptions} defaultValue="8-11" />
                </FormField>
              </div>
              
              <FormField label="Artist Statement" helpText="Optional - describe the inspiration behind the artwork">
                <TextArea placeholder="Enter artist statement" />
              </FormField>
              
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-end space-x-2">
                <BaseButton type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</BaseButton>
                <BaseButton type="submit">Submit Entry</BaseButton>
              </div>
            </div>
          </form>
        </Modal>
      </>
    );
  }
};

// Image Viewer Modal
export const ImageViewerModal: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
          <img 
            src="/api/placeholder/200/300" 
            alt="Thumbnail" 
            className="rounded-md hover:opacity-90 transition-opacity"
            width={200}
            height={300}
          />
          <div className="mt-2 text-sm text-center">Click to enlarge</div>
        </div>
        
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          size="lg"
          contentClassName="p-0"
        >
          <div className="relative">
            <img 
              src="/api/placeholder/800/1200" 
              alt="Contest Entry" 
              className="w-full h-auto"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4 text-white">
              <h3 className="text-lg font-semibold">Entry #127</h3>
              <p className="text-sm">Age Category: 8-11 years</p>
            </div>
          </div>
        </Modal>
      </>
    );
  }
};

// Multi-Step Modal
export const MultiStepModal: Story = {
  render: function Render() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);
    
    const handleNextStep = () => {
      setStep(step + 1);
    };
    
    const handlePrevStep = () => {
      setStep(step - 1);
    };
    
    const handleClose = () => {
      setIsOpen(false);
      // Reset step on close
      setTimeout(() => setStep(1), 300);
    };
    
    return (
      <>
        <BaseButton onClick={() => setIsOpen(true)}>Start Judging</BaseButton>
        
        <Modal
          isOpen={isOpen}
          onClose={handleClose}
          title={`Judging Guidelines - Step ${step} of 3`}
          size="lg"
          footerContent={
            <ModalFooter>
              {step > 1 && (
                <BaseButton variant="outline" onClick={handlePrevStep}>
                  Back
                </BaseButton>
              )}
              {step < 3 ? (
                <BaseButton onClick={handleNextStep}>
                  Next
                </BaseButton>
              ) : (
                <BaseButton onClick={handleClose}>
                  Start Judging
                </BaseButton>
              )}
            </ModalFooter>
          }
        >
          {step === 1 && (
            <div>
              <ModalTitle>Scoring Criteria</ModalTitle>
              <ModalDescription>
                Please use the following criteria when judging entries:
              </ModalDescription>
              
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium">Creativity (0-10)</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Originality, imagination, and unique approach to the theme.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Execution (0-10)</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Technical skill, craftsmanship, and quality of the work.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Impact (0-10)</h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Overall impression, emotional impact, and effectiveness in conveying the message.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div>
              <ModalTitle>Judging Process</ModalTitle>
              <ModalDescription>
                Follow these steps for each entry:
              </ModalDescription>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm">1. Review both front and back of the entry using the toggle button</p>
                <p className="text-sm">2. Read the artist statement (if provided)</p>
                <p className="text-sm">3. Score each category from 0-10</p>
                <p className="text-sm">4. Submit your scores</p>
                <p className="text-sm">5. Move to the next entry</p>
              </div>
              
              <div className="mt-4 p-3 bg-info-50 dark:bg-info-900/20 text-info-800 dark:text-info-300 rounded-md">
                <p className="text-sm font-medium">Tip: Use the left and right arrow keys to navigate between entries.</p>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div>
              <ModalTitle>Important Notes</ModalTitle>
              <ModalDescription>
                Before you begin judging, please keep in mind:
              </ModalDescription>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm">• Judge each entry on its own merit</p>
                <p className="text-sm">• Consider the age category of the participant</p>
                <p className="text-sm">• Take breaks if needed - your progress is saved automatically</p>
                <p className="text-sm">• Complete all assigned entries by the deadline</p>
                <p className="text-sm">• Contact the admin if you have any questions</p>
              </div>
              
              <div className="mt-4 p-3 bg-success-50 dark:bg-success-900/20 text-success-800 dark:text-success-300 rounded-md">
                <p className="text-sm font-medium">You are assigned 25 entries. Thank you for volunteering as a judge!</p>
              </div>
            </div>
          )}
        </Modal>
      </>
    );
  }
};

// Different Sizes
export const Sizes: Story = {
  render: function Render() {
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <BaseButton size="sm" onClick={() => { setSize('sm'); setIsOpen(true); }}>Small</BaseButton>
          <BaseButton size="sm" onClick={() => { setSize('md'); setIsOpen(true); }}>Medium</BaseButton>
          <BaseButton size="sm" onClick={() => { setSize('lg'); setIsOpen(true); }}>Large</BaseButton>
          <BaseButton size="sm" onClick={() => { setSize('xl'); setIsOpen(true); }}>X-Large</BaseButton>
          <BaseButton size="sm" onClick={() => { setSize('full'); setIsOpen(true); }}>Full</BaseButton>
        </div>
        
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={`${size.toUpperCase()} Modal`}
          size={size}
        >
          <div className="space-y-4">
            <p>This is a {size} size modal.</p>
            <div className="h-40 bg-neutral-100 dark:bg-neutral-800 rounded-md flex items-center justify-center">
              Content area
            </div>
          </div>
        </Modal>
      </div>
    );
  }
};