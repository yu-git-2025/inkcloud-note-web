import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { renderRoutes } from './index';
import routes from './index';

/**
 * 路由守卫组件
 * 处理路由懒加载和权限控制
 */
const RouterGuard = () => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Spin size="large" />
          <div style={{ marginTop: 16, color: '#999' }}>加载中...</div>
        </div>
      }
    >
      <Routes>
        {renderRoutes(routes)}
        {/* 404 页面 */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Suspense>
  );
};

export default RouterGuard;

