'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '../store/uiStore';
import { useTranslation } from '../locales/useTranslation';

// Layout Components
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import NotificationDrawer from '../components/layout/NotificationDrawer';

// Module Components
import DashboardModule from '../components/dashboard/DashboardModule';
import TeamsModule from '../components/teams/TeamsModule';
import PlayersModule from '../components/players/PlayersModule';
import StaffModule from '../components/staff/StaffModule';
import AttendanceModule from '../components/attendance/AttendanceModule';
import TrainingModule from '../components/trainings/TrainingModule';
import MatchesModule from '../components/matches/MatchesModule';
import AnalyticsModule from '../components/analytics/AnalyticsModule';
import NotificationsModule from '../components/notifications/NotificationsModule';
import SettingsModule from '../components/settings/SettingsModule';

export default function Home() {
  const { activeTab, initializeUI } = useUIStore();

  // Initialize UI on load to match stored locale and theme
  useEffect(() => {
    initializeUI();
  }, [initializeUI]);

  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardModule />;
      case 'teams':
        return <TeamsModule />;
      case 'players':
        return <PlayersModule />;
      case 'staff':
        return <StaffModule />;
      case 'attendance':
        return <AttendanceModule />;
      case 'training':
        return <TrainingModule />;
      case 'matches':
        return <MatchesModule />;
      case 'reports':
        return <AnalyticsModule />;
      case 'notifications':
        return <NotificationsModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Top Header/Navbar */}
        <Navbar />

        {/* Scrollable Active View Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          <div className="max-w-7xl mx-auto w-full">
            {renderModule()}
          </div>
        </main>
      </div>

      {/* Alerts Slider Panel */}
      <NotificationDrawer />
    </div>
  );
}
