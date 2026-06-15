import { NavLink } from 'react-router';
import {
  MagnifyingGlass,
  Bell,
  Gear,
  CaretDown,
  MapPin,
} from '@phosphor-icons/react';
import { useVertical } from '../context/VerticalContext';
import { verticalOrder, verticals, type VerticalId } from '../config/verticals';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from './ui/dropdown-menu';

/** A floating, circular icon button (frosted pill on the soft header wash). */
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
    'relative grid size-10 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-accent hover:text-foreground';
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
  const { verticalId, setVertical, theme } = useVertical();

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

      {/* Organisation switcher — doubles as the vertical (Loom demo) switcher.
          The same UI reskins its vocabulary for each vertical. */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-3 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-3 shadow-sm backdrop-blur-md transition-colors hover:bg-accent"
          >
            <span className="grid size-9 place-items-center rounded-full bg-secondary text-sm font-bold text-foreground">
              {theme.org.initials}
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className="text-sm font-semibold text-foreground">
                {theme.org.name}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {theme.org.location}
              </span>
            </span>
            <CaretDown className="size-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Switch vertical</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={verticalId}
            onValueChange={(v) => setVertical(v as VerticalId)}
          >
            {verticalOrder.map((id) => (
              <DropdownMenuRadioItem key={id} value={id} className="py-2">
                <span className="flex flex-col">
                  <span className="font-medium text-foreground">{verticals[id].label}</span>
                  <span className="text-xs text-muted-foreground">{verticals[id].org.name}</span>
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
