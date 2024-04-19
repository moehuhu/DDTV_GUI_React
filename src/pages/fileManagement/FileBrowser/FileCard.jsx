import { Badge, Dropdown, theme } from "antd"
import { useTranslation } from "react-i18next"
import FileIcon from "./FileIcon"
import mime from 'mime'
import download from 'download-in-browser'
import _ from 'lodash'
const FileCard = (props) => {
    const { t } = useTranslation()
    const { file, setFileSrc, setCurrentFolderId } = props
    const { id, name, ext, isDir, size, childrenCount } = file
    const type = mime.getType(_.toLower(ext))
    const isVideo = _.includes(type, 'video')
    const isPreviewable = isVideo
        || _.includes(type, 'json')
        || _.includes(type, 'xml')
        || _.includes(type, 'pdf')
        || _.includes(type, 'image')
    const handlePreview = () => {
        if (isVideo) {
            setFileSrc({ src: id, isVideo, ext });
            return
        }
        window.open(id)
    }
    const onDoubleClick = () => {
        if (isDir) { setCurrentFolderId(id); return; }
        if (isPreviewable) { handlePreview(); return; }
        download(id, name)
    }
    const fileIcon = <div onDoubleClick={onDoubleClick}>
        <Badge offset={[-21, 35]} count={childrenCount || 0}>
            <FileIcon src={id} isDir={isDir} ext={ext} childrenCount={childrenCount} />
        </Badge>
    </div>
    const { token } = theme.useToken()
    const color = token.colorText
    const style = { color }
    const fileName = <span title={name} className="file-name" style={style}>{name}</span>
    const fileCard = <div className="file-card">
        {fileIcon}
        {fileName}
    </div>
    const preview = {
        label: t('Preview'),
        key: 'Preview',
        onClick: () => handlePreview()
    }
    const downloadFile = {
        label: t('Download'),
        key: 'Download',
        disabled: isDir,
        onClick: () => download(id, name)
    }
    const CopyFilename = {
        label: t('CopyFilename'),
        key: 'CopyFilename',
        onClick: () => navigator.clipboard.writeText(name)
    }

    const openDir = {
        label: t('Open'),
        key: 'Open',
        onClick: () => setCurrentFolderId(id)
    }

    const rightClickItems = isPreviewable ? [downloadFile, preview, CopyFilename] : isDir ? [downloadFile, openDir, CopyFilename] : [downloadFile, CopyFilename]
    return <Dropdown menu={{ items: rightClickItems, }} trigger={['contextMenu']}>
        {fileCard}
    </Dropdown>
}
export default FileCard