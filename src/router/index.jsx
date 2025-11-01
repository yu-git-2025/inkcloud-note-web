import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../utils/ProtectedRoute';
import Layout from '../components/Layout';

// 页面组件懒加载
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const HomePage = lazy(() => import('../pages/HomePage'));
const NoteEditPage = lazy(() => import('../pages/NoteEditPage'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const TagPage = lazy(() => import('../pages/TagPage'));
const FriendPage = lazy(() => import('../pages/FriendPage'));
const ChatPage = lazy(() => import('../pages/ChatPage'));
const StatisticsPage = lazy(() => import('../pages/StatisticsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const VersionHistoryPage = lazy(() => import('../pages/VersionHistoryPage'));

/**
 * 路由配置
 * @param {string} path - 路由路径
 * @param {React.Component} component - 路由组件
 * @param {boolean} requireAuth - 是否需要认证
 * @param {string} title - 页面标题
 * @param {object} meta - 路由元信息
 */
export const routes = [
  // 公开路由（无需认证）
  {
    path: '/login',
    component: LoginPage,
    requireAuth: false,
    title: '登录',
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: '/register',
    component: RegisterPage,
    requireAuth: false,
    title: '注册',
    meta: {
      hideInMenu: true,
    },
  },
  // 需要认证的路由
  {
    path: '/',
    component: Layout,
    requireAuth: true,
    children: [
      {
        path: '',
        index: true,
        redirect: '/home',
      },
      {
        path: 'home',
        component: HomePage,
        title: '笔记首页',
        meta: {
          icon: 'HomeOutlined',
        },
      },
      {
        path: 'note/edit/:noteId?',
        component: NoteEditPage,
        title: '编辑笔记',
        meta: {
          hideInMenu: true,
        },
      },
      {
        path: 'category',
        component: CategoryPage,
        title: '分类管理',
        meta: {
          icon: 'FolderOutlined',
        },
      },
      {
        path: 'tag',
        component: TagPage,
        title: '标签管理',
        meta: {
          icon: 'TagOutlined',
        },
      },
      {
        path: 'friend',
        component: FriendPage,
        title: '好友列表',
        meta: {
          icon: 'TeamOutlined',
        },
      },
      {
        path: 'chat/:friendId?',
        component: ChatPage,
        title: '聊天',
        meta: {
          hideInMenu: true,
        },
      },
      {
        path: 'statistics',
        component: StatisticsPage,
        title: '数据统计',
        meta: {
          icon: 'BarChartOutlined',
        },
      },
      {
        path: 'profile',
        component: ProfilePage,
        title: '个人中心',
        meta: {
          icon: 'UserOutlined',
        },
      },
      {
        path: 'version/:noteId',
        component: VersionHistoryPage,
        title: '版本历史',
        meta: {
          hideInMenu: true,
        },
      },
    ],
  },
];

/**
 * 递归渲染路由
 */
export const renderRoutes = (routesConfig) => {
  return routesConfig.map((route, index) => {
    const { path, component: Component, requireAuth, children, redirect, index: isIndex } = route;

    // 如果有重定向（主要用于 index 路由）
    if (redirect) {
      return (
        <Route
          key={`redirect-${index}`}
          index={isIndex !== undefined ? isIndex : true}
          element={<Navigate to={redirect === true ? '/home' : redirect} replace />}
        />
      );
    }

    // 如果有子路由
    if (children && children.length > 0) {
      return (
        <Route
          key={path || index}
          path={path}
          element={
            requireAuth ? (
              <ProtectedRoute>
                <Component />
              </ProtectedRoute>
            ) : (
              <Component />
            )
          }
        >
          {renderRoutes(children)}
        </Route>
      );
    }

    // 普通路由
    return (
      <Route
        key={path || index}
        path={path}
        index={isIndex}
        element={
          requireAuth ? (
            <ProtectedRoute>
              <Component />
            </ProtectedRoute>
          ) : (
            <Component />
          )
        }
      />
    );
  });
};

/**
 * 根据路径获取路由配置
 */
export const getRouteByPath = (pathname) => {
  const findRoute = (routesList, path) => {
    for (const route of routesList) {
      if (route.path === path || (route.path && pathname.startsWith(route.path))) {
        return route;
      }
      if (route.children) {
        const found = findRoute(route.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  return findRoute(routes, pathname);
};

/**
 * 获取所有菜单路由（用于导航菜单）
 */
export const getMenuRoutes = () => {
  const getMenuItems = (routesList) => {
    return routesList
      .filter((route) => !route.meta?.hideInMenu && route.title)
      .map((route) => ({
        key: route.path,
        label: route.title,
        icon: route.meta?.icon,
        children: route.children ? getMenuItems(route.children) : undefined,
      }));
  };

  // 找到 Layout 路由的子路由
  const layoutRoute = routes.find((route) => route.path === '/');
  return layoutRoute?.children ? getMenuItems(layoutRoute.children) : [];
};

export default routes;

