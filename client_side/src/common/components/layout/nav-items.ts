import { Grid3x3, Layers, LayoutDashboard, Replace, RotateCw, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: "/" | "/caesar" | "/substitution" | "/transposition" | "/solver";
  label: string;
  description: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Overview", description: "All tools", icon: LayoutDashboard },
  { href: "/caesar", label: "Caesar", description: "Shift cipher & brute force", icon: RotateCw },
  { href: "/substitution", label: "Substitution", description: "26-letter alphabet key", icon: Replace },
  { href: "/transposition", label: "Transposition", description: "Columnar keyword cipher", icon: Grid3x3 },
  { href: "/solver", label: "Layered solver", description: "Peel all three layers", icon: Layers },
];
