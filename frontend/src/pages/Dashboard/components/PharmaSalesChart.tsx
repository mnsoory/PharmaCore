import React, { useMemo, useState } from "react";
import { Card } from "@/components/shadcn/card";
import { type DailySalesData } from "@/types/dashboard";


interface ProcessedChartData {
  day: string;
  value: number;
  fullDate: string;
}

interface PharmaSalesChartProps {
  title?: string;
  data?: DailySalesData[];
  currencySymbol?: string;
}

const PharmaSalesChart: React.FC<PharmaSalesChartProps> = ({
  title = "Total Sales Overview",
  data,
  currencySymbol = "$",
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useMemo((): ProcessedChartData[] => {
    console.log("length:", data?.length)
    const hasData = data && Array.isArray(data) && data.length > 0;
    if (!hasData) {
       const values: ProcessedChartData[] = [];
      for(let i:number =0; i< 4; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (4 - i));
        values[i] = {
          day: d.toLocaleDateString("en-US", { weekday: "short" }),
          value: 0,
          fullDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        };
      };

      return values;
    }
    return data.slice(-5).map((item) => {
      const d = new Date(item.date);
      return {
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        value: item.totalSales,
        fullDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
    });
  }, [data]);

  const { yAxisLabels, maxChartVal, targetHeight } = useMemo(() => {
    const values = chartData.map((d) => d.value);
    const rawMax = Math.max(...values) || 1000;
    const chartMax = rawMax * 1.15; 
    const step = chartMax / 4;
    const labels = Array.from({ length: 5 }, (_, i) => chartMax - i * step);

    return { yAxisLabels: labels, maxChartVal: chartMax, targetHeight: 160 };
  }, [chartData]);

  const formatLabel = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return Math.floor(num).toString();
  };

  const vibrantColors = [
    "#FFB86C",
    "#FF79C6",
    "#50FA7B",
    "#8BE9FD",
    "#BD93F9" 
  ];

  return (
    <Card className="rounded-[2.5rem] border-none bg-[#F9FBFE] shadow-[8px_8px_30px_#e0e5eb,-8px_-8px_30px_#ffffff] p-8 font-sans overflow-visible">
      <h3 className="text-xl font-bold text-slate-900 mb-14 tracking-tight">{title}</h3>

      <div className="flex gap-4">
        <div className="flex flex-col justify-between text-[10px] font-bold text-slate-600 h-40 pr-2 w-8">
          {yAxisLabels.map((label, idx) => (
            <span key={idx} className="block text-right leading-none">{formatLabel(label)}</span>
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          <div className="relative flex justify-between items-end h-40">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {yAxisLabels.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-full border-t border-slate-200/60 ${i === 4 ? "border-solid border-slate-200/60" : "border-dashed"}`} 
                />
              ))}
            </div>

            {chartData.map((item, index) => {
              const barHeightPx = (item.value / maxChartVal) * targetHeight;
              const isHovered = hoveredIndex === index;
              
              return (
                <div 
                  key={`${item.day}-${index}`} 
                  className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className="w-11 rounded-full bg-slate-300/40 flex items-end overflow-hidden cursor-pointer relative transition-colors duration-300 hover:bg-slate-200"
                    style={{ height: `${targetHeight}px` }}
                  >
                    <div
                      className="w-full bg-current rounded-full transition-all duration-500 ease-out relative shadow-inner"
                      style={{ 
                        height: `${barHeightPx}px`,
                        color: vibrantColors[index % vibrantColors.length],
                        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)`,
                        backgroundSize: "8px 8px",
                        filter: isHovered ? "brightness(1.1) saturate(1.2)" : "none"
                      }}
                    >
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full border-[3px] border-current shadow-md" />
                    </div>
                  </div>

                  {hoveredIndex === index && (
                    <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 flex flex-col items-center z-50 animate-in fade-in zoom-in duration-200">
                      <div className="bg-[#0A1F27] text-white rounded-2xl p-3 shadow-2xl min-w-35 text-center border border-white/10">
                        <p className="text-[10px] font-bold text-slate-400 mb-0.5 uppercase tracking-widest">{item.fullDate}</p>
                        <p className="text-sm font-black">{new Intl.NumberFormat().format(item.value)} {currencySymbol}</p>
                        <div className="absolute -bottom-1 w-3 h-3 bg-[#0A1F27] rotate-45 left-1/2 -translate-x-1/2" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-5">
            {chartData.map((item, index) => (
              <div key={index} className="flex-1 text-center">
                <span className={`text-[11px] font-black uppercase tracking-widest transition-colors duration-300 ${hoveredIndex === index ? "text-slate-900" : "text-slate-600"}`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PharmaSalesChart;