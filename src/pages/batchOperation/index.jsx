import useAutoRec from "../../hooks/useAutoRec"
import useDanmuRec from "../../hooks/useDanmuRec"
import useRemindMe from "../../hooks/useRemindMe"
import useDelRoom from "../../hooks/useDelRoom"
import RoomInfo from "./roomInfo"
import './style.css'
import useDetailedRoomInfoList from "../../hooks/useDetailedRoomInfoList"
import OriginList from "./originList"
import TargetList from "./targetList"
import { useMemo, useState } from "react"
import { useSetState, useAsyncEffect } from "ahooks"
import _ from 'lodash'
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
    const [stagedItems, setStagedItems] = useState([])
    const { stagedUID, stagedMap } = useMemo(() => {
        const stagedUID = []
        const stagedMap = _(stagedItems)
            .map(item => {
                const uid = uidMapper(item)
                stagedUID.push(uid)
                return [uid, item]
            })
            .fromPairs()
            .value()
        return { stagedUID, stagedMap }
    }, [stagedItems])

    const originList = <OriginList
        pageState={pageState}
        isLoading={isLoading}
        total={total}
        roomInfoList={roomInfoList}
        setPageState={setPageState}
        setStagedItems={setStagedItems}
        stagedUID={stagedUID}
        stagedMap={stagedMap}
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