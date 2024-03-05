import { useState } from "react"
import { useBoolean } from 'ahooks'
import to from "await-to-js"
import { getUserAgreement, getUserAgreementState } from "../api/login"

const useUserAgreement = () => {
    const [res, setRes] = useState(null)
    const [isAgreed, setAgreementState] = useState(true)
    const [isLoading, { setTrue, setFalse }] = useBoolean(false)
    const agree = async (check) => {
        setTrue()
        const [err, res] = await to(getUserAgreement({ check }))
        setAgreementState(res?.data?.data)
        setRes(res)
        setFalse()
        return [err, res]
    }
    const checkAgreementState = async () => {
        setTrue()
        const [err, res] = await to(getUserAgreementState())
        if (err) { console.error(err) }
        setAgreementState(res?.data?.data)
        setFalse()
        return [err, res?.data?.data]
    }
    return { res, isLoading, isAgreed, agree, checkAgreementState }
}
export default useUserAgreement