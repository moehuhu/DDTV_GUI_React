import './style.css'
import useDetailedRoomInfoList from "../../hooks/useDetailedRoomInfoList"
import OriginList from "./OriginList"
import TargetList from "./TargetList"
import Actions from "./actions.jsx"
import { useMemo, useState } from "react"
import { useSetState, useAsyncEffect, useResponsive, } from "ahooks"
import { App } from 'antd'
import _ from 'lodash'

const BatchOperation = () => {
    const { notification } = App.useApp()
    const [pageState] = useSetState({
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

    const { isLoading, roomInfoList, refreshRoomInfoList } = useDetailedRoomInfoList()
    const roomListMap = useMemo(() => _(roomInfoList).map(item => [item?.uid, item]).fromPairs().value(), [roomInfoList])
    const [search, setSearch] = useState('')
    const filteredList = useMemo(() => {
        const getLower = (str) => ((str || '') + '').toLocaleLowerCase()
        const searchWord = getLower(search)
        return roomInfoList?.filter((item) => {
            const name = getLower(item?.userInfo?.name)
            const uid = getLower(item?.uid)
            const roomId = getLower(item?.roomInfo?.roomId)
            const shortId = getLower(item?.roomInfo?.shortId)
            const isInSearch = (str) => _(str).includes(searchWord)
            return isInSearch(name) || isInSearch(uid) || isInSearch(roomId) || isInSearch(shortId)
        })
    }, [roomInfoList, search])

    const [stagedUIDs, setStagedUIDs] = useState([])
    const stagedSet = useMemo(() => new Set(stagedUIDs), [stagedUIDs])

    const addToStage = (selectedItems = []) => {
        const newUIDs = selectedItems?.filter?.(uid => !stagedSet.has(uid))
        setStagedUIDs(uids => [...uids, ...newUIDs])
    }

    const originList = <OriginList
        refreshPage={refreshPage}
        message={message}
        search={search}
        isLoading={isLoading}
        filteredList={filteredList}
        roomListMap={roomListMap}
        setSearch={setSearch}
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

    const responsive = useResponsive();
    const operationArea = <div
        className="operation-area"
        style={{
            height: responsive.md ? 'calc(100% - 64px)' : 'calc(48%)',
            width: responsive.md ? 'calc(50% - 48px)' : 'calc(100% - 32px)'
        }}
    >
        {targetList}
        {actions}
    </div>
    return <div className="batch-operation">
        {originList}
        {operationArea}
    </div>
}
export default BatchOperation