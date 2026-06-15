import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { SideNav } from './components/SideNav';
import { TopBar } from './components/TopBar';
import { Toaster } from './components/ui/sonner';
import { FrameworkProvider } from './context/FrameworkContext';
import { DebugMenu } from './components/DebugMenu';

import Dashboard from './pages/Dashboard';
import MembersList from './pages/MembersList';
import MemberDetail from './pages/MemberDetail';
import CaseManagement from './pages/CaseManagement';
import Events from './pages/Events';
import CommunityFeed from './pages/CommunityFeed';
import ModuleBuilder from './pages/ModuleBuilderNew';
import PathwayPreview from './pages/PathwayPreview';
import Settings from './pages/Settings';

export default function App() {
  return (
    <FrameworkProvider>
      <BrowserRouter>
        <div className="flex h-screen bg-background text-foreground">
          <SideNav />
          <div className="relative flex flex-1 flex-col overflow-hidden">
            {/* Soft brand wash behind the top of the content (used sparingly). */}
            <div className="bg-hero pointer-events-none absolute inset-x-0 top-0 h-56" />
            <TopBar />
            <main className="relative flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/members" element={<MembersList />} />
                <Route path="/members/:id" element={<MemberDetail />} />
                <Route path="/members/case-management" element={<CaseManagement />} />
                <Route path="/events" element={<Events />} />
                <Route path="/marketplace" element={<Navigate to="/events" replace />} />
                <Route path="/community-feed" element={<CommunityFeed />} />
                <Route path="/resources" element={<Navigate to="/resources/modules" replace />} />
                <Route path="/resources/modules" element={<ModuleBuilder />} />
                <Route path="/resources/pathway" element={<PathwayPreview />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster />
        <DebugMenu />
      </BrowserRouter>
    </FrameworkProvider>
  );
}