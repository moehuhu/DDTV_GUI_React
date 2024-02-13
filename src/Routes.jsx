import RoomList from './pages/roomList'
import FileManagement from './pages/fileManagement'
import SystemSettings from './pages/systemSettings'
import { useState } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { Layout, Menu, theme } from 'antd';
import { DesktopOutlined, HddOutlined, SettingOutlined, MenuFoldOutlined, ColumnWidthOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import _ from 'lodash'
const { Sider, Content } = Layout;
const ddtv = new URL('../public/DDTV.png', import.meta.url).href

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();
  const { t } = useTranslation()

  const items = [
    { label: t('overview'), key: '/', icon: <DesktopOutlined /> },
    { label: t('fileManagement'), key: '/fileManagement', icon: <HddOutlined /> },
    { label: t('systemSettings'), key: '/systemSettings', icon: <SettingOutlined /> },
    { label: t('collapseTheSidebar'), key: 'collapse', icon: collapsed ? <ColumnWidthOutlined /> : <MenuFoldOutlined /> }
  ]
  const onClick = ({ key }) => {
    if (_.isEqual(key, 'collapse')) {
      setCollapsed(!collapsed)
      return
    }
    navigate(key)
  }
  const sider = <Sider
    collapsed={collapsed}
    theme="light"
    style={{ height: '100vh' }}
  >
    <img src={ddtv} height={48} style={{ margin: 16 }} />
    <Menu
      theme="light"
      onClick={onClick}
      selectedKeys={[pathname]}
      mode="inline"
      items={items}
    />
  </Sider>

  const contentWrapper = (content) => <Content
    style={{
      background: colorBgContainer,
      margin: '1vh',
      height: '98vh',
      overflow: 'hidden',
      borderRadius: borderRadiusLG
    }}>
    {content}
  </Content>

  const routes = <Routes>
    <Route path="/" element={<RoomList />} />
    <Route path="/fileManagement" element={<FileManagement />} />
    <Route path="/systemSettings" element={<SystemSettings />} />
  </Routes>

  return <Layout>
    {sider}
    {contentWrapper(routes)}
  </Layout>
}

export default App
