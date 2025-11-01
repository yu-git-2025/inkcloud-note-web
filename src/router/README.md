# 路由配置说明

## 文件结构

```
src/router/
├── index.jsx          # 路由配置和工具函数
└── RouterGuard.jsx    # 路由守卫组件
```

## 路由配置

所有路由配置在 `src/router/index.jsx` 中统一管理。

### 路由配置项

每个路由对象包含以下属性：

```javascript
{
  path: '/path',              // 路由路径
  component: Component,       // 路由组件（支持懒加载）
  requireAuth: true,          // 是否需要认证
  title: '页面标题',          // 页面标题
  index: true,                // 是否为 index 路由
  redirect: '/home',          // 重定向路径（可选）
  meta: {                     // 路由元信息
    hideInMenu: false,        // 是否在菜单中隐藏
    icon: 'HomeOutlined',      // 菜单图标名称
  },
  children: [],               // 子路由（可选）
}
```

### 示例

```javascript
{
  path: 'home',
  component: HomePage,
  title: '笔记首页',
  meta: {
    icon: 'HomeOutlined',
  },
}
```

## 工具函数

### `renderRoutes(routesConfig)`

递归渲染路由配置，返回 React Router 的 `<Route>` 组件数组。

### `getRouteByPath(pathname)`

根据路径获取路由配置对象。

### `getMenuRoutes()`

获取所有需要显示在菜单中的路由，用于动态生成导航菜单。

## 使用方法

### 1. 添加新路由

在 `src/router/index.jsx` 的 `routes` 数组中添加路由配置：

```javascript
{
  path: 'new-page',
  component: lazy(() => import('../pages/NewPage')),
  title: '新页面',
  requireAuth: true,
  meta: {
    icon: 'FileOutlined',
  },
}
```

### 2. 使用路由工具函数

```javascript
import { getMenuRoutes, getRouteByPath } from '../router';

// 获取菜单路由
const menuRoutes = getMenuRoutes();

// 根据路径获取路由配置
const route = getRouteByPath('/home');
console.log(route.title); // '笔记首页'
```

## 路由守卫

`RouterGuard` 组件负责：
- 路由懒加载的 Suspense 处理
- 自动应用 `ProtectedRoute` 权限控制
- 404 页面重定向

## 注意事项

1. **懒加载**：所有页面组件都使用 `lazy()` 进行懒加载，提升首屏性能
2. **权限控制**：通过 `requireAuth` 字段控制路由是否需要认证
3. **菜单生成**：菜单项自动从路由配置生成，设置 `hideInMenu: true` 可隐藏
4. **嵌套路由**：支持嵌套路由，通过 `children` 数组配置

