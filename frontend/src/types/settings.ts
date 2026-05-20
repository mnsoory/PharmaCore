export type Theme = "light" | "dark" | "system";
export type Language = "en" | "ar";

export interface AppSettings {
  theme: Theme;
  language: Language;
  notifications: {
    lowStock: boolean;
    expiringSoon: boolean;
    newOrders: boolean;
    systemAlerts: boolean;
  };
}

export interface StockSetting {
  drugId:          number;
  drugTradeName:   string;
  genericName: string;
  concentration:   string;
  minimumStock:    number;
}