import { HomeOutlined, FireOutlined } from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

const navigationConfig = [
  {
    key: "Home",
    path: `${APP_PREFIX_PATH}/dashboards/default`,
    title: "Home",
    icon: HomeOutlined, 
    breadcrumb: false,
    submenu: [],
  },
  {
    key: "Trending",
    path: `${APP_PREFIX_PATH}/trending`,
    title: "Trending",
    icon: FireOutlined,  
    breadcrumb: false,
    submenu: [],
  },
];

export default navigationConfig;
