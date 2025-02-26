import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Clock } from "lucide-react";

export default function EmptyContestsCard() {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="mb-4">
          <Clock className="w-12 h-12 mx-auto text-gray-400" />
        </div>
        <h3 className="text-lg font-medium">No Active Contests</h3>
        <p className="text-gray-500 mt-1">
          There are no active contests available for judging at this time.
        </p>
      </CardContent>
    </Card>
  );
}
