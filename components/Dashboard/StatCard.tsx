import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: number;
  color: "blue" | "green" | "yellow" | "red" | "purple" | "pink";
  description?: string;
}

const colorClasses = {
  blue: {
    bg: "from-blue-500/10 to-blue-600/10",
    border: "border-blue-500/20 hover:border-blue-500/40",
    text: "text-blue-300",
    icon: "text-blue-400",
  },
  green: {
    bg: "from-green-500/10 to-green-600/10",
    border: "border-green-500/20 hover:border-green-500/40",
    text: "text-green-300",
    icon: "text-green-400",
  },
  yellow: {
    bg: "from-yellow-500/10 to-yellow-600/10",
    border: "border-yellow-500/20 hover:border-yellow-500/40",
    text: "text-yellow-300",
    icon: "text-yellow-400",
  },
  red: {
    bg: "from-red-500/10 to-red-600/10",
    border: "border-red-500/20 hover:border-red-500/40",
    text: "text-red-300",
    icon: "text-red-400",
  },
  purple: {
    bg: "from-purple-500/10 to-purple-600/10",
    border: "border-purple-500/20 hover:border-purple-500/40",
    text: "text-purple-300",
    icon: "text-purple-400",
  },
  pink: {
    bg: "from-pink-500/10 to-pink-600/10",
    border: "border-pink-500/20 hover:border-pink-500/40",
    text: "text-pink-300",
    icon: "text-pink-400",
  },
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  description,
}: StatCardProps) {
  const styles = colorClasses[color];

  return (
    <div
      className={`bg-gradient-to-br ${styles.bg} ${styles.border} border p-6 rounded-2xl hover:shadow-lg hover:shadow-${color}-500/10 transition-all duration-300 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`${styles.text} text-sm font-medium uppercase tracking-wider mb-2`}>
            {label}
          </p>
          <p className="text-3xl md:text-4xl font-bold text-white mb-2">
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-400">{description}</p>
          )}
          {trend !== undefined && (
            <div className={`text-xs mt-3 ${trend >= 0 ? "text-green-400" : "text-red-400"}`}>
              {trend >= 0 ? "📈" : "📉"} {Math.abs(trend)}% vs last week
            </div>
          )}
        </div>
        <div className={`${styles.icon} opacity-60 ml-4`}>
          <Icon size={32} />
        </div>
      </div>
    </div>
  );
}
