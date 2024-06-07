import TopBarComponent from "@/components/nav/topbar";
import DashboardContainer from "@/containers/dashboard/dashboardContainer";

function DashboardPage() {
  return (
    <div className="flex flex-col">
      <TopBarComponent />
      <DashboardContainer />
    </div>
  );
}

export default DashboardPage