import MainRoutes from './Routes.jsx'
import Login from './pages/login/index.jsx'
import NoMatch from './pages/noMatch/index.jsx'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useTitle, useMount, useUpdateEffect, configResponsive } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { ConfigProvider, theme, FloatButton, Popover, Menu, App } from 'antd'
import { BulbOutlined } from '@ant-design/icons'
import './index.css'
import './i18n/i18n.js'
import useIsLoggedIn from './hooks/useIsLoggedIn.jsx'
import LanguageIcon from './assets/language.svg?react'
import { useSystemSettingsStore } from './SystemSettingsStore.jsx'
import WebSocketProvider from './WebSocketProvider.jsx'

configResponsive({
    sm: 768,
    md: 960,
    lg: 1280,
    xl: 1600,
    xxl: 1920
});

const RootApp = () => {
    const { t } = useTranslation()
    useTitle(t('titleText'))
    const { isDarkMode, toggleDarkMode } = useSystemSettingsStore(state => state)
    const themeMode = isDarkMode ? 'darkAlgorithm' : 'defaultAlgorithm'
    const darkModeButton = <FloatButton
        icon={<BulbOutlined />}
        onClick={toggleDarkMode}
    />

    const { i18n } = useTranslation()
    const { language, setLanguage } = useSystemSettingsStore(state => state)
    useMount(() => i18n.changeLanguage(language))
    useUpdateEffect(() => { i18n.changeLanguage(language) }, [i18n, language])
    const items = [
        { label: '中文', key: 'zh' },
        { label: 'ENG', key: 'en' },
        { label: '日本語', key: 'jp' }
    ]
    const languageMenu = <Menu
        style={{ border: 'none' }}
        onClick={({ key }) => setLanguage(key)}
        selectedKeys={[i18n.language]}
        items={items}
    />
    const { token } = theme.useToken()
    const languageButtonIcon = <LanguageIcon style={{ height: 20, width: 20, fill: token.colorInfo }} />
    const languageButton = <Popover content={languageMenu}>
        <FloatButton icon={languageButtonIcon} />
    </Popover>

    const floatButtons = <FloatButton.Group shape="square" style={{ left: 24 }}>
        {darkModeButton}
        {languageButton}
    </FloatButton.Group>

    const [isLoggedIn, setIsLoggedIn, systemState] = useIsLoggedIn()
    const unauthenticatedPages = <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="*" element={<NoMatch />} />
    </Routes>
    const mainPages = <MainRoutes setIsLoggedIn={setIsLoggedIn} systemState={systemState} />
    const router = <HashRouter>
        {isLoggedIn ? mainPages : unauthenticatedPages}
    </HashRouter>
    return <WebSocketProvider>
        <ConfigProvider theme={{ algorithm: theme[themeMode] }}>
            <App>{floatButtons}{router}</App>
        </ConfigProvider>
    </WebSocketProvider>
}
export default RootApp