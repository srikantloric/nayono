/*** This is example of menu item without group for horizontal layout. There will be no children. ***/

// assets
import { Bill } from 'iconsax-reactjs';

// types
import { NavItemType } from 'types/menu';

// icons
const icons = {
    samplePage: Bill
};

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const subscription: NavItemType = {
    id: 'group-pages',
    title: 'Subscription',
    type: 'group',
    children: [
        {
            id: 'subscription',
            title: 'Subscription & Billing',
            type: 'item',
            url: '/subscription',
            icon: icons.samplePage, 
        }
    ]
};

export default subscription;
