import Overview from './pages/overview'
import BatchOperation from './pages/batchOperation';
import FileManagement from './pages/fileManagement'
import SystemSettings from './pages/systemSettings'
import NoMatch from './pages/noMatch';
import SystemResource from './SystemResource';
import { useState, useEffect } from "react";
import { useMount, useBoolean, useRafInterval } from 'ahooks';
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { Layout, Menu, theme, Modal, Typography, Popover, Tooltip, QRCode, App } from 'antd';
const { Paragraph, Title } = Typography
import { DesktopOutlined, BlockOutlined, HddOutlined, SettingOutlined, MenuFoldOutlined, ColumnWidthOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';
import { Howl } from 'howler';
import _ from 'lodash'
import startLive from './assets/startLive.mp3'
import useLoginBiliBili from './hooks/useLoginBiliBili';
import useUserAgreement from './hooks/useUserAgreement';
import useWebSocketMessage from './hooks/useWebSocketMessage';
import { Opcode } from './enums';
import './Routes.css'

const { Sider, Content } = Layout;
const ddtv = new URL('../public/DDTV.png', import.meta.url).href
const ddtvGrayscale = new URL('../public/DDTV-grayscale.png', import.meta.url).href

const AppRoutes = ({ setIsLoggedIn, enableSound }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { token } = theme.useToken()
  const { t } = useTranslation()
  const { message, notification } = App.useApp()

  const items = [
    { label: t('overview'), key: '/', icon: <DesktopOutlined /> },
    { label: t('batchOperation'), key: '/batchOperation', icon: <BlockOutlined /> },
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

  const { checkLoginStatus, loginStatus, getLoginURL, loginURL, relogin } = useLoginBiliBili()
  useMount(checkLoginStatus)
  const { agree, checkAgreementState, isAgreed } = useUserAgreement()
  useMount(checkAgreementState)
  const socket = useWebSocketMessage()
  useEffect(() => {
    const startSound = new Howl({ src: [startLive] })
    const reminder = (data) => {
      const { Name, Title: { Value }, UID, RoomId } = data
      const url = 'https://live.bilibili.com/' + RoomId
      const roomInfo = {
        message: `${Name} (${UID})`,
        description: <a onClick={() => window.open(url)}>{Value}</a>,
        placement: 'bottomRight',
        duration: 10,
        stack: false
      }
      notification.info(roomInfo)
      enableSound && startSound.play();
    }
    socket.addEventListener(Opcode.StartBroadcastingReminder, reminder)
    return () => { socket.removeEventListener(Opcode.StartBroadcastingReminder, reminder); startSound.unload() }
  }, [notification, socket, t, enableSound])
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
    if (!open) { return }
    const [reloginErr] = await relogin()
    if (reloginErr) {
      message.error(reloginErr?.message)
      setDisplayQrcode(false)
      return
    }
    const [getUrlErr] = await getLoginURL()
    if (getUrlErr) {
      message.error(getUrlErr?.message)
      setDisplayQrcode(false)
    }
  }
  const QRcode = <QRCode
    icon={ddtv}
    bordered={false}
    value={loginURL || 'https://www.bilibili.com'}
    status={loginURL ? 'active' : 'loading'}
  />
  const siderHeader = <Popover
    content={QRcode}
    overlayInnerStyle={{ padding: 0 }}
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
    style={{ height: '100vh', alignItems: 'center' }}>
    {siderHeader}
    <Menu
      theme="light"
      onClick={onClick}
      selectedKeys={[pathname]}
      mode="inline"
      items={items}
    />
    <SystemResource />
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
    <Route path="/" element={<Overview />} />
    <Route path='/batchOperation' element={<BatchOperation />} />
    <Route path="/fileManagement" element={<FileManagement />} />
    <Route path="/systemSettings" element={<SystemSettings loginStatus={loginStatus} />} />
    <Route path="*" element={<NoMatch />} />
  </Routes>

  return <Layout>
    {agreeModal}
    {sider}
    {contentWrapper(routes)}
  </Layout>
}

export default AppRoutes
