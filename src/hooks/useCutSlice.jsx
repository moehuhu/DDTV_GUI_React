import { cutTask } from '@/api/rec_task'
import { useBoolean } from 'ahooks'
import to from 'await-to-js'

const useCutSlice = () => {
  const [isLoading, { setTrue, setFalse }] = useBoolean()
  const cutSlice = async (uid) => {
    setTrue()
    const [err, res] = await to(cutTask({ uid, state: true }))
    setFalse()
    return [err, res]
  }
  return { isLoading, cutSlice }
}
export default useCutSlice