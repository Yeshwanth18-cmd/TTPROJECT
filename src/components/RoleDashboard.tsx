import ClientDashboard from "../pages/ClientDashboard";
import FreelancerDashboard from "../pages/FreelancerDashboard";
import AdminDashboard from "../pages/AdminDashboard";

import { getCurrentUser } from "../services/auth";

function RoleDashboard() {
  const user = getCurrentUser();

  if (!user) {
    return <div>Unable to load user information.</div>;
  }

  switch (user.role) {
    case "CLIENT":
      return <ClientDashboard />;

    case "FREELANCER":
      return <FreelancerDashboard />;

    case "ADMIN":
      return <AdminDashboard />;

    default:
      return <div>Invalid user role.</div>;
  }
}

export default RoleDashboard;