// assets
import { HomeTrendUp, Profile2User, Calendar1, Kanban } from 'iconsax-reactjs';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  dashboard: HomeTrendUp,
  customer: Profile2User,
  calender: Calendar1,
  photo: Kanban
};

// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages: NavItemType = {
  id: 'group-pages',
  title: 'Home',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.dashboard,
    },
    {
      id: 'customers',
      title: 'Customers',
      type: 'item',
      url: '/customers',
      icon: icons.customer,
    },
    {
      id: 'events',
      title: 'Events',
      type: 'item',
      url: '/events',
      icon: icons.calender,
    },
    {
      id: 'photoSelection',
      title: 'Photo Selection',
      type: 'item',
      url: '/photoselection',
      icon: icons.photo,
    }
  ]
};

export default pages;
