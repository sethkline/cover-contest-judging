import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "../components/ui/Tabs";
import { Card, CardContent } from "../components/ui/Card";
import { Award, Users, FileText, Settings, BarChart } from "lucide-react";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
    variant: {
      control: "select",
      options: ["default", "underline", "pills", "bordered"],
    },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <div className="w-[600px]">
      <Tabs defaultValue="overview">
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="entries">Entries</Tab>
          <Tab value="judges">Judges</Tab>
          <Tab value="settings">Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="overview">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Overview</h3>
                <p>
                  This is the overview tab for the contest. Here you can see
                  general information and statistics.
                </p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="entries">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Entries</h3>
                <p>View and manage all entries submitted to this contest.</p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="judges">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Judges</h3>
                <p>
                  Manage judges assigned to this contest and track their
                  progress.
                </p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="settings">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Settings</h3>
                <p>Configure contest details, deadlines, and categories.</p>
              </CardContent>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  ),
};

export const Underline: Story = {
  render: () => (
    <div className="w-[600px]">
      <Tabs defaultValue="overview" variant="underline">
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="entries">Entries</Tab>
          <Tab value="judges">Judges</Tab>
          <Tab value="settings">Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="overview">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Overview</h3>
                <p>This is the overview tab with underline style.</p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="entries">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Entries</h3>
                <p>View and manage all entries submitted to this contest.</p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="judges">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Judges</h3>
                <p>
                  Manage judges assigned to this contest and track their
                  progress.
                </p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="settings">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Settings</h3>
                <p>Configure contest details, deadlines, and categories.</p>
              </CardContent>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  ),
};

export const Pills: Story = {
  render: () => (
    <div className="w-[600px]">
      <Tabs defaultValue="overview" variant="pills">
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="entries">Entries</Tab>
          <Tab value="judges">Judges</Tab>
          <Tab value="settings">Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="overview">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Overview</h3>
                <p>This is the overview tab with pills style.</p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="entries">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Entries</h3>
                <p>View and manage all entries submitted to this contest.</p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="judges">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Judges</h3>
                <p>
                  Manage judges assigned to this contest and track their
                  progress.
                </p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="settings">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Settings</h3>
                <p>Configure contest details, deadlines, and categories.</p>
              </CardContent>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  ),
};

export const Bordered: Story = {
  render: () => (
    <div className="w-[600px]">
      <Tabs defaultValue="overview" variant="bordered">
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="entries">Entries</Tab>
          <Tab value="judges">Judges</Tab>
          <Tab value="settings">Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="overview">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Overview</h3>
                <p>This is the overview tab with bordered style.</p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="entries">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Entries</h3>
                <p>View and manage all entries submitted to this contest.</p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="judges">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Judges</h3>
                <p>
                  Manage judges assigned to this contest and track their
                  progress.
                </p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="settings">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Settings</h3>
                <p>Configure contest details, deadlines, and categories.</p>
              </CardContent>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="w-[600px]">
      <Tabs defaultValue="overview" orientation="vertical">
        <TabList className="w-48">
          <Tab value="overview">Overview</Tab>
          <Tab value="entries">Entries</Tab>
          <Tab value="judges">Judges</Tab>
          <Tab value="settings">Settings</Tab>
        </TabList>
        <TabPanels className="flex-1">
          <TabPanel value="overview">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Overview</h3>
                <p>This is the overview tab with vertical orientation.</p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="entries">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Entries</h3>
                <p>View and manage all entries submitted to this contest.</p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="judges">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Judges</h3>
                <p>
                  Manage judges assigned to this contest and track their
                  progress.
                </p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="settings">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Settings</h3>
                <p>Configure contest details, deadlines, and categories.</p>
              </CardContent>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="w-[600px]">
      <Tabs defaultValue="overview" variant="pills">
        <TabList>
          <Tab value="overview" icon={<BarChart size={16} />}>
            Overview
          </Tab>
          <Tab value="entries" icon={<FileText size={16} />}>
            Entries
          </Tab>
          <Tab value="judges" icon={<Users size={16} />}>
            Judges
          </Tab>
          <Tab value="settings" icon={<Settings size={16} />}>
            Settings
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="overview">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Overview</h3>
                <p>This is the overview tab with icon.</p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="entries">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Entries</h3>
                <p>View and manage all entries submitted to this contest.</p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="judges">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Judges</h3>
                <p>
                  Manage judges assigned to this contest and track their
                  progress.
                </p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="settings">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Settings</h3>
                <p>Configure contest details, deadlines, and categories.</p>
              </CardContent>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  ),
};

