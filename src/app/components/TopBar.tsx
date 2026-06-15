import { NavLink } from 'react-router';
import {
  MagnifyingGlass,
  Bell,
  Gear,
  CaretDown,
  MapPin,
} from '@phosphor-icons/react';

/** A floating, circular icon button (white pill on the soft header wash). */
function IconButton({
  label,
  children,
  to,
  withDot = false,
}: {
  label: string;
  children: React.ReactNode;
  to?: string;
  withDot?: boolean;
}) {
  const className =
    'relative grid size-10 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground';
  const dot = withDot ? (
    <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-brand-500 ring-2 ring-card" />
  ) : null;

  if (to) {
    return (
      <NavLink to={to} aria-label={label} className={className}>
        {children}
        {dot}
      </NavLink>
    );
  }
  return (
    <button type="button" aria-label={label} className={className}>
      {children}
      {dot}
    </button>
  );
}

export function TopBar() {
  return (
    <header className="relative z-10 flex h-16 flex-shrink-0 items-center justify-end gap-2 px-6">
      <IconButton label="Search">
        <MagnifyingGlass className="size-[18px]" />
      </IconButton>
      <IconButton label="Notifications" withDot>
        <Bell className="size-[18px]" />
      </IconButton>
      <IconButton label="Settings" to="/settings">
        <Gear className="size-[18px]" />
      </IconButton>

      {/* Organisation switcher pill */}
      <button
        type="button"
        className="flex items-center gap-3 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-3 shadow-sm transition-colors hover:bg-accent"
      >
        <span className="bg-brand-gradient grid size-9 place-items-center rounded-full text-sm font-bold text-white">
          RR
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold text-foreground">
            Retirement Reformation
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            Greater Austin Chapter
          </span>
        </span>
        <CaretDown className="size-4 text-muted-foreground" />
      </button>
    </header>
  );
}
