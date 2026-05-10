import {
  LayoutDashboard,
  Pill,
  Database,
  ArrowLeftRight,
  ShoppingCart,
  Truck,
  RotateCcw,
  Settings2,
  ClipboardList,
  Users,
  History,
} from "lucide-react";

export interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

const menuItems: NavGroup[] = [
  {
    group: "Main Menu",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { name: "Inventory", icon: Pill, path: "/drugs" },
      { name: "Stock Batches", icon: Database, path: "/stock-batches" },
      { name: "Alternatives", icon: ArrowLeftRight, path: "/alternatives" },
    ],
  },
  {
    group: "Operations",
    items: [
      { name: "Sales", icon: ShoppingCart, path: "/sales" },
      { name: "Purchases", icon: Truck, path: "/purchase-orders" },
      { name: "Returns", icon: RotateCcw, path: "/returns" },
    ],
  },
  {
    group: "Partners",
    items: [
      { name: "Suppliers", icon: ClipboardList, path: "/suppliers" },
      { name: "Staff Management", icon: Users, path: "/users" },
    ],
  },
  {
    group: "System",
    items: [
      { name: "Audit Logs", icon: History, path: "/audit-logs" },
      { name: "Global Settings", icon: Settings2, path: "/settings" },
    ],
  },
];

export default menuItems;