export const DisabledTab: Story = {
  render: () => (
    <div className="w-[600px]">
      <Tabs defaultValue="overview">
        <TabList>
          <Tab value="overview">Overview</Tab>
          <Tab value="entries">Entries</Tab>
          <Tab value="judges">Judges</Tab>
          <Tab value="settings" disabled>
            Settings
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="overview">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Overview</h3>
                <p>
                  Notice that the Settings tab is disabled and cannot be
                  selected.
                </p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="entries">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Entries</h3>
                <p>View and manage all entries submitted to this contest.</p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="judges">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Judges</h3>
                <p>
                  Manage judges assigned to this contest and track their
                  progress.
                </p>
              </CardContent>
            </Card>
          </TabPanel>
          <TabPanel value="settings">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Contest Settings</h3>
                <p>Configure contest details, deadlines, and categories.</p>
              </CardContent>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  ),
};

export const ContestDashboard: Story = {
  render: () => (
    <div className="w-[800px] p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Cover Contest Dashboard</h2>

      <Tabs defaultValue="overview" variant="underline">
        <TabList>
          <Tab value="overview" icon={<BarChart size={16} />}>
            Overview
          </Tab>
          <Tab value="entries" icon={<FileText size={16} />}>
            Entries
          </Tab>
          <Tab value="judges" icon={<Users size={16} />}>
            Judges
          </Tab>
          <Tab value="settings" icon={<Settings size={16} />}>
            Settings
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="font-medium text-sm text-neutral-500 mb-1">
                    Total Entries
                  </div>
                  <div className="text-2xl font-bold">147</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="font-medium text-sm text-neutral-500 mb-1">
                    Judges
                  </div>
                  <div className="text-2xl font-bold">8</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="font-medium text-sm text-neutral-500 mb-1">
                    Scoring Progress
                  </div>
                  <div className="text-2xl font-bold">64%</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Entries by Age Category</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Ages 3-7</span>
                        <span className="font-medium">42</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: "28%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Ages 8-11</span>
                        <span className="font-medium">65</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: "44%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Ages 12+</span>
                        <span className="font-medium">40</span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: "27%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="w-2 h-2 mt-2 rounded-full bg-success-500 mr-2"></div>
                      <div>
                        <div className="text-sm">New entry submitted</div>
                        <div className="text-xs text-neutral-500">
                          10 minutes ago
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-2 h-2 mt-2 rounded-full bg-info-500 mr-2"></div>
                      <div>
                        <div className="text-sm">Judge completed scoring</div>
                        <div className="text-xs text-neutral-500">
                          1 hour ago
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-2 h-2 mt-2 rounded-full bg-warning-500 mr-2"></div>
                      <div>
                        <div className="text-sm">Judge invitation sent</div>
                        <div className="text-xs text-neutral-500">
                          3 hours ago
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabPanel>

          <TabPanel value="entries">
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Contest Entries</h3>
                <p>
                  This tab would contain a table or grid of all entries with
                  filtering and sorting options.
                </p>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value="judges">
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Judges Management</h3>
                <p>
                  This tab would contain a list of judges, their progress, and
                  options to manage judge assignments.
                </p>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value="settings">
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-medium mb-4">Contest Settings</h3>
                <p>
                  This tab would contain forms for configuring contest
                  parameters, dates, and scoring criteria.
                </p>
              </CardContent>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  ),
};
