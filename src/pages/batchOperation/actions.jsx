import useAutoRec from "../../hooks/useAutoRec"
import useDanmuRec from "../../hooks/useDanmuRec"
import useRemindMe from "../../hooks/useRemindMe"
import useDelRoom from "../../hooks/useDelRoom"
import { Switch, Button, theme } from "antd"
import { useTranslation } from "react-i18next"
const Actions = (props) => {
    const { stagedUID } = props
    const { token } = theme.useToken()
    const { t } = useTranslation()
    const header = <div
        className="header"
        style={{
            borderBlockEnd: `1px solid ${token.colorBorderSecondary}`,
            color: token.colorText
        }}>
        <h4>{t('batchOperation')}</h4>
    </div>
    const actions = <div className="set-rooms">
        <div className="item">
            <label style={{ color: token.colorText }}>{t('recDanmu')}:</label>
            <Switch />
            <Button>{t('Apply')}</Button>
        </div>
        <div className="item">
            <label style={{ color: token.colorText }}>{t('autoRec')}:</label>
            <Switch />
            <Button>{t('Apply')}</Button>
        </div>
        <div className="item">
            <label style={{ color: token.colorText }}>{t('remind')}:</label>
            <Switch />
            <Button>{t('Apply')}</Button>
        </div>
        <div className="item">
            <Button danger type="primary">{t('Delete')}{t('Selected')}</Button>
        </div>
    </div>
    return <div
        className="actions"
        style={{
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadiusLG
        }}>
        {header}
        {actions}
    </div>
}
export default Actions