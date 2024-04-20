import MainRoutes from './Routes.jsx'
import Login from './pages/login/index.jsx'
import NoMatch from './pages/noMatch/index.jsx'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { useTitle, useTimeout, useMount, useUpdateEffect, configResponsive } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { ConfigProvider, theme, FloatButton, Popover, Tooltip, Menu, App } from 'antd'
import { BulbOutlined, MutedOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Howl } from 'howler'
import './index.css'
import './i18n/i18n.js'
import useIsLoggedIn from './hooks/useIsLoggedIn.jsx'
import LanguageIcon from './assets/language.svg?react'
import { useSystemSettingsStore } from './SystemSettingsStore.jsx'
import WebSocketProvider from './WebSocketProvider.jsx'
import startLive from './assets/startLive.mp3'
import endLive from './assets/endLive.mp3'
const startSound = new Howl({ src: [startLive] })
const endSound = new Howl({ src: [endLive] })

configResponsive({
    sm: 768,
    md: 960,
    lg: 1280,
    xl: 1600,
    xxl: 1920
});

const RootApp = () => {
    const { t } = useTranslation()
    const { token } = theme.useToken()
    useTitle(t('titleText'))

    const [enableSound, setEnableSound] = useState(false)
    const [isInitialTips, setIsInitialTips] = useState(true)
    const onClickSound = () => {
        setIsInitialTips(false)
        if (!enableSound) { startSound.play() }
        if (enableSound) { endSound.play() }
        setEnableSound(!enableSound)
    }
    const [displaySoundTip, setDisplaySoundTip] = useState(true)
    const clearTimeout = useTimeout(() => setDisplaySoundTip(false), 10000)
    const setOpen = (open) => {
        if (!open) { clearTimeout() }
        setIsInitialTips(false)
        setDisplaySoundTip(open)
    }
    const disableTips = isInitialTips ?
        t("Click here to enable beeps. Due to browser security policy restrictions, you need to enable it again when you re-enter the page.")
        : t('Disable Beeps')
    const soundButton = <Tooltip
        open={displaySoundTip}
        onOpenChange={setOpen}
        placement='right'
        color={enableSound ? token.colorInfo : token.colorBgMask}
        title={enableSound ? t('Enable Beeps') : disableTips}>
        <FloatButton
            icon={<MutedOutlined style={{ color: enableSound ? token.colorInfo : undefined }} />}
            onClick={onClickSound}
        />
    </Tooltip >

    const { isDarkMode, toggleDarkMode } = useSystemSettingsStore(state => state)
    const themeMode = isDarkMode ? 'darkAlgorithm' : 'defaultAlgorithm'
    const darkModeButton = <FloatButton
        icon={<BulbOutlined style={{ color: isDarkMode ? undefined : token.colorInfo }} />}
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

    const languageButtonIcon = <LanguageIcon style={{ height: 20, width: 20, fill: token.colorInfo }} />
    const languageButton = <Popover content={languageMenu}>
        <FloatButton icon={languageButtonIcon} />
    </Popover>

    const floatButtons = <FloatButton.Group shape="square" style={{ left: 24 }}>
        {soundButton}
        {darkModeButton}
        {languageButton}
    </FloatButton.Group>

    const [isLoggedIn, setIsLoggedIn, systemState, heartBeatStatus] = useIsLoggedIn()
    const unauthenticatedPages = <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="*" element={<NoMatch />} />
    </Routes>
    const mainPages = <MainRoutes
        setIsLoggedIn={setIsLoggedIn}
        enableSound={enableSound}
        systemState={systemState}
        heartBeatStatus={heartBeatStatus}
    />
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