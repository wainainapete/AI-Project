import { HomeOutlined } from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig';


const navigationConfig = [
  {
    key: "dashboards",
    path: `${APP_PREFIX_PATH}/dashboards`,
    title: "sidenav.dashboard",
    icon: HomeOutlined,
    breadcrumb: false,
    isGroupTitle: true,
    submenu: [
      {
        key: 'dashboards-default',
        path: `${APP_PREFIX_PATH}/dashboards/default`,
        title: 'Dashboard',
        icon: HomeOutlined,
        breadcrumb: false,
        submenu: []
      }
    ],
  }
];

export default navigationConfig;
