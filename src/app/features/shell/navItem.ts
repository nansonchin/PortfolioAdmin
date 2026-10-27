
export type NavItem = {
  href: string;
  label: string;
  index: string; 
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", index: "01" },
  { href: "/projects", label: "Projects", index: "02" },
  { href: "/profile", label: "Profile", index: "03" },
];