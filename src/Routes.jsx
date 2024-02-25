import RoomList from './pages/roomList'
import FileManagement from './pages/fileManagement'
import SystemSettings from './pages/systemSettings'
import { useState } from "react";
import { useMount, useBoolean, useRafInterval, useInterval } from 'ahooks';
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { Layout, Menu, theme, Modal, Typography, Popover, Tooltip, Spin } from 'antd';
const { Paragraph, Title } = Typography
import { DesktopOutlined, HddOutlined, SettingOutlined, MenuFoldOutlined, ColumnWidthOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import _ from 'lodash'
import useLoginBiliBili from './hooks/useLoginBiliBili';
import useUserAgreement from './hooks/useUserAgreement';

const { Sider, Content } = Layout;
const ddtv = new URL('../public/DDTV.png', import.meta.url).href
const ddtvGrayscale = new URL('../public/DDTV-grayscale.png', import.meta.url).href

const App = ({ setIsLoggedIn, systemState }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { token } = theme.useToken()
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

  const { checkLoginStatus, loginStatus, getQrcode, loginQrcodeImageURL, relogin } = useLoginBiliBili({
    loginSuccess: () => window.location.reload()
  })
  const { agree, checkAgreementState, isAgreed } = useUserAgreement()
  useInterval(checkLoginStatus, loginStatus ? 15000 : 5000, { immediate: true })
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
      <Title level={5}>使用须知</Title>
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
  const disconnectedSrc = blink ? ddtv : ddtvGrayscale
  const connectedSrc = ddtv
  const ddtvLogo = <img
    src={loginStatus ? connectedSrc : disconnectedSrc}
    style={{ cursor: loginStatus ? 'default' : 'pointer', margin: token.margin }}
    height={48}
  />

  const [displayStatus, setDisplayStatus] = useState(false)
  const [displayQrcode, setDisplayQrcode] = useState(false)

  const tipsDisplay = () => {
    if (loginStatus) { return displayStatus }
    if (displayQrcode) { return false }
    return displayStatus || (loginStatus === false)
  }
  const tipsLogo = <Tooltip
    placement='right'
    title={loginStatus === null ? t('Loading') : (loginStatus ? t('LoggedIn') : t('NotLoggedIn'))}
    open={tipsDisplay()}
    onOpenChange={setDisplayStatus}
  >
    {ddtvLogo}
  </Tooltip >
  const onClickLogo = async (open) => {
    if (loginStatus || loginStatus === null) {
      setDisplayQrcode(false)
      return
    }
    setDisplayQrcode(open)
    setDisplayStatus(false)
    if (open) {
      await relogin()
      await getQrcode()
    }
  }

  const QRcode = loginQrcodeImageURL ? <img src={loginQrcodeImageURL} /> : <Spin />
  const siderHeader = <Popover
    content={QRcode}
    placement='rightTop'
    open={(!loginStatus) && displayQrcode}
    onOpenChange={onClickLogo}
    trigger='click'
  >
    {tipsLogo}
  </Popover>
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
      background: token.colorBgContainer,
      margin: '1vh',
      height: '98vh',
      overflow: 'hidden',
      borderRadius: token.borderRadiusLG
    }}>
    {content}
  </Content>

  const routes = <Routes>
    <Route path="/" element={<RoomList />} />
    <Route path="/fileManagement" element={<FileManagement />} />
    <Route path="/systemSettings" element={<SystemSettings />} />
  </Routes>

  return <Layout>
    {agreeModal}
    {sider}
    {contentWrapper(routes)}
  </Layout>
}

export default App
