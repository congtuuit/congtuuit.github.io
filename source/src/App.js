import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from 'antd';
import routes from "./pages/routes";
import './App.css';
import { useSelector } from 'react-redux';

const { Header, Content, Footer } = Layout;

function App() {
  const test = useSelector((state) => state);
  console.log("State >> ", test)
  return (
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">Trang chủ</Menu.Item>
          <Menu.Item key="2">Mã giảm giá</Menu.Item>
          <Menu.Item key="3">Bài viết</Menu.Item>
          <Menu.Item key="4">Giới thiệu</Menu.Item>
        </Menu>
      </Header>
      <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
          <Router>
            <Switch>
              {routes.map(({ component: Component, key, path, ...rest }) => {
                return <Route
                  key={key}
                  path={path}
                  component={Component}
                  {...rest} />
              })}
            </Switch>
          </Router>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Bản quyền thuộc về Tu Van</Footer>
    </Layout>
  );
}

export default App;
