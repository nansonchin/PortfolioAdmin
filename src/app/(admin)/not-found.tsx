import NotFoundScreen from "@/components/NotFoundScreen";

// Used when a page inside the admin calls notFound() (e.g. a project id that no longer exists),
// so the sidebar and top bar stay on screen.
export default function AdminNotFound() {
  return <NotFoundScreen />;
}
