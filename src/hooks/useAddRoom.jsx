import to from "await-to-js"
import { useState } from "react"
import { useBoolean } from 'ahooks'
import { addRoom } from '@/api/set_room'
import _ from 'lodash'
const useAddRoom = () => {
    const [err, setError] = useState(null)
    const [res, setRes] = useState(null)
    if (err) { console.error(err) }
    const [isLoading, { setTrue, setFalse }] = useBoolean(false)

    const submitRoom = async (params) => {
        setTrue()
        const mappedParams = _(params)
            .mapKeys((item, key) => _.snakeCase(key))
            .value()
        const [err, res] = await to(addRoom(mappedParams))
        setFalse()
        setError(err)
        setRes(res)
        return [err, res]
    }
    return { err, res, isLoading, submitRoom }
}
export default useAddRoom