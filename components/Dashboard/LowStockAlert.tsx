import React from "react";
import { AlertTriangle } from "lucide-react";

interface LowStockAlertProps {
  items: Array<{
    id: string;
    name: string;
    currentStock: number;
    minimumStock: number;
    unit: string;
    percentage: number;
  }>;
}

export default function LowStockAlert({ items }: LowStockAlertProps) {
  return (
    <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-500/20 p-3 rounded-lg">
          <AlertTriangle className="text-red-400" size={24} />
        </div>
        <h3 className="text-xl font-bold text-white">Low Stock Alert</h3>
        <span className="ml-auto bg-red-500/20 text-red-300 text-xs font-semibold px-3 py-1 rounded-full">
          {items.length} items
        </span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {items.length === 0 ? (
          <p className="text-gray-400 text-center py-8">✅ All stock levels are healthy</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 hover:border-red-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-gray-400">
                    {item.currentStock} {item.unit} • Min: {item.minimumStock}
                  </p>
                </div>
                <span className="text-xs font-bold text-red-400 bg-red-500/20 px-2 py-1 rounded">
                  {item.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    item.percentage < 25
                      ? "bg-red-500"
                      : item.percentage < 50
                        ? "bg-orange-500"
                        : "bg-yellow-500"
                  }`}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
