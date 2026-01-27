// project-imports
import pages from './pages';
import subscription from './subscription';
import settings from './settings';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [pages, subscription, settings]
};

export default menuItems;
