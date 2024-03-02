import useAutoRec from "../../hooks/useAutoRec"
import useDanmuRec from "../../hooks/useDanmuRec"
import useRemindMe from "../../hooks/useRemindMe"
import useDelRoom from "../../hooks/useDelRoom"
import { Switch, Button, Popconfirm, theme } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import to from "await-to-js"
const Actions = (props) => {
    const { stagedUID, setStagedItems, refreshPage } = props
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

    const { openAutoRec, closeAutoRec, isLoading: setRecLoading } = useAutoRec()
    const [autoRec, setAutoRec] = useState(false)
    const applyAutoRec = async () => {
        const [err, res] = await to((autoRec ? openAutoRec : closeAutoRec)?.(stagedUID))
    }
    const setAutoRecItem = <div className="item">
        <label style={{ color: token.colorText }}>{t('autoRec')}:</label>
        <Switch onChange={setAutoRec} value={autoRec} />
        <Button loading={setRecLoading} onClick={applyAutoRec}>{t('Apply')}</Button>
    </div>

    const { openDanmuRec, closeDanmuRec, isLoading: setDanmuRecLoading } = useDanmuRec()
    const [recDanmu, setRecDanmu] = useState(false)
    const applyRecDanmu = async () => {
        const [err, res] = await to((recDanmu ? openDanmuRec : closeDanmuRec)?.(stagedUID))
    }
    const setRecDanmuItem = <div className="item">
        <label style={{ color: token.colorText }}>{t('recDanmu')}:</label>
        <Switch onChange={setRecDanmu} value={recDanmu} />
        <Button loading={setDanmuRecLoading} onClick={applyRecDanmu}>{t('Apply')}</Button>
    </div>

    const { openRemindMe, closeRemindMe, isLoading: setRemindLoading } = useRemindMe()
    const [remind, setRemind] = useState(false)
    const applyRemind = async () => {
        const [err, res] = await to((remind ? openRemindMe : closeRemindMe)?.(stagedUID))
    }
    const setRemindItem = <div className="item">
        <label style={{ color: token.colorText }}>{t('remind')}:</label>
        <Switch onChange={setRemind} value={remind} />
        <Button loading={setRemindLoading} onClick={applyRemind}>{t('Apply')}</Button>
    </div>
    const { deleteRooms, isLoading: deleting } = useDelRoom()
    const applyDelete = async () => {
        const [err, res] = await to(deleteRooms(stagedUID))
        if (err) { return }
        setStagedItems([])
        refreshPage()
    }
    const deleteItem = <div className="item" style={{ justifyContent: "center" }}>
        <Popconfirm
            key={'delete'}
            title={t('Delete the room')}
            description={t('Are you sure to delete this room?')}
            onConfirm={applyDelete}
            okText={t('Confirm')}
            okButtonProps={{ danger: true }}
            showCancel={false}>
            <Button
                danger
                type="primary"
                icon={<DeleteOutlined />}>
                {t('Delete')}{t('Selected')}
            </Button>
        </Popconfirm>,
    </div>
    const actions = <div className="set-rooms">
        {setAutoRecItem}
        {setRecDanmuItem}
        {setRemindItem}
        {deleteItem}
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