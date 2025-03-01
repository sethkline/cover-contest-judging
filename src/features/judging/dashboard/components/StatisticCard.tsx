import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";

interface StatisticCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: number | string;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  icon: Icon,
  iconColor,
  iconBgColor,
  label,
  value,
}) => {
  // Map the old color classes to the new design system
  const colorMap = {
    'text-rev-red-600': 'text-primary-600',
    'bg-rev-red-200': 'bg-primary-100',
    'text-rev-purple': 'text-info-600',
    'bg-rev-grape': 'bg-info-100',
    'text-rev-brown': 'text-warning-600',
    'bg-rev-tan': 'bg-warning-100'
  };

  // Get the mapped color or use the original if no mapping exists
  const mappedIconColor = colorMap[iconColor] || iconColor;
  const mappedIconBgColor = colorMap[iconBgColor] || iconBgColor;

  return (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`${mappedIconBgColor} p-3 rounded-full`}>
          <Icon className={mappedIconColor} size={24} />
        </div>
        <div>
          <p className="text-sm text-neutral-500">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};