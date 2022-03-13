import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import routes from "./pages/routes";
import './App.css';
import { useSelector } from 'react-redux';

const { Header, Content, Footer } = Layout;

function App() {
  const test = useSelector((state) => state);
  console.log("State >> ", test)
  return (
    <Router>
      <Switch>
        <Layout>
          <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
              <Menu.Item key="1">
                <Link
                  to={{
                    pathname: "/",
                  }}
                />Trang chủ
              </Menu.Item>
              <Menu.Item key="2">
                <a href="/khuyen-mai/coupon.html">DANH SÁCH COUPON ĐANG MỞ</a>
              </Menu.Item>
              <Menu.Item key="3">
                <a href="/khuyen-mai/voucher.html">SĂN MÃ KHUyẾN MÃI</a>
              </Menu.Item>
              <Menu.Item key="4">

                <Link
                  to={{
                    pathname: "/gioi-thieu",
                  }}
                />Giới thiệu
              </Menu.Item>
            </Menu>
          </Header>
          <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              {/* <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item> */}
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 380, height: "80vh" }}>

              {routes.map(({ component: Component, key, path, ...rest }) => {
                return <Route
                  key={key}
                  path={path}
                  component={Component}
                  {...rest} />
              })}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Bản quyền thuộc về Tu Van</Footer>
        </Layout>
      </Switch>
    </Router >
  );
}

export default App;
