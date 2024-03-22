
import RoomInfo from "../RoomInfo"
import useHotkey from "../../../hooks/useHotkey"
import { theme, Pagination, Spin, Button, Input } from "antd"
import { useUpdateEffect, useVirtualList } from "ahooks"
import { RightOutlined, CheckOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import { useState, useMemo, useRef } from "react"
import _ from 'lodash'
const OriginList = (props) => {
    const { token } = theme.useToken()
    const { setPageState, pageState, isLoading, total, roomInfoList = [], roomListMap = {} } = props
    const { addToStage, stagedSet = {} } = props
    const [selectedUID, setSelectedUID] = useState([]);
    const [lastSelectedUID, setlastSelectedUID] = useState({})
    const removeUID = uid => uids => uids?.filter((UID) => uid != UID)
    const selectedSet = useMemo(() => (new Set(selectedUID)), [selectedUID])

    const { ctrlPressed, shiftPressed, aPressed,
        toggleCtrl, toggleShift, pressA, releaseA }
        = useHotkey(() => setSelectedUID(roomInfoList))
    const select = (item, index) => {
        const uid = item?.uid
        if (ctrlPressed) {
            if (selectedSet?.has(uid)) {
                setSelectedUID(removeUID(uid));
                setlastSelectedUID(uid);
                return
            }
            setSelectedUID(uids => [...uids, uid])
            setlastSelectedUID(uid)
            return
        }
        if (shiftPressed) {
            const lastSelectedIndex = roomInfoList?.findIndex(item => _.isEqual(item, roomListMap[lastSelectedUID]))
            if (lastSelectedIndex < 0) {
                setSelectedUID([uid]);
                setlastSelectedUID(uid)
                return
            }
            const start = lastSelectedIndex > 0 ? _.min([lastSelectedIndex, index]) : 0
            const end = _.max([lastSelectedIndex, index]) + 1
            const selectedSlice = _(roomInfoList).slice(start, end).map(({ uid }) => uid).value()
            setSelectedUID(selectedSlice)
            setlastSelectedUID(uid)
            return
        }
        setlastSelectedUID(uid)
        setSelectedUID([uid])
    }

    const { t } = useTranslation()
    const header = () => {
        const wrapper = content => <div className="header" style={{ borderBlockEnd: `1px solid ${token.colorBorderSecondary}` }}>{content}</div>
        if (isLoading) { return wrapper(<Spin spinning={isLoading} />) }
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
                addToStage(selectedUID)
                setSelectedUID([])
            }}
            type={_.isEmpty(selectedUID) ? 'default' : 'primary'}
            icon={<RightOutlined />}
        />
        const onSearch = (search) => setPageState({ current: 1, searchType: 'Original', search })
        const searchBar = <Input.Search
            defaultValue={pageState.search}
            count={{ max: 16 }}
            style={{ width: 200 }}
            maxLength={16}
            placeholder={t('displayName')}
            allowClear={true}
            onSearch={onSearch}
        />
        return wrapper(<>
            <div className="header-bar">
                {totalItems}
                {searchBar}
                {ctrlButton}
                {aButton}
                {shiftButton}
            </div>
            <div className="add-to-stage">
                {addToStageButton}
            </div>
        </>)
    }

    const staged = uid => stagedSet.has(uid)
    const containerRef = useRef(null);
    const wrapperRef = useRef(null);
    const [list] = useVirtualList(roomInfoList, {
        containerTarget: containerRef,
        wrapperTarget: wrapperRef,
        itemHeight: 75,
        overscan: 20,
    })
    const renderOriginListItem = (item, index) => <RoomInfo
        key={item?.uid}
        onClick={() => select(item, index)}
        onDoubleClick={() => addToStage([item?.uid])}
        item={item}
        selected={selectedSet?.has(item?.uid)}
        extra={staged(item?.uid) ? <CheckOutlined /> : null}
    />

    const originList = <div
        className="origin-list"
        style={{
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadiusLG
        }}>
        {header()}
        <div ref={containerRef} className="list">
            <div ref={wrapperRef}>{list.map(ele => renderOriginListItem(ele.data, ele.index))}</div>
        </div>
    </div>
    return originList
}
export default OriginList