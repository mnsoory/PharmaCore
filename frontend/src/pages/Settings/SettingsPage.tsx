import React from "react";
import AppearanceCard from "./components/AppearanceCard";
import NotificationsCard from "./components/NotificationsCard";
import StockSettingsCard from "./components/StockSettingsCard";

const SettingsPage: React.FC = () => (
  <div className="max-w-3xl mx-auto space-y-6">
    <div>
      <h1 className="text-xl font-bold text-foreground">Settings</h1>
      <p className="text-sm text-muted-foreground mt-0.5">
        Manage your application preferences and system configuration
      </p>
    </div>

    <AppearanceCard />
    <NotificationsCard />
    <StockSettingsCard />
  </div>
);

export default SettingsPage;