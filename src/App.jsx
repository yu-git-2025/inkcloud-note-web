import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { store } from './store';
import RouterGuard from './router/RouterGuard';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <BrowserRouter>
          <RouterGuard />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
