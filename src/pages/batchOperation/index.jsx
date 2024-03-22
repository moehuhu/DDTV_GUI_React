import './style.css'
import useDetailedRoomInfoList from "../../hooks/useDetailedRoomInfoList"
import OriginList from "./OriginList"
import TargetList from "./TargetList"
import Actions from "./actions.jsx"
import { useMemo, useState } from "react"
import { useSetState, useAsyncEffect } from "ahooks"
import { App } from 'antd'
import _ from 'lodash'
const BatchOperation = () => {
    const { notification } = App.useApp()
    const [pageState, setPageState] = useSetState({
        current: 1,
        searchType: 'Original',
        search: undefined,
    })
    const message = type => msg => notification[type]({
        ...msg,
        placement: 'bottomRight',
        duration: 2
    })
    const refreshPage = async () => {
        const [err, res] = await refreshRoomInfoList(pageState)
        if (err) { message.error(err?.message) }
        return [err, res]
    }
    useAsyncEffect(refreshPage, [pageState])

    const { isLoading, total, roomInfoList, refreshRoomInfoList } = useDetailedRoomInfoList()
    const roomListMap = useMemo(() => _(roomInfoList).map(item => [item?.uid, item]).fromPairs().value(), [roomInfoList])

    const [stagedUIDs, setStagedUIDs] = useState([])
    const stagedSet = useMemo(() => new Set(stagedUIDs), [stagedUIDs])

    const addToStage = (selectedItems = []) => {
        const removedstagedUIDs = selectedItems?.filter?.(uid => !stagedSet.has(uid))
        setStagedUIDs(items => [...items, ...removedstagedUIDs])
    }

    const originList = <OriginList
        pageState={pageState}
        isLoading={isLoading}
        total={total}
        roomInfoList={roomInfoList}
        roomListMap={roomListMap}
        setPageState={setPageState}
        addToStage={addToStage}
        stagedUIDs={stagedUIDs}
        stagedSet={stagedSet}
    />
    const targetList = <TargetList
        setStagedUIDs={setStagedUIDs}
        stagedUIDs={stagedUIDs}
        stagedSet={stagedSet}
        roomListMap={roomListMap}
    />
    const actions = <Actions
        stagedUIDs={stagedUIDs}
        message={message}
        setStagedUIDs={setStagedUIDs}
        refreshPage={refreshPage}
    />
    const operationArea = <div className="operation-area">
        {targetList}
        {actions}
    </div>
    return <div className="batch-operation">
        {originList}
        {operationArea}
    </div>
}
export default BatchOperation