import './style.css'
import useDetailedRoomInfoList from "../../hooks/useDetailedRoomInfoList"
import OriginList from "./OriginList"
import TargetList from "./TargetList"
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
    const addToStage = (selectedItems = []) => {
        const removedStagedItems = selectedItems?.filter?.(item => {
            const uid = uidMapper(item)
            return !stagedMap[uid]
        })
        setStagedItems(items => [...items, ...removedStagedItems])
    }

    const originList = <OriginList
        pageState={pageState}
        isLoading={isLoading}
        total={total}
        roomInfoList={roomInfoList}
        setPageState={setPageState}
        addToStage={addToStage}
        stagedUID={stagedUID}
        stagedMap={stagedMap}
    />
    const targetList = <TargetList
        setStagedItems={setStagedItems}
        stagedItems={stagedItems}
        stagedUID={stagedUID}
        stagedMap={stagedMap}
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