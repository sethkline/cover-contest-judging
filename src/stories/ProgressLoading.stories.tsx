// src/stories/ProgressLoading.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import {
  ProgressBar,
  Spinner,
  LoadingDots,
  LoadingOverlay,
} from "../components/ui/progress-loading";
import { BaseButton } from "../components/ui/BaseButton";
import { Card, CardTitle, CardContent } from "../components/ui/Card";
import "../styles/progress-animations.css";

// ProgressBar Meta
const progressBarMeta: Meta<typeof ProgressBar> = {
  title: "Feedback/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 100 },
    },
    max: {
      control: { type: "number", min: 1, max: 100 },
    },
    showValue: {
      control: "boolean",
    },
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error", "info"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
    },
    striped: {
      control: "boolean",
    },
    animated: {
      control: "boolean",
    },
    indeterminate: {
      control: "boolean",
    },
  },
};

export default progressBarMeta;
type ProgressBarStory = StoryObj<typeof ProgressBar>;

// Spinner Meta
export const spinnerMeta: Meta<typeof Spinner> = {
  title: "Feedback/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "xl"],
    },
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error", "info"],
    },
    label: {
      control: "text",
    },
  },
};

type SpinnerStory = StoryObj<typeof Spinner>;

// ProgressBar Stories
export const BasicProgressBar: ProgressBarStory = {
  args: {
    value: 60,
    showValue: true,
    className: "w-80",
  },
};

export const ProgressBarVariants: ProgressBarStory = {
  render: () => (
    <div className="w-80 space-y-4">
      <ProgressBar value={80} variant="default" showValue />
      <ProgressBar value={80} variant="success" showValue />
      <ProgressBar value={80} variant="warning" showValue />
      <ProgressBar value={80} variant="error" showValue />
      <ProgressBar value={80} variant="info" showValue />
    </div>
  ),
};

export const ProgressBarSizes: ProgressBarStory = {
  render: () => (
    <div className="w-80 space-y-4">
      <ProgressBar value={70} size="sm" />
      <ProgressBar value={70} size="default" />
      <ProgressBar value={70} size="lg" />
    </div>
  ),
};

export const StripedProgressBar: ProgressBarStory = {
  args: {
    value: 50,
    striped: true,
    className: "w-80",
  },
};

export const AnimatedProgressBar: ProgressBarStory = {
  args: {
    value: 75,
    striped: true,
    animated: true,
    className: "w-80",
  },
};

export const IndeterminateProgressBar: ProgressBarStory = {
  args: {
    value: 0,
    indeterminate: true,
    className: "w-80",
  },
};

export const CustomFormattedValue: ProgressBarStory = {
  args: {
    value: 3,
    max: 10,
    showValue: true,
    formatValue: (value, max) => `${value} of ${max} completed`,
    className: "w-80",
  },
};

export const InteractiveProgressBar: ProgressBarStory = {
  render: function Render() {
    const [progress, setProgress] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Reset progress
    const resetProgress = () => {
      setProgress(0);
      setIsRunning(false);
    };

    // Start or continue progress
    const startProgress = () => {
      if (progress >= 100) {
        resetProgress();
      }
      setIsRunning(true);
    };

    // Pause progress
    const pauseProgress = () => {
      setIsRunning(false);
    };

    // Increment progress every 200ms if running
    useEffect(() => {
      let timer: ReturnType<typeof setTimeout>;

      if (isRunning && progress < 100) {
        timer = setTimeout(() => {
          setProgress((prev) => {
            const next = prev + 1;
            if (next >= 100) {
              setIsRunning(false);
            }
            return next;
          });
        }, 100);
      }

      return () => {
        if (timer) clearTimeout(timer);
      };
    }, [isRunning, progress]);

    // Determine variant based on progress
    const getVariant = () => {
      if (progress < 30) return "error";
      if (progress < 70) return "warning";
      return "success";
    };

    return (
      <div className="w-80 space-y-4">
        <ProgressBar
          value={progress}
          showValue
          variant={getVariant()}
          striped
          animated={isRunning}
        />

        <div className="flex space-x-2">
          {!isRunning ? (
            <BaseButton onClick={startProgress} disabled={isRunning} size="sm">
              {progress > 0 ? "Continue" : "Start"}
            </BaseButton>
          ) : (
            <BaseButton onClick={pauseProgress} variant="warning" size="sm">
              Pause
            </BaseButton>
          )}

          <BaseButton onClick={resetProgress} variant="outline" size="sm">
            Reset
          </BaseButton>
        </div>
      </div>
    );
  },
};

