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

export default function StatisticCard({
  icon: Icon,
  iconColor,
  iconBgColor,
  label,
  value,
}: StatisticCardProps) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`${iconBgColor} p-3 rounded-full`}>
          <Icon className={iconColor} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
