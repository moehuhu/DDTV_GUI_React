import { PlusCircleTwoTone } from "@ant-design/icons"
import { Badge } from "antd"
import FileIcon from "./FileIcon"
const FileCard = (props) => {
    const { file, setCurrentFolderId } = props
    const { name, ext, isDir, size, childrenCount } = file
    const fileIcon = <Badge offset={[-10, 40]} count={childrenCount || 0}>
        <FileIcon isDir={isDir} ext={ext} />
    </Badge>
    const fileName = <div className="name">{name}</div>
    const fileCard = <>
        {fileIcon}
        {fileName}
    </>
    return fileCard
}
export default FileCard