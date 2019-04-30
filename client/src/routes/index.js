// import async from "../components/Async";
import Admin from "../pages/admin";
import { Sliders as SlidersIcon } from "react-feather";

// Dashboards
import Default from "../pages/dashboards/Default";

const dashboardRoutes = {
	path: "/dashboard/default",
	name: "Dashboard",
	header: "Main",
	icon: SlidersIcon,
	component: Default,
	children: null
};

const adminDashboardRoutes = {
	path: "/admin/dashboard",
	name: "Dashboard",
	header: "Admin",
	icon: SlidersIcon,
	component: Admin,
	children: null
};

// Dashboard specific routes
export const dashboard = [dashboardRoutes];
export const adminDashboard = [adminDashboardRoutes];

// All routes
// export default [dashboardRoutes, adminDashboardRoutes];
