import React from "react";
import { Card } from "@/components/shadcn/card";

export interface ChartData {
  label: string;
  value: number;
  color: string;
  legendColor: string;
}

interface GraphReportCardProps {
  data?: ChartData[];
  totalValue?: number;
  title?: string;
}

const GraphReportCard: React.FC<GraphReportCardProps> = ({
  data = [],
  totalValue,
  title = "Top Selling Drugs (Last 7 Days)",
}) => {
  const formatNumber = (num?: number) => {
    if (num === undefined) return "---";
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  };

  const gradientString = data.length > 0 
    ? data
        .map((item, idx) => {
          const prevSum = data.slice(0, idx).reduce((sum, i) => sum + i.value, 0);
          return `${item.color} ${prevSum}% ${prevSum + item.value}%`;
        })
        .join(", ")
    : "#f1f5f9 0% 100%";

  const getLabelStyle = (value: number, previousCumulative: number) => {
    const midPoint = previousCumulative + value / 2;
    const angleInDegrees = (midPoint / 100) * 360 - 90;
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    const radius = 59;

    const x = 50 + radius * Math.cos(angleInRadians);
    const y = 50 + radius * Math.sin(angleInRadians);

    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: "translate(-50%, -50%)",
    };
  };

  return (
    <Card className="rounded-[2.5rem] border-none bg-slate-50/50 shadow-[10px_10px_30px_rgba(224,229,235,0.5),-10px_-10px_30px_#ffffff] p-8">
      <h3 className="text-lg font-black text-slate-900 mb-2">{title}</h3>

      <div className="relative flex items-center justify-center p-14">
        <div
          className="relative w-60 h-60 rounded-full flex items-center justify-center shadow-sm"
          style={{ background: `conic-gradient(${gradientString})` }}
        >
          <div className="w-[82%] h-[82%] bg-white rounded-full flex items-center justify-center shadow-[inset_0_4px_12px_rgba(0,0,0,0.03)]">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-1">
                Total Units
              </p>
              <p className="text-5xl font-black text-slate-900 tracking-tighter">
                {formatNumber(totalValue)}
              </p>
            </div>
          </div>

          {data.map((item, index) => {
            const currentOffset = data.slice(0, index).reduce((sum, i) => sum + i.value, 0);
            const style = getLabelStyle(item.value, currentOffset);

            return (
              <span
                key={index}
                style={style}
                className="absolute w-11 h-11 flex items-center justify-center bg-white rounded-full text-[11px] font-black text-slate-800 shadow-lg border border-slate-50 z-10"
              >
                {Math.round(item.value)}%
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-8 text-[12px] font-bold text-slate-600">
        {data.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${item.legendColor}`} />
            {item.label}
          </span>
        ))}
      </div>
    </Card>
  );
};

export default GraphReportCard;