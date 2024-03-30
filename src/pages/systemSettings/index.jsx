import FrontEnd from './FrontendSettings';
import BackEnd from './BackendSettings';
import './style.css'
import { Divider, theme } from 'antd';
import { useTranslation } from "react-i18next";

const Settings = (props) => {
  const { loginStatus } = props
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const color = token.colorText
  const style = { color }
  return <div className="system-settings">
    <h3 style={style}>{t('systemSettings')}</h3>
    <Divider />
    <FrontEnd />
    <Divider />
    <BackEnd loginStatus={loginStatus} />
  </div>
}
export default Settings