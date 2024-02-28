
import RoomInfo from "./roomInfo"
import useHotkey from "../../hooks/useHotkey"
import { List, Pagination, Spin, Button } from "antd"
import { RightOutlined, CheckOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import { useKeyPress, useBoolean, useEventListener } from "ahooks"
import { useState, useMemo } from "react"
import _ from 'lodash'
const OriginList = (props) => {
    const { setPageState, pageState, isLoading, total, roomInfoList = [] } = props
    const { addToStage, stagedMap = {} } = props
    const [selectedItems, setSelectedItems] = useState([]);
    const [lastSelectedItem, setLastSelectedItem] = useState({})
    const removeItem = item => items => items?.filter(({ userInfo }) => userInfo?.uid != item?.userInfo?.uid)
    const uidMapper = item => item?.userInfo?.uid
    const { selectedMap } = useMemo(() => {
        const selectedUID = []
        const selectedMap = _(selectedItems)
            .map(item => {
                const uid = uidMapper(item)
                selectedUID.push(uid)
                return [uid, item]
            })
            .fromPairs()
            .value()
        return { selectedUID, selectedMap }
    }, [selectedItems])

    const { ctrlPressed, shiftPressed, aPressed,
        toggleCtrl, toggleShift, pressA, releaseA }
        = useHotkey(() => setSelectedItems(roomInfoList))
    const selected = item => selectedMap[item?.userInfo?.uid]
    const select = (item, index) => {
        if (ctrlPressed) {
            if (selected(item)) {
                setSelectedItems(removeItem(item));
                setLastSelectedItem(item);
                return
            }
            setSelectedItems(items => [...items, item])
            setLastSelectedItem(item)
            return
        }
        if (shiftPressed) {
            const lastSelectedIndex = _(roomInfoList)
                .findIndex(item => _.isEqual(item, lastSelectedItem))
            if (lastSelectedIndex < 0) {
                setSelectedItems([item]);
                setLastSelectedItem(item)
                return
            }
            const start = lastSelectedIndex > 0 ? _.min([lastSelectedIndex, index]) : 0
            const end = _.max([lastSelectedIndex, index]) + 1
            const selectedSlice = _(roomInfoList).slice(start, end)
            setSelectedItems(selectedSlice)
            setLastSelectedItem(item)
            return
        }
        setLastSelectedItem(item)
        setSelectedItems([item])
    }

    const { t } = useTranslation()
    const header = () => {
        if (isLoading) { return <Spin spinning={isLoading} /> }
        const totalItems = <span>{`${t('Total')}: ${total || 0}`}</span>
        const ctrlButton = <Button
            onClick={toggleCtrl}
            type={ctrlPressed ? 'primary' : 'default'}>
            Ctrl
        </Button>
        const aButton = <Button
            onMouseDown={pressA}
            onMouseUp={releaseA}
            type={aPressed ? 'primary' : 'default'}>
            A
        </Button>
        const shiftButton = <Button
            onClick={toggleShift}
            type={shiftPressed ? 'primary' : 'default'}>
            Shift
        </Button>
        const addToStageButton = <Button
            onClick={() => {
                addToStage(selectedItems)
                setSelectedItems([])
            }}
            type={_.isEmpty(selectedItems) ? 'default' : 'primary'}
            icon={<RightOutlined />}
        />

        return <>
            <div className="header-bar">
                {totalItems}
                {ctrlButton}
                {aButton}
                {shiftButton}
            </div>
            <div className="add-to-stage">
                {addToStageButton}
            </div>
        </>
    }
    const footer = <Pagination
        current={pageState.current}
        pageSize={pageState.pageSize}
        total={total}
        showSizeChanger={false}
        onChange={(current) => { setPageState({ current }) }}
    />

    const staged = item => stagedMap[item?.userInfo?.uid]
    const renderOriginListItem = (item, index) => <RoomInfo
        onClick={() => select(item, index)}
        onDoubleClick={() => addToStage([item])}
        item={item}
        selected={selected(item)}
        extra={staged(item) ? <CheckOutlined /> : null}
    />
    const originList = <List bordered
        header={header()}
        className="origin-list"
        dataSource={roomInfoList}
        footer={footer}
        renderItem={renderOriginListItem} />
    return originList
}
export default OriginList