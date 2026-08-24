import React from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  href: string;
  color: "blue" | "green" | "purple" | "orange" | "pink" | "indigo";
  description?: string;
}

const colorClasses = {
  blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
  green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
  purple:
    "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
  orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
  pink: "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
  indigo:
    "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
};

interface QuickActionsProps {
  actions: QuickActionProps[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white mb-6">⚡ Quick Actions</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <button
                className={`w-full bg-gradient-to-r ${colorClasses[action.color]} text-white font-semibold py-4 px-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 group`}
              >
                <Icon
                  size={24}
                  className="group-hover:scale-110 transition-transform"
                />
                <div className="text-left">
                  <p className="font-semibold text-sm">{action.label}</p>
                  {action.description && (
                    <p className="text-xs opacity-90">{action.description}</p>
                  )}
                </div>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