export const UploadProgress: ProgressBarStory = {
  render: function Render() {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<
      "idle" | "uploading" | "success" | "error"
    >("idle");

    const startUpload = () => {
      setStatus("uploading");
      setProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus("success");
            return 100;
          }
          return prev + 5;
        });
      }, 300);
    };

    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Upload Contest Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "uploading" && (
            <ProgressBar
              value={progress}
              showValue
              variant="info"
              striped
              animated
              formatValue={(value) => `${Math.round(value)}% uploaded`}
            />
          )}

          {status === "success" && (
            <ProgressBar
              value={100}
              showValue
              variant="success"
              formatValue={() => "Upload complete!"}
            />
          )}

          {status === "error" && (
            <ProgressBar
              value={progress}
              showValue
              variant="error"
              formatValue={() => "Upload failed!"}
            />
          )}

          <div className="flex justify-between">
            <BaseButton
              onClick={startUpload}
              disabled={status === "uploading"}
              size="sm"
            >
              {status === "idle" ? "Upload File" : "Upload Again"}
            </BaseButton>

            {status === "uploading" && (
              <BaseButton
                onClick={() => setStatus("error")}
                variant="error"
                size="sm"
              >
                Cancel
              </BaseButton>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
};

// Spinner Stories
export const BasicSpinner: SpinnerStory = {
  args: {
    size: "default",
    variant: "default",
    label: "Loading",
  },
};

export const SpinnerSizes: SpinnerStory = {
  render: () => (
    <div className="flex flex-col space-y-4 items-start">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="default" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

export const SpinnerVariants: SpinnerStory = {
  render: () => (
    <div className="flex space-x-4">
      <Spinner variant="default" />
      <Spinner variant="success" />
      <Spinner variant="warning" />
      <Spinner variant="error" />
      <Spinner variant="info" />
    </div>
  ),
};

export const SpinnerWithLabel: SpinnerStory = {
  render: () => (
    <div className="space-y-4">
      <Spinner label="Loading..." />
      <Spinner label="Processing..." variant="info" />
      <Spinner label="Please wait" variant="warning" />
      <Spinner label="Almost done" variant="success" />
    </div>
  ),
};

// LoadingDots Stories
export const BasicLoadingDots: StoryObj<typeof LoadingDots> = {
  render: () => <LoadingDots />,
};

export const LoadingDotsSizes: StoryObj<typeof LoadingDots> = {
  render: () => (
    <div className="flex flex-col space-y-4 items-start">
      <LoadingDots size="sm" />
      <LoadingDots size="default" />
      <LoadingDots size="lg" />
    </div>
  ),
};

export const LoadingDotsVariants: StoryObj<typeof LoadingDots> = {
  render: () => (
    <div className="flex space-x-8">
      <LoadingDots variant="default" />
      <LoadingDots variant="success" />
      <LoadingDots variant="warning" />
      <LoadingDots variant="error" />
      <LoadingDots variant="info" />
    </div>
  ),
};

// LoadingOverlay Stories
export const BasicLoadingOverlay: StoryObj<typeof LoadingOverlay> = {
  render: function Render() {
    const [loading, setLoading] = useState(false);

    const toggleLoading = () => {
      setLoading(true);

      // Auto-hide after 3 seconds
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    };

    return (
      <div className="space-y-4">
        <BaseButton onClick={toggleLoading} disabled={loading}>
          {loading ? "Loading..." : "Show Loading Overlay"}
        </BaseButton>

        <LoadingOverlay active={loading} text="Loading content...">
          <Card className="w-80 h-64">
            <CardHeader>
              <CardTitle>Content Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This card will be covered by a loading overlay when active.</p>
              <p className="mt-2">Try clicking the button above.</p>
            </CardContent>
          </Card>
        </LoadingOverlay>
      </div>
    );
  },
};

export const LoadingOverlayVariants: StoryObj<typeof LoadingOverlay> = {
  render: function Render() {
    const [loading, setLoading] = useState(true);

    return (
      <div className="space-y-4">
        <div className="flex space-x-2 mb-4">
          <BaseButton
            onClick={() => setLoading(!loading)}
            variant={loading ? "error" : "success"}
          >
            {loading ? "Hide Overlay" : "Show Overlay"}
          </BaseButton>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <LoadingOverlay active={loading} text="With default spinner">
            <Card className="h-36 w-48">
              <CardContent className="p-4">
                <p>Default spinner overlay</p>
              </CardContent>
            </Card>
          </LoadingOverlay>

          <LoadingOverlay
            active={loading}
            spinner={<Spinner variant="success" size="lg" />}
            text="Success variant"
          >
            <Card className="h-36 w-48">
              <CardContent className="p-4">
                <p>Success spinner overlay</p>
              </CardContent>
            </Card>
          </LoadingOverlay>

          <LoadingOverlay
            active={loading}
            spinner={<LoadingDots variant="info" size="lg" />}
            text="With loading dots"
          >
            <Card className="h-36 w-48">
              <CardContent className="p-4">
                <p>Loading dots overlay</p>
              </CardContent>
            </Card>
          </LoadingOverlay>

          <LoadingOverlay
            active={loading}
            spinner={<Spinner variant="warning" size="lg" />}
            text="No blur effect"
            blur={false}
          >
            <Card className="h-36 w-48">
              <CardContent className="p-4">
                <p>No blur effect overlay</p>
              </CardContent>
            </Card>
          </LoadingOverlay>
        </div>
      </div>
    );
  },
};

// Combined Progress & Loading Examples
export const ContestJudgingUseCases: StoryObj<typeof ProgressBar> = {
  render: function Render() {
    const [pageLoading, setPageLoading] = useState(true);

    // Simulate page load
    useEffect(() => {
      const timer = setTimeout(() => {
        setPageLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="w-full max-w-3xl">
        <LoadingOverlay active={pageLoading} text="Loading dashboard...">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Judging Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm">68%</span>
                </div>
                <ProgressBar value={68} variant="success" striped />
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Ages 3-7</span>
                    <span className="text-sm">42/50</span>
                  </div>
                  <ProgressBar
                    value={42}
                    max={50}
                    variant="primary"
                    size="sm"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Ages 8-11</span>
                    <span className="text-sm">35/65</span>
                  </div>
                  <ProgressBar value={35} max={65} variant="info" size="sm" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Ages 12+</span>
                    <span className="text-sm">25/32</span>
                  </div>
                  <ProgressBar
                    value={25}
                    max={32}
                    variant="warning"
                    size="sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Judge Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Judge 1: Sarah
                      </span>
                      <span className="text-sm">30/30</span>
                    </div>
                    <ProgressBar value={100} variant="success" size="sm" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Judge 2: Michael
                      </span>
                      <span className="text-sm">28/30</span>
                    </div>
                    <ProgressBar value={93} variant="success" size="sm" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Judge 3: David
                      </span>
                      <span className="text-sm">22/30</span>
                    </div>
                    <ProgressBar value={73} variant="warning" size="sm" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Judge 4: Emily
                      </span>
                      <span className="text-sm">15/30</span>
                    </div>
                    <ProgressBar value={50} variant="error" size="sm" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        High Scores (8-10)
                      </span>
                      <span className="text-sm">42 entries</span>
                    </div>
                    <ProgressBar
                      value={42}
                      max={102}
                      variant="success"
                      size="sm"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Medium Scores (5-7)
                      </span>
                      <span className="text-sm">48 entries</span>
                    </div>
                    <ProgressBar
                      value={48}
                      max={102}
                      variant="info"
                      size="sm"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Low Scores (0-4)
                      </span>
                      <span className="text-sm">12 entries</span>
                    </div>
                    <ProgressBar
                      value={12}
                      max={102}
                      variant="error"
                      size="sm"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex justify-between text-sm">
                    <span>Average Score:</span>
                    <span className="font-bold">6.8/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <BaseButton className="mt-4" variant="primary">
            Generate Final Reports
          </BaseButton>
        </LoadingOverlay>
      </div>
    );
  },
};
