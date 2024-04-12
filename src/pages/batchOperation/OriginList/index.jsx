
import RoomInfo from "../RoomInfo"
import useHotkey from "../../../hooks/useHotkey"
import { theme, Skeleton, Button, Input } from "antd"
import { useVirtualList, useUpdateEffect, useResponsive, } from "ahooks"
import { CheckOutlined, PlusOutlined } from "@ant-design/icons"
import { useTranslation } from "react-i18next"
import { useState, useMemo, useRef } from "react"
import _ from 'lodash'
import RightClickWrapper from "./RightClickProvider"

const OriginList = (props) => {
    const { token } = theme.useToken()
    const { setSearch, search, isLoading, filteredList = [], roomListMap = {} } = props
    const { addToStage, stagedSet = {} } = props
    const [selectedUID, setSelectedUID] = useState([]);
    const [lastSelectedUID, setlastSelectedUID] = useState({})
    const removeUID = uid => uids => uids?.filter((UID) => uid != UID)
    const selectedSet = useMemo(() => (new Set(selectedUID)), [selectedUID])

    const { ctrlPressed, shiftPressed, aPressed,
        toggleCtrl, toggleShift, pressA, releaseA }
        = useHotkey(() => setSelectedUID(filteredList?.map(({ uid }) => uid)) | [])
    const select = ({ item, index }, roomInfoList) => {
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
    const containerRef = useRef(null);
    const wrapperRef = useRef(null);
    const responsive = useResponsive();
    const [list, scrollTo] = useVirtualList(filteredList, {
        containerTarget: containerRef,
        wrapperTarget: wrapperRef,
        itemHeight: responsive.sm ? 75 : 120,
        overscan: 20,
    })
    useUpdateEffect(() => scrollTo(0), [filteredList.length])
    const header = () => {
        const onSearch = (search) => setSearch(search)
        const searchBar = <Input.Search
            defaultValue={search}
            count={{ max: 16 }}
            style={{ width: 250, margin: '0px 16px' }}
            maxLength={16}
            placeholder={`${t('displayName')}/${t('uid')}/${t('roomID')}`}
            allowClear={true}
            onSearch={onSearch}
        />
        const style = {
            margin: '0px 16px 0px 0px'
        }
        const ctrlButton = <Button
            style={style}
            onClick={toggleCtrl}
            type={ctrlPressed ? 'primary' : 'default'}>
            Ctrl
        </Button>
        const aButton = <Button
            style={style}
            onMouseDown={pressA}
            onMouseUp={releaseA}
            type={aPressed ? 'primary' : 'default'}>
            A
        </Button>
        const shiftButton = <Button
            style={style}
            onClick={toggleShift}
            type={shiftPressed ? 'primary' : 'default'}>
            Shift
        </Button>
        const hotKeys = <div className="hot-keys" style={{ margin: '16px' }}>
            {ctrlButton}
            {aButton}
            {shiftButton}
        </div>

        return <div className="header" style={{ borderBlockEnd: `1px solid ${token.colorBorderSecondary}` }}>
            <span style={{ margin: '16px' }}>{t('Total')}:{` ${_.size(filteredList)}`}</span>
            {searchBar}
            {hotKeys}
        </div>
    }

    const staged = uid => stagedSet.has(uid)
    const onClickItem = (item) => {
        selectedSet.has(item?.uid) ? addToStage(selectedUID) : addToStage([item?.uid])
        setSelectedUID([])
    }
    const onRightClickItem = (e, item) => {
        if (selectedSet.has(item?.uid)) { return }
        setSelectedUID([item?.uid])
    }

    const extra = item => staged(item?.uid) ?
        <CheckOutlined style={{ color: token.colorText }} />
        : <PlusOutlined
            onClick={() => onClickItem(item)}
            style={{ color: token.colorText, cursor: 'pointer' }}
        />
    const renderOriginListItem = (item, index) => <Skeleton key={item?.uid} style={{ padding: token.paddingLG }} loading={isLoading}>
        <RoomInfo
            height={responsive.sm ? 75 : 120}
            item={item}
            selected={selectedSet?.has(item?.uid)}
            onClick={() => select({ item, index }, filteredList)}
            onDoubleClick={() => addToStage([item?.uid])}
            onContextMenu={e => onRightClickItem(e, item)}
            extra={extra(item)}
        />
    </Skeleton>
    const originList = <div
        className="origin-list"
        style={{
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadiusLG,
            height: responsive.md ? 'calc(100% - 40px)' : 'calc(800px - 40px)',
            margin: responsive.md ? undefined : '14px 0px 16px 0px',
            width: responsive.md ? 'calc(50% - 32px)' : 'calc(100% - 24px)'
        }}>
        {header()}
        <RightClickWrapper
            {...props}
            setSelectedUID={setSelectedUID}
            selectedUID={selectedUID}>
            <div ref={containerRef} className="list">
                <div ref={wrapperRef}>{list.map(ele => renderOriginListItem(ele.data, ele.index))}</div>
            </div>
        </RightClickWrapper>
    </div>
    return originList
}
export default OriginList