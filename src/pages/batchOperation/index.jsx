import useAutoRec from "../../hooks/useAutoRec"
import useDanmuRec from "../../hooks/useDanmuRec"
import useRemindMe from "../../hooks/useRemindMe"
import useDelRoom from "../../hooks/useDelRoom"
import RoomInfo from "./roomInfo"
import './style.css'
import useDetailedRoomInfoList from "../../hooks/useDetailedRoomInfoList"
import OriginList from "./originList"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSetState, useAsyncEffect, useKeyPress } from "ahooks"
import { List } from "antd"
const BatchOperation = () => {
    const [pageState, setPageState] = useSetState({
        current: 1,
        searchType: 'Originonal',
        search: undefined,
        pageSize: 100,
    })
    const { isLoading, total, roomInfoList, refreshRoomInfoList } = useDetailedRoomInfoList()
    const refreshPage = () => refreshRoomInfoList(pageState)
    useAsyncEffect(refreshPage, [pageState])

    const uidMapper = item => item?.userInfo?.uid
    const [selectedItems, setSelectedItems] = useState([]);
    const selectedUID = useMemo(() => selectedItems?.map(uidMapper), [selectedItems])
    const [stagedItems, setStagedItems] = useState([])
    const stagedUID = useMemo(() => stagedItems?.map(uidMapper), [stagedItems])
    const removeItem = item => items => items?.filter(({ userInfo }) => userInfo?.uid != item?.userInfo?.uid)
    const removeStaged = (item) => {
        if (!stagedUID.includes(item?.userInfo?.uid)) { return }
        setStagedItems(removeItem(item))
    }
    const originList = <OriginList
        pageState={pageState}
        isLoading={isLoading}
        total={total}
        roomInfoList={roomInfoList}
        setPageState={setPageState}
        setSelectedItems={setSelectedItems}
        setStagedItems={setStagedItems}
        selectedUID={selectedUID}
        stagedUID={stagedUID}
    />
    const targetList = <List bordered
        className="target-list"
        dataSource={stagedItems}
        renderItem={item => <RoomInfo onDoubleClick={() => removeStaged(item)} item={item} />} />
    const operationArea = <div className="operation-area">
        {targetList}
    </div>
    return <div className="batch-operation">
        {originList}
        {operationArea}
    </div>
}
export default BatchOperation