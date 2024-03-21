
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
                addToStage(selectedItems)
                setSelectedItems([])
            }}
            type={_.isEmpty(selectedItems) ? 'default' : 'primary'}
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
    const footer = <div className="footer" style={{ borderBlockStart: `1px solid ${token.colorBorderSecondary}` }}>
        <Pagination
            current={pageState.current}
            pageSize={pageState.pageSize}
            locale={{
                items_per_page: t('itemsPerPage'),
                jump_to: t('jumpTo'),
                jump_to_confirm: t('jumpToConfirm'),
                page: t('Page'),
                prev_page: t('prevPage'),
                next_page: t('nextPage'),
                prev_5: t('prev5'),
                next_5: t('next5'),
                prev_3: t('prev3'),
                next_3: t('next3'),
                page_size: t('PageSize')
            }}
            total={total}
            showSizeChanger={false}
            showQuickJumper
            onChange={(current) => { setPageState({ current }) }}
        />
    </div>

    const staged = item => stagedMap[item?.userInfo?.uid]
    const containerRef = useRef(null);
    const wrapperRef = useRef(null);
    const [list, scrollTo] = useVirtualList(roomInfoList, {
        containerTarget: containerRef,
        wrapperTarget: wrapperRef,
        itemHeight: 75,
        overscan: 20,
    })
    useUpdateEffect(() => { setSelectedItems([]); scrollTo(0); }, [roomInfoList])
    const renderOriginListItem = (item, index) => <RoomInfo
        key={uidMapper(item)}
        onClick={() => select(item, index)}
        onDoubleClick={() => addToStage([item])}
        item={item}
        selected={selected(item)}
        extra={staged(item) ? <CheckOutlined /> : null}
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
        {footer}
    </div>
    return originList
}
export default OriginList