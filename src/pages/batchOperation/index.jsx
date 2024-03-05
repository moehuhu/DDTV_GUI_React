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
        searchType: 'Originonal',
        search: undefined,
        pageSize: 200,
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
    const actions = <Actions
        stagedUID={stagedUID}
        message={message}
        setStagedItems={setStagedItems}
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