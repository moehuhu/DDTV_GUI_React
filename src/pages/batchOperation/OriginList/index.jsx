
import RoomInfo from "../RoomInfo"
import useHotkey from "../../../hooks/useHotkey"
import { theme, Spin, Button, Input } from "antd"
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
    useUpdateEffect(() => scrollTo(0), [filteredList])
    const header = () => {
        const wrapper = content => <div className="header" style={{ borderBlockEnd: `1px solid ${token.colorBorderSecondary}` }}>{content}</div>
        if (isLoading) { return wrapper(<Spin spinning={isLoading} style={{ margin: '22px 16px' }} />) }
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

        return wrapper(<>
            <span style={{ margin: '16px' }}>{t('Total')}:{` ${_.size(filteredList)}`}</span>
            {searchBar}
            {hotKeys}
        </>)
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
    const renderOriginListItem = (item, index) => <RoomInfo
        height={responsive.sm ? 75 : 120}
        key={item?.uid}
        item={item}
        selected={selectedSet?.has(item?.uid)}
        onClick={() => select({ item, index }, filteredList)}
        onDoubleClick={() => addToStage([item?.uid])}
        onContextMenu={e => onRightClickItem(e, item)}
        extra={extra(item)}
    />
    const originList = <div
        className="origin-list"
        style={{
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadiusLG,
            height: responsive.md ? 'calc(100% - 64px)' : 'calc(48%)',
            width: responsive.md ? 'calc(50% - 48px)' : 'calc(100% - 32px)'
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