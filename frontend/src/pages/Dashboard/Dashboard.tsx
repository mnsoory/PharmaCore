import React from "react";
import StatCard from "./components/StatCard";
import GraphReportCard from "./components/GraphReportCard";
import DrugStockTable from "./components/DrugStockTable";
import PharmaSalesChart from "./components/PharmaSalesChart";
import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/services/dashboardService";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ErrorScreen from "@/components/ui/ErrorScreen";
import { dashboardKeys } from "@/api/keys";

const CHART_COLORS = [
  { color: "#2563EB", legendColor: "bg-blue-600" },
  { color: "#7C3AED", legendColor: "bg-violet-600" },
  { color: "#EA580C", legendColor: "bg-orange-600" },
  { color: "#DB2777", legendColor: "bg-pink-600" },
  { color: "#16A34A", legendColor: "bg-green-600" },
];

const Dashboard: React.FC = () => {
  const {
    data: summary,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: getDashboardSummary,
  });

  const pharmacyChartData = React.useMemo(() => {
    if (!summary) return [];

    const drugs = summary.topSellingDrugsResponse.drugs;
    const totalSold = drugs.reduce(
      (acc, curr) => acc + curr.totalSoldQuantity,
      0,
    );

    return drugs.map((drug, index) => ({
      label: `${drug.tradeName} ${drug.concentration}`,
      value: totalSold > 0 ? (drug.totalSoldQuantity / totalSold) * 100 : 0,
      color: CHART_COLORS[index % CHART_COLORS.length].color,
      legendColor: CHART_COLORS[index % CHART_COLORS.length].legendColor,
    }));
  }, [summary]);

  const totalSoldUnits =
    summary?.topSellingDrugsResponse.drugs.reduce(
      (acc, curr) => acc + curr.totalSoldQuantity,
      0,
    ) ?? 0;

  if (isLoading) 
    return <LoadingScreen/>
  
  if (isError || !summary) 
    return <ErrorScreen onRetry={() => refetch()} resetLoading={isFetching} />;

  return (
    <div className="flex flex-col gap-10">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Sales"
          value={`$ ${summary.todaySalesAmount.toFixed(2)}`}
          change={`${summary.todaySalesCount} orders`}
          variant="green"
        />
        <StatCard
          title="Low Stock"
          value={summary.lowStockCount}
          change="Needs restocking"
          variant="blue"
        />
        <StatCard
          title="Expiring Soon"
          value={summary.expiringSoonCount}
          change="Expiring in 3 months"
          variant="pink"
        />
        <StatCard
          title="Expired Batches"
          value={summary.expiredCount}
          change="ToRemove from stock"
          variant="purple"
        />
      </section>

      <section className=" grid grid-cols-1 xl:grid-cols-[1fr,2fr] gap-8 items-start">
        <GraphReportCard
          title={`Top Selling Drugs (Last ${summary.topSellingDrugsResponse.daysPeriod} Days)`}
          totalValue={totalSoldUnits}
          data={pharmacyChartData}
        />

        <PharmaSalesChart
          title="Daily Sales Breakdown"
          data={summary.weeklySales}
          currencySymbol="$"
        />

        <DrugStockTable
          drugs={summary.lowStockDrugs}
          title="Low Stock Monitoring"
        />
      </section>
    </div>
  );
};

export default Dashboard;
