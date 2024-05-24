import to from "await-to-js"
import { useState } from "react"
import { useBoolean } from 'ahooks'
import { addRoom, addRooms } from '@/api/set_room'
import _ from 'lodash'
const useAddRoom = () => {
    const [err, setError] = useState(null)
    const [res, setRes] = useState(null)
    const [isLoading, { setTrue, setFalse }] = useBoolean(false)

    const submitRoom = async (params) => {
        setTrue()
        const mappedParams = _(params)
            .mapKeys((item, key) => _.snakeCase(key))
            .value()
        const { uid } = mappedParams
        const isBatchAdd = _.includes(uid, ',') || _.includes(uid, '，')
        if (isBatchAdd) { mappedParams.uids = uid }
        const [err, res] = await to(isBatchAdd ? addRooms(mappedParams) : addRoom(mappedParams))
        if (err) { console.error(err) }
        setFalse()
        setError(err)
        setRes(res)
        return [err, res]
    }
    return { err, res, isLoading, submitRoom }
}
export default useAddRoom