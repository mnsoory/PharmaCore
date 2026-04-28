import {
  LayoutDashboard,
  Pill,
  ClipboardList,
  Truck,
  ShoppingCart,
  RotateCcw,
  Settings2,
  Users,
  Database,
  History,
} from "lucide-react";

const menuItems = [
  {
    group: "MAIN MENU",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { name: "Inventory", icon: Pill, path: "/drugs" },
      { name: "Stock Batches", icon: Database, path: "/stock-batches" },
    ],
  },
  {
    group: "OPERATIONS",
    items: [
      { name: "Sales", icon: ShoppingCart, path: "/sales" },
      { name: "Purchases", icon: Truck, path: "/purchase-orders" },
      { name: "Returns", icon: RotateCcw, path: "/returns" },
      { name: "Stock Adjustments", icon: Settings2, path: "/adjustments" },
    ],
  },
  {
    group: "PARTNERS",
    items: [
      { name: "Suppliers", icon: ClipboardList, path: "/suppliers" },
      { name: "Staff Management", icon: Users, path: "/users" },
    ],
  },
  {
    group: "SYSTEM",
    items: [
      { name: "Audit Logs", icon: History, path: "/audit-logs" },
      { name: "Global Settings", icon: Settings2, path: "/stock-settings" },
    ],
  },
];

export default menuItems;
