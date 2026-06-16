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
import { VerticalProvider } from './context/VerticalContext';
import { CasesProvider } from './context/CasesContext';

// Route-level code splitting: each page (and heavy deps like recharts) ships in
// its own chunk and only loads when navigated to, shrinking the initial bundle.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MembersList = lazy(() => import('./pages/MembersList'));
const MemberDetail = lazy(() => import('./pages/MemberDetail'));
const CaseManagement = lazy(() => import('./pages/CaseManagement'));
const CaseDetail = lazy(() => import('./pages/CaseDetail'));
const Impact = lazy(() => import('./pages/Impact'));
const FunderReport = lazy(() => import('./pages/FunderReport'));
const TrustAudit = lazy(() => import('./pages/TrustAudit'));
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
          <Route path="/cases/:id" element={<CaseDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/marketplace" element={<Navigate to="/events" replace />} />
          <Route path="/community-feed" element={<CommunityFeed />} />
          <Route path="/resources" element={<Navigate to="/resources/modules" replace />} />
          <Route path="/resources/modules" element={<ModuleBuilder />} />
          <Route path="/resources/pathway" element={<PathwayPreview />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/impact/report" element={<FunderReport />} />
          <Route path="/trust-audit" element={<TrustAudit />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Suspense>
  );
}

export default function App() {
  return (
    <VerticalProvider>
    <FrameworkProvider>
    <CasesProvider>
      {/* basename = Vite's BASE_URL: "/" in dev, "/RISE-WEB/" in the GitHub Pages
          production build, so routes resolve correctly under the subpath. */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        {/* Transparent shell so the body's warm mesh canvas shows through. */}
        <div className="flex h-screen text-foreground">
          <SideNav />
          <div className="relative flex flex-1 flex-col overflow-hidden">
            {/* Soft brand wash behind the top of the content (used sparingly). */}
            <div className="bg-hero pointer-events-none absolute inset-x-0 top-0 h-56" />
            <TopBar />
            <main className="scroll-fade relative flex-1 overflow-auto">
              <RoutedPages />
            </main>
          </div>
        </div>
        <Toaster />
      </BrowserRouter>
    </CasesProvider>
    </FrameworkProvider>
    </VerticalProvider>
  );
}
