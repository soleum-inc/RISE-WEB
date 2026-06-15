import { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router';
import { SideNav } from './components/SideNav';
import { TopBar } from './components/TopBar';
import { Toaster } from './components/ui/sonner';
import { FrameworkProvider } from './context/FrameworkContext';
import { DebugMenu } from './components/DebugMenu';

// Route-level code splitting: each page (and heavy deps like recharts) ships in
// its own chunk and only loads when navigated to, shrinking the initial bundle.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MembersList = lazy(() => import('./pages/MembersList'));
const MemberDetail = lazy(() => import('./pages/MemberDetail'));
const CaseManagement = lazy(() => import('./pages/CaseManagement'));
const Events = lazy(() => import('./pages/Events'));
const CommunityFeed = lazy(() => import('./pages/CommunityFeed'));
const ModuleBuilder = lazy(() => import('./pages/ModuleBuilderNew'));
const PathwayPreview = lazy(() => import('./pages/PathwayPreview'));
const Settings = lazy(() => import('./pages/Settings'));

function PageLoader() {
  return (
    <div className="flex h-full min-h-[60vh] items-center justify-center">
      <div
        className="size-6 animate-spin rounded-full border-2 border-border border-t-brand-600"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

function RoutedPages() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      {/* Keyed on the path so the enter animation replays on each navigation.
          tw-animate-css drives the transition; prefers-reduced-motion is honored
          globally in theme.css. */}
      <div
        key={location.pathname}
        className="min-h-full animate-in fade-in slide-in-from-bottom-1 duration-300 ease-out"
      >
        <Routes location={location}>
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
      </div>
    </Suspense>
  );
}

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
              <RoutedPages />
            </main>
          </div>
        </div>
        <Toaster />
        <DebugMenu />
      </BrowserRouter>
    </FrameworkProvider>
  );
}
