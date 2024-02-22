import { Badge, theme } from "antd"
import FileIcon from "./FileIcon"
const FileCard = (props) => {
    const { file, setCurrentFolderId } = props
    const { id, name, ext, isDir, size, childrenCount } = file
    const onDoubleClick = () => {
        if (isDir) { setCurrentFolderId(id); return; }
        window.open(id)
    }
    const fileIcon = <div onDoubleClick={onDoubleClick}>
        <Badge offset={[-21, 35]} count={childrenCount || 0}>
            <FileIcon isDir={isDir} ext={ext} />
        </Badge>
    </div>
    const { token } = theme.useToken()
    const color = token.colorText
    const style = { color }
    const fileName = <span title={name} className="file-name" style={style}>{name}</span>
    const fileCard = <>
        {fileIcon}
        {fileName}
    </>
    return fileCard
}
export default FileCard