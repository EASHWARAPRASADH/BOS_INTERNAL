// assets
import { IconUserPlus, IconUsers, IconShieldLock, IconSettings } from '@tabler/icons-react';

// constant
const icons = {
  IconUserPlus,
  IconUsers,
  IconShieldLock,
  IconSettings
};

// ==============================|| MENU ITEMS - ADMIN ||============================== //

const admin = {
  id: 'admin',
  title: 'Admin',
  type: 'group',
  icon: icons.IconShieldLock,
  children: [
    {
      id: 'user-credentials',
      title: 'User Credentials',
      type: 'item',
      url: '/admin/user-credentials',
      icon: icons.IconUsers,
      breadcrumbs: true
    },
    {
      id: 'preference-master',
      title: 'App Preference',
      type: 'item',
      url: '/admin/preference-master',
      icon: icons.IconSettings,
      breadcrumbs: true
    }
  ]
};

export default admin;
