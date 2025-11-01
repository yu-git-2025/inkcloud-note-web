import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * 路由守卫组件
 * 用于保护需要认证的路由
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

