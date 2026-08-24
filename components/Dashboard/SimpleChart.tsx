import React from "react";

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  title: string;
  icon: string;
  data: ChartDataPoint[];
  maxValue?: number;
  format?: (value: number) => string;
}

export default function SimpleChart({
  title,
  icon,
  data,
  maxValue,
  format = (v) => v.toString(),
}: SimpleChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  const defaultColors = [
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-red-500",
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>{icon}</span> {title}
        </h3>
      </div>

      <div className="space-y-5">
        {data.map((point, index) => (
          <div key={point.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">
                {point.label}
              </span>
              <span className="text-sm font-bold text-white">
                {format(point.value)}
              </span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  point.color || defaultColors[index % defaultColors.length]
                }`}
                style={{ width: `${(point.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-6 border-t border-gray-800/50">
        <p className="text-xs text-gray-400 text-center">
          📊 Last 7 days • Real-time data
        </p>
      </div>
    </div>
  );
}
