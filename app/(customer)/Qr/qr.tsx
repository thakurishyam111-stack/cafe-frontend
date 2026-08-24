
"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";
import { getCustomerOrderUrlBase } from "@/lib/api";

interface TableQRCodeProps {
  tableNo: number;
  qrToken: string;
}

export default function TableQRCode({
  tableNo,
  qrToken,
}: TableQRCodeProps) {
  const base = getCustomerOrderUrlBase();
  const qrUrl = `${base}/order/${qrToken}`;

  const containerRef = useRef<HTMLDivElement | null>(null);

  const download = () => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (!canvas) return;
    const dataUrl = (canvas as HTMLCanvasElement).toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `table-${tableNo}-qr.png`;
    a.click();
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-3 rounded-lg border p-5">
      <h2 className="text-lg font-semibold">
        Table {tableNo}
      </h2>

      <QRCodeCanvas
        value={qrUrl}
        size={220}
        level="H"
        includeMargin={true}
      />

      <p className="text-sm text-gray-500 break-all text-center">{qrUrl}</p>

      <div className="flex gap-2">
        <button className="px-3 py-1 bg-amber-600 text-white rounded" onClick={() => navigator.clipboard.writeText(qrUrl)}>
          Copy URL
        </button>
        <button className="px-3 py-1 bg-slate-700 text-white rounded" onClick={download}>
          Download
        </button>
        <button className="px-3 py-1 bg-slate-500 text-white rounded" onClick={() => window.print()}>
          Print
        </button>
      </div>
    </div>
  );
}
