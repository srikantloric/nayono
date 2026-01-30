/*** This is example of menu item without group for horizontal layout. There will be no children. ***/

// assets
import { UserSquare } from 'iconsax-reactjs';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
    samplePage: UserSquare
};

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const settings: NavItemType = {
    id: 'group-pages',
    title: 'settings',
    type: 'group',
    children: [
        {
            id: 'my-profile',
            title: 'My Profile',
            type: 'item',
            url: '/profile',
            icon: icons.samplePage, 
        }
    ]
};

export default settings;
