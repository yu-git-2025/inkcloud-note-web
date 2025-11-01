import { useState, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Drawer, Button } from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  FolderOutlined,
  TeamOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { getMenuRoutes } from '../router';
import './Layout.css';

const { Header, Sider, Content } = AntLayout;

// 图标映射
const iconMap = {
  HomeOutlined: <HomeOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  FolderOutlined: <FolderOutlined />,
  TeamOutlined: <TeamOutlined />,
  BarChartOutlined: <BarChartOutlined />,
  ThunderboltOutlined: <ThunderboltOutlined />,
  UserOutlined: <UserOutlined />,
  TagOutlined: <TagOutlined />,
};

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // 从路由配置生成菜单项
  const menuItems = useMemo(() => {
    const routes = getMenuRoutes();
    return routes.map((route) => ({
      key: route.key === '/' ? '/home' : route.key,
      icon: route.icon ? iconMap[route.icon] : null,
      label: route.label,
    }));
  }, []);

  const handleMenuClick = ({ key }) => {
    navigate(key);
    setMobileMenuVisible(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: '个人中心',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  // 根据当前路径计算选中的菜单项
  const selectedKey = useMemo(() => {
    const pathname = location.pathname;
    if (pathname === '/') return '/home';
    
    // 找到匹配的路由
    const menuRoutes = getMenuRoutes();
    for (const route of menuRoutes) {
      if (pathname === route.key || pathname.startsWith(route.key + '/')) {
        return route.key === '/' ? '/home' : route.key;
      }
    }
    return '/home';
  }, [location.pathname]);

  return (
    <AntLayout className="app-layout" style={{ minHeight: '100vh' }}>
      {/* 移动端顶部导航 */}
      <div className="mobile-header">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuVisible(true)}
          className="mobile-menu-btn"
        />
        <div className="mobile-logo">
          <HomeOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
          <span>InkCloud Note</span>
        </div>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar
            src={user?.avatar}
            icon={<UserOutlined />}
            className="mobile-avatar"
          />
        </Dropdown>
      </div>

      {/* 桌面端左侧导航 */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className="desktop-sider"
        width={220}
        theme="light"
      >
        <div className="logo">
          <HomeOutlined style={{ color: '#1890ff', fontSize: '24px' }} />
          {!collapsed && <span className="logo-text">InkCloud Note</span>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          className="side-menu"
        />
      </Sider>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title="菜单"
        placement="left"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={220}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Drawer>

        <AntLayout className="content-layout">
        <Content className="main-content">
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;

