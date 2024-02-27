import useAutoRec from "../../hooks/useAutoRec"
import useDanmuRec from "../../hooks/useDanmuRec"
import useRemindMe from "../../hooks/useRemindMe"
import useDelRoom from "../../hooks/useDelRoom"
import RoomInfo from "./roomInfo"
import './style.css'
import useDetailedRoomInfoList from "../../hooks/useDetailedRoomInfoList"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useSetState, useAsyncEffect } from "ahooks"
import { List, Pagination, Spin } from "antd"
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
    const { t } = useTranslation()
    const header = isLoading ? <Spin spinning={isLoading} /> : `${t('Total')}: ${total || 0}`
    const footer = <Pagination
        current={pageState.current}
        pageSize={pageState.pageSize}
        total={total}
        showSizeChanger={false}
        onChange={(current) => { setPageState({ current }) }}
    />

    const [targetKeys, setTargetKeys] = useState([]);
    return <div className="batch-operation">
        <List bordered
            header={header}
            className="origin-list"
            dataSource={roomInfoList}
            footer={footer}
            renderItem={item => <RoomInfo item={item} />} />
    </div>
}
export default BatchOperation