import useAutoRec from "../../hooks/useAutoRec"
import useDanmuRec from "../../hooks/useDanmuRec"
import useRemindMe from "../../hooks/useRemindMe"
import useDelRoom from "../../hooks/useDelRoom"
import RoomInfo from "./roomInfo"
import './style.css'
import useDetailedRoomInfoList from "../../hooks/useDetailedRoomInfoList"
import OriginList from "./originList"
import { useMemo, useState } from "react"
import { useSetState, useAsyncEffect } from "ahooks"
import { List } from "antd"
import TargetList from "./targetList"
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
    const targetList = <TargetList
        setStagedItems={setStagedItems}
        stagedItems={stagedItems}
        stagedUID={stagedUID}
    />
    const operationArea = <div className="operation-area">
        {targetList}
    </div>
    return <div className="batch-operation">
        {originList}
        {operationArea}
    </div>
}
export default BatchOperation