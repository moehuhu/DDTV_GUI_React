import useAutoRec from "../../hooks/useAutoRec"
import useDanmuRec from "../../hooks/useDanmuRec"
import useRemindMe from "../../hooks/useRemindMe"
import useDelRoom from "../../hooks/useDelRoom"
import { Switch, Button, Popconfirm, theme } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import _ from "lodash"
const Actions = (props) => {
    const { t } = useTranslation()
    const { stagedUIDs, setStagedUIDs, refreshPage } = props
    const isNullList = _.isEmpty(stagedUIDs)
    const { message } = props
    const messager = (err, res) => {
        if (err) {
            message('error')?.(err)
            return
        }
        if (res) { message('success')?.({ message: t('Applied') }) }
    }
    const { token } = theme.useToken()
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
        const [err, res] = await (autoRec ? openAutoRec : closeAutoRec)(stagedUIDs)
        messager(err, res)
        refreshPage()
    }
    const setAutoRecItem = <div className="item">
        <label style={{ color: token.colorText }}>{t('autoRec')}:</label>
        <Switch onChange={setAutoRec} value={autoRec} />
        <Button disabled={isNullList} loading={setRecLoading} onClick={applyAutoRec}>{t('Apply')}</Button>
    </div>

    const { openDanmuRec, closeDanmuRec, isLoading: setDanmuRecLoading } = useDanmuRec()
    const [recDanmu, setRecDanmu] = useState(false)
    const applyRecDanmu = async () => {
        const [err, res] = await (recDanmu ? openDanmuRec : closeDanmuRec)(stagedUIDs)
        messager(err, res)
        refreshPage()
    }
    const setRecDanmuItem = <div className="item">
        <label style={{ color: token.colorText }}>{t('recDanmu')}:</label>
        <Switch onChange={setRecDanmu} value={recDanmu} />
        <Button disabled={isNullList} loading={setDanmuRecLoading} onClick={applyRecDanmu}>{t('Apply')}</Button>
    </div>

    const { openRemindMe, closeRemindMe, isLoading: setRemindLoading } = useRemindMe()
    const [remind, setRemind] = useState(false)
    const applyRemind = async () => {
        const [err, res] = await (remind ? openRemindMe : closeRemindMe)(stagedUIDs)
        messager(err, res)
        refreshPage()
    }
    const setRemindItem = <div className="item">
        <label style={{ color: token.colorText }}>{t('remind')}:</label>
        <Switch onChange={setRemind} value={remind} />
        <Button disabled={isNullList} loading={setRemindLoading} onClick={applyRemind}>{t('Apply')}</Button>
    </div>
    const { deleteRooms } = useDelRoom()
    const applyDelete = async () => {
        const [err, res] = await deleteRooms(stagedUIDs)
        if (err) {
            messager(err, res)
            return
        }
        message('success')?.({ message: t('Deleted') })
        setStagedUIDs([])
        refreshPage()
    }
    const deleteItem = <div className="delete-button" style={{ justifyContent: "center" }}>
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
                disabled={isNullList}
                type="primary"
                icon={<DeleteOutlined />}>
                {t('Delete')}{t('Selected')}
            </Button>
        </Popconfirm>,
    </div>
    const applyAll = async () => {
        const [autoRecErr, autoRecRes] = await (autoRec ? openAutoRec : closeAutoRec)(stagedUIDs)
        messager(autoRecErr, autoRecRes)
        const [autoRecDanmuErr, autoRecDanmuRes] = await (recDanmu ? openDanmuRec : closeDanmuRec)(stagedUIDs)
        messager(autoRecDanmuErr, autoRecDanmuRes)
        const [remindErr, remindRes] = await (remind ? openRemindMe : closeRemindMe)(stagedUIDs)
        messager(remindErr, remindRes)
        refreshPage()
    }
    const modifyItems = <div className="items">
        {setAutoRecItem}
        {setRecDanmuItem}
        {setRemindItem}
    </div>
    const applyAllButton = <Button
        className="apply-all-button"
        disabled={isNullList}
        loading={setRecLoading || setDanmuRecLoading || setRemindLoading}
        onClick={applyAll}>
        {t('Apply') + t('All')}
    </Button>
    const options = <div className="set-rooms">
        {modifyItems}
        {applyAllButton}
    </div>
    const allActions = <div className="all-actions">
        {options}
        {deleteItem}
    </div>
    return <div
        className="actions"
        style={{
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadiusLG
        }}>
        {header}
        {allActions}
    </div>
}
export default Actions