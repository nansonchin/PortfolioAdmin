export type NavItem = {
  href: string;
  label: string;
  index: string;
  countKey?:"deleted"
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", index: "01" },
  { href: "/projects", label: "Projects", index: "02" },
  { href: "/profile", label: "Profile", index: "03" },
  { href: "/publish", label: "Publish", index: "04" },
{ href: "/deleted", label: "Deleted", index: "05", countKey: "deleted" },
];
