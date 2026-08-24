import React from "react";
import { LucideIcon, ChevronRight } from "lucide-react";
import Link from "next/link";

interface SummaryItemProps {
  icon: LucideIcon;
  label: string;
  count: number;
  color: "blue" | "green" | "purple" | "orange" | "pink" | "indigo";
  href: string;
  description?: string;
}

const colorClasses = {
  blue: {
    bg: "from-blue-500/10 to-blue-600/10",
    border: "border-blue-500/20 hover:border-blue-500/40",
    icon: "text-blue-400",
  },
  green: {
    bg: "from-green-500/10 to-green-600/10",
    border: "border-green-500/20 hover:border-green-500/40",
    icon: "text-green-400",
  },
  purple: {
    bg: "from-purple-500/10 to-purple-600/10",
    border: "border-purple-500/20 hover:border-purple-500/40",
    icon: "text-purple-400",
  },
  orange: {
    bg: "from-orange-500/10 to-orange-600/10",
    border: "border-orange-500/20 hover:border-orange-500/40",
    icon: "text-orange-400",
  },
  pink: {
    bg: "from-pink-500/10 to-pink-600/10",
    border: "border-pink-500/20 hover:border-pink-500/40",
    icon: "text-pink-400",
  },
  indigo: {
    bg: "from-indigo-500/10 to-indigo-600/10",
    border: "border-indigo-500/20 hover:border-indigo-500/40",
    icon: "text-indigo-400",
  },
};

export default function SummaryItem({
  icon: Icon,
  label,
  count,
  color,
  href,
  description,
}: SummaryItemProps) {
  const styles = colorClasses[color];

  return (
    <Link href={href}>
      <button
        className={`w-full bg-gradient-to-br ${styles.bg} ${styles.border} border p-6 rounded-2xl hover:shadow-lg hover:shadow-${color}-500/10 transition-all duration-300 backdrop-blur-sm text-left group`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`${styles.icon}`}>
            <Icon size={28} />
          </div>
          <ChevronRight
            size={20}
            className={`${styles.icon} opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all`}
          />
        </div>
        <h4 className="text-gray-300 text-sm font-medium uppercase tracking-wider mb-2">
          {label}
        </h4>
        <p className="text-3xl font-bold text-white mb-2">{count}</p>
        {description && (
          <p className="text-xs text-gray-400">{description}</p>
        )}
      </button>
    </Link>
  );
}
