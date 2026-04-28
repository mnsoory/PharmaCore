import React from "react";
import { Card, CardHeader, CardContent } from "@/components/shadcn/card";
import { MoveUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  variant: "green" | "blue" | "pink" | "purple";
}

const variantClasses = {
  green:
    "bg-[#d8f1b7]/90 backdrop-blur-md text-green-900 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]",
  blue: "bg-[#98d8d0]/90 backdrop-blur-md text-teal-900 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]",
  pink: "bg-[#f1b5b9]/90 backdrop-blur-md text-pink-900 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]",
  purple:
    "bg-[#b5bff0]/90 backdrop-blur-md text-purple-900 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]",
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  variant,
}) => {
  return (
    <Card
      className={`rounded-[2.5rem] border-none ${variantClasses[variant]} overflow-hidden shadow-none`}
    >
      <CardHeader className="flex flex-col items-start space-y-1 pb-1 px-4 ">
        <button className="absolute top-4 right-6 text-current/40 hover:text-current w-8 h-8 rounded-full border border-black/8 flex items-center justify-center transition-all hover:bg-white/30">
          <svg
            width="14"
            height="3"
            viewBox="0 0 16 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="2" cy="2" r="2" fill="currentColor" />
            <circle cx="8" cy="2" r="2" fill="currentColor" />
            <circle cx="14" cy="2" r="2" fill="currentColor" />
          </svg>
        </button>

        <div className="p-2 rounded-full text-black flex items-center justify-center border-4 border-gray-100/4 ring-2 ring-inset ring-gray-100/4 shadow-[inset_0_3px_4px_rgba(0,0,0,0.22)]">
          {React.isValidElement(icon)
            ? React.cloneElement(
                icon as React.ReactElement<{ size?: number }>,
                { size: 18 },
              )
            : icon}
        </div>

        <span className="text-[1rem] font-medium opacity-90 tracking-tight">
          {title}
        </span>
      </CardHeader>

      <CardContent className=" px-5">
        <div className="text-2xl font-black tracking-tighter leading-none">
          {value}
        </div>

        <div className="flex items-center gap-1 text-[0.775rem] font-bold mt-2">
          <MoveUpRight size={12} strokeWidth={3} />
          <span>{change}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
