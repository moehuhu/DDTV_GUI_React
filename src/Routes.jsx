import RoomList from './pages/roomList'
import FileManagement from './pages/fileManagement'
import SystemSettings from './pages/systemSettings'
import { useState } from "react";
import { useMount, useBoolean, useRafInterval } from 'ahooks';
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { Layout, Menu, theme, Modal, Typography, Badge } from 'antd';
const { Paragraph, Title } = Typography
import { DesktopOutlined, HddOutlined, SettingOutlined, MenuFoldOutlined, ColumnWidthOutlined, CloudOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import _ from 'lodash'
import useLoginBiliBili from './hooks/useLoginBiliBili';
import useUserAgreement from './hooks/useUserAgreement';

const { Sider, Content } = Layout;
const ddtv = new URL('../public/DDTV.png', import.meta.url).href

const App = ({ setIsLoggedIn }) => {
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

  const { checkLoginStatus, loginStatus, getQrcode, loginURL } = useLoginBiliBili()
  const { agree, checkAgreementState, isAgreed } = useUserAgreement()
  useMount(checkLoginStatus)
  useMount(checkAgreementState)
  const onConfirm = () => agree('y')
  const onCancel = () => setIsLoggedIn(false)
  const agreeModal = <Modal
    closeIcon={null}
    okText={t('Confirm')}
    cancelText={t('Cancel')}
    onOk={onConfirm}
    onCancel={onCancel}
    open={!isAgreed}>
    <Typography>
      <Title>使用须知</Title>
      <Paragraph>
        <ol>
          <li>在使用本软件的过程中的产生的任何资料、数据等所有数据都归属原所有者。</li>
          <li>本软件所使用的所有资源，以及服务，均搜集自互联网，版权属于相应的个体，我们只是基于互联网使用了公开的资源进行开发。</li>
          <li>本软件所登陆的阿B账号仅保存在您本地，且只会用于和阿B的服务接口交互。</li>
        </ol>
      </Paragraph>
      <Paragraph>如果您了解且同意以上内容，请按{t('Confirm')}进入登陆流程，按{t('Cancel')}退出。</Paragraph>
    </Typography>
  </Modal>

  const [blink, { toggle }] = useBoolean(false)
  useRafInterval(toggle, 1000)
  const blinkColor = blink ? 'red' : 'gray'
  const connectedColor = 'green'
  const siderHeader = <Badge.Ribbon
    style={{ cursor: 'pointer' }}
    text={<CloudOutlined />}
    color={loginStatus ? connectedColor : blinkColor}>
    <img src={ddtv} height={48} style={{ margin: 16 }} />
  </Badge.Ribbon>

  const sider = <Sider
    collapsed={collapsed}
    theme="light"
    style={{ height: '100vh' }}>
    {siderHeader}
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
    {agreeModal}
    {contentWrapper(routes)}
  </Layout>
}

export default App
