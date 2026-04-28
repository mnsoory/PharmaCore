"use client";
import React from "react";
import { Table } from "@heroui/react";
import { Pill } from "lucide-react";

interface DrugStock {
  tradeName: string;
  genericName: string;
  concentration: string;
  currentStock: number;
  minimumStockThreshold: number;
}

interface DrugStockTableProps {
  drugs: DrugStock[];
  title: string;
}

const DrugStockTable: React.FC<DrugStockTableProps> = ({ drugs, title }) => {
  return (
    <div className=" p-8 bg-[#F8F9FA] rounded-[3rem]">
      <h2 className="text-2xl pl-4 mb-6 font-black text-slate-900 tracking-tight">
        {title}
      </h2>

      <div className="bg-white rounded-4xl shadow-sm border border-slate-100 overflow-hidden">
        <Table
          aria-label="Medication Stock Table"
          className="w-full"
        >
          <Table.ScrollContainer>
            <Table.Content className="w-full px-2">
              <Table.Header className="">
                <Table.Column className="w-[28%] bg-[#F4F4F5] text-slate-500 font-bold text-[11px] text-center tracking-widest">
                  MEDICATION
                </Table.Column>
                <Table.Column className="w-[6%] bg-[#F4F4F5] text-slate-500 font-bold text-[11px] text-left tracking-widest">
                  GENERIC NAME
                </Table.Column>
                <Table.Column className="w-[15%] bg-[#F4F4F5] text-slate-500 font-bold text-[11px] text-left tracking-widest">
                  CONC.
                </Table.Column>
                <Table.Column className="w-[15%] bg-[#F4F4F5] text-slate-500 font-bold text-[11px] text-left tracking-widest">
                  STOCK STATUS
                </Table.Column>
                <Table.Column className="w-[15%] bg-[#F4F4F5] text-slate-500 font-bold text-[11px] py-5 px-6 text-right tracking-widest">
                  THRESHOLD
                </Table.Column>
              </Table.Header>

              <Table.Body>
                {drugs.map((drug, index) => {
                  const stockPercentage = Math.min(
                    (drug.currentStock / drug.minimumStockThreshold) * 100,
                    100,
                  );

                  
                  let statusColor = "emerald"; 
                  if (stockPercentage < 40) {
                    statusColor = "rose";
                  } else if (stockPercentage < 90) {
                    statusColor = "amber"; 
                  }

                  const isLow = drug.currentStock < drug.minimumStockThreshold;

                  return (
                    <Table.Row
                      key={index}
                      className="group border-b border-slate-50 last:border-none hover:bg-cyan-100/40 transition-all"
                    >
                      <Table.Cell className="w-[28%] py-6 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${isLow ? `bg-${statusColor}-50 text-${statusColor}-500` : "bg-blue-50 text-blue-500"}`}
                          >
                            <Pill size={18} />
                          </div>
                          <span className="font-bold text-slate-800 text-sm">
                            {drug.tradeName}
                          </span>
                        </div>
                      </Table.Cell>

                      <Table.Cell className="w-[27%] text-slate-600 italic text-sm font-medium">
                        {drug.genericName}
                      </Table.Cell>

                      <Table.Cell className="w-[15%]">
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[11px] font-bold text-slate-600 border border-slate-200/20">
                          {drug.concentration}
                        </span>
                      </Table.Cell>

                      <Table.Cell className="w-[15%]">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`font-black text-sm text-${statusColor}-500`}
                          >
                            {drug.currentStock}
                          </span>
                          <div className="w-full max-w-20 h-1.5 bg-slate-300/80 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-${statusColor}-500`}
                              style={{ width: `${stockPercentage}%` }}
                            />
                          </div>
                        </div>
                      </Table.Cell>

                      <Table.Cell className="w-[15%] text-center ">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-slate-500 uppercase italic tracking-tighter">
                            Min Limit
                          </span>
                          <span className="font-bold text-slate-600 text-sm">
                            {drug.minimumStockThreshold}
                          </span>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    </div>
  );
};

export default DrugStockTable;
