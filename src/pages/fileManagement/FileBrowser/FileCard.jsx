import { Badge, theme } from "antd"
import FileIcon from "./FileIcon"
import mime from 'mime'
import _ from 'lodash'
import download from 'download-in-browser'
const FileCard = (props) => {
    const { file, setVideoSrc, setCurrentFolderId } = props
    const { id, name, ext, isDir, size, childrenCount } = file
    const onDoubleClick = () => {
        if (isDir) { setCurrentFolderId(id); return; }
        const type = mime.getType(_.toLower(ext))
        if (_.includes(type, 'video')) {
            setVideoSrc(id)
            return
        }
        if (_.includes(type, 'json') || _.includes(type, 'xml')) {
            window.open(id)
            return
        }
        download(id, name)
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