import {
  Accessibility, Briefcase, Building2, CalendarClock, Car, Check, ChevronLeft, CircleHelp, Eye, Flame, Footprints,
  GitBranch, Hammer, Layers, Mail, MessageSquare, MoveRight, Phone, Rocket, Route, Sparkles, Stethoscope, Store,
  Train, TrendingUp, Truck, UtensilsCrossed, Warehouse, type LucideIcon,
} from 'lucide-react';

const ICONES: Record<string, LucideIcon> = {
  Accessibility, Briefcase, Building2, CalendarClock, Car, Eye, Flame, Footprints, GitBranch, Hammer, Layers, Mail,
  MessageSquare, MoveRight, Phone, Rocket, Route, Sparkles, Stethoscope, Store, Train, TrendingUp, Truck,
  UtensilsCrossed, Warehouse, CircleHelp,
};

export function Icone({ nom, taille = 24 }: { nom?: string; taille?: number }) {
  if (!nom) return null;
  const C = ICONES[nom];
  return C ? <C size={taille} strokeWidth={1.6} aria-hidden="true" /> : null;
}

export { Check, ChevronLeft, CircleHelp };
