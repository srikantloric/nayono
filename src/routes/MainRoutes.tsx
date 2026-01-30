import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';

import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import Dashboard from 'pages/dashboard/dashboard';
import Customers from 'pages/customers/customers';
import Events from 'pages/events/events';
import PhotoSelection from 'pages/photoSelection/photoSelection';
import Subscription from 'pages/subscription/subscription';
import Profile from 'pages/profile/profile';

// pages routing
const MaintenanceError = Loadable(lazy(() => import('pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/error/500')));
const MaintenanceUnderConstruction = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction')));
const MaintenanceUnderConstruction2 = Loadable(lazy(() => import('pages/maintenance/under-construction/under-construction2')));
const MaintenanceComingSoon = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon')));
const MaintenanceComingSoon2 = Loadable(lazy(() => import('pages/maintenance/coming-soon/coming-soon2')));


// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      element: <DashboardLayout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'customers', element: <Customers /> },
        { path: 'events', element: <Events /> },
        { path: 'photoSelection', element: <PhotoSelection /> },
        { path: 'subscription', element: <Subscription /> },
        { path: 'profile', element: <Profile /> }
      ]
    },
    { path: '*', element: <MaintenanceError /> }
  ]
};

export default MainRoutes;
