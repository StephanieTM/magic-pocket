import React, { useEffect } from 'react';
import ReactDom from 'react-dom';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Provider, useDispatch } from 'react-redux';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import zhCN from 'antd/lib/locale/zh_CN';
import { configAxios } from './config/axios-config';
import { Dispatch, store } from './store';
import AppLayout from './layout';
import './index.less';

configAxios();
dayjs.locale('zh-cn');

function App(): JSX.Element {
  const isMobile = useMediaQuery({ query: '(max-width: 540px)' });
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.global.setIsMobile(isMobile);
  }, [dispatch.global, isMobile]);

  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router basename="/magic-pocket">
          <AppLayout />
        </Router>
      </ConfigProvider>
    </Provider>
  );
}

function WrappedApp(): JSX.Element {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

const HotApp = hot(WrappedApp);

ReactDom.render(
  <HotApp />,
  document.getElementById('app')
);
