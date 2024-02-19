import { useMount } from "ahooks"
import useFileTree from "../../hooks/useFileTree"
const FileBrowser = () => {
  const { getTree } = useFileTree()
  useMount(getTree)
  return <div className="file-management">files</div>
}
export default FileBrowser