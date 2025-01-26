import Dashboard from "@/components/dashboard/dashboard";
import HeaderMenu from "@/components/header/header-menu";

export default function DashboardPage() {
  return (
    <div className="w-full h-full">
      <HeaderMenu />
      <Dashboard />
    </div>
  );
}
