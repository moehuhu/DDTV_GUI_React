import useAutoRec from "../../hooks/useAutoRec"
import useDanmuRec from "../../hooks/useDanmuRec"
import useRemindMe from "../../hooks/useRemindMe"
import useDelRoom from "../../hooks/useDelRoom"
import { Switch, Button, Popconfirm, theme } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import { useState } from "react"
const Actions = (props) => {
    const { stagedUID, setStagedItems, refreshPage } = props
    const { messageApi } = props
    const messager = (err, res) => {
        if (err) {
            messageApi('error')?.(err)
            return
        }
        if (res) { messageApi('success')?.(res) }
    }
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
        const [err, res] = await (autoRec ? openAutoRec : closeAutoRec)(stagedUID)
        messager(err, res)
    }
    const setAutoRecItem = <div className="item">
        <label style={{ color: token.colorText }}>{t('autoRec')}:</label>
        <Switch onChange={setAutoRec} value={autoRec} />
        <Button loading={setRecLoading} onClick={applyAutoRec}>{t('Apply')}</Button>
    </div>

    const { openDanmuRec, closeDanmuRec, isLoading: setDanmuRecLoading } = useDanmuRec()
    const [recDanmu, setRecDanmu] = useState(false)
    const applyRecDanmu = async () => {
        const [err, res] = await (recDanmu ? openDanmuRec : closeDanmuRec)(stagedUID)
        messager(err, res)
    }
    const setRecDanmuItem = <div className="item">
        <label style={{ color: token.colorText }}>{t('recDanmu')}:</label>
        <Switch onChange={setRecDanmu} value={recDanmu} />
        <Button loading={setDanmuRecLoading} onClick={applyRecDanmu}>{t('Apply')}</Button>
    </div>

    const { openRemindMe, closeRemindMe, isLoading: setRemindLoading } = useRemindMe()
    const [remind, setRemind] = useState(false)
    const applyRemind = async () => {
        const [err, res] = await (remind ? openRemindMe : closeRemindMe)(stagedUID)
        messager(err, res)
    }
    const setRemindItem = <div className="item">
        <label style={{ color: token.colorText }}>{t('remind')}:</label>
        <Switch onChange={setRemind} value={remind} />
        <Button loading={setRemindLoading} onClick={applyRemind}>{t('Apply')}</Button>
    </div>
    const { deleteRooms } = useDelRoom()
    const applyDelete = async () => {
        const [err, res] = await deleteRooms(stagedUID)
        if (err) {
            messager(err, res)
            return
        }
        messager(err, res)
        setStagedItems([])
        refreshPage()
    }
    const deleteItem = <div className="item" style={{ justifyContent: "center" }}>
        <Popconfirm
            key={'delete'}
            title={t('Delete the room')}
            description={t('Are you sure to delete selected rooms?')}
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