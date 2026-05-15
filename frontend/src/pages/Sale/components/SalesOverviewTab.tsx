import SalesSummaryCards from "./SalesSummaryCards";
import SalesRevenueChart from "./SalesRevenueChart";
import type { Sale, SalesSummary } from "@/types/sale";

interface Props {
  summary: SalesSummary;
  reportSales: Sale[];
  from: string;
  to: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
}

const SalesOverviewTab: React.FC<Props> = ({
  summary, reportSales, from, to, onFromChange, onToChange,
}) => (
  <div className="space-y-6">

    {/* Date range */}
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Period:</span>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={from}
          onChange={e => onFromChange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-muted/40 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-primary/20 focus:border-sidebar-primary/50 focus:bg-background transition-all"
        />
        <span className="text-sm text-muted-foreground">to</span>
        <input
          type="date"
          value={to}
          onChange={e => onToChange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-muted/40 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-primary/20 focus:border-sidebar-primary/50 focus:bg-background transition-all"
        />
      </div>
    </div>

    <SalesSummaryCards summary={summary} />
    <SalesRevenueChart sales={reportSales} />
  </div>
);

export default SalesOverviewTab;