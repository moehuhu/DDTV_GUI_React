import mime from "mime"
import { Image } from "antd"
import _ from 'lodash'
import { useMemo } from "react"
const fileIconModules = import.meta.glob('@/assets/fileIcons/*.svg', { eager: true })
const fileIcons = _(fileIconModules).mapKeys((item, key) => _(_(key).split('/').last()).split('.').first()).value()

const extIs = type => [ext => _.toLower(ext) == type, type]
const extIsIn = type => [ext => mime.getType(_.toLower(ext))?.includes(type), type]
const strictRules = _(fileIcons).keys().map(extIs).value()
const weakRules = _(fileIcons).keys().map(extIsIn).value()
const rules = [...strictRules, ...weakRules]

const FileIcon = (props) => {
    const { src, isDir, ext, childrenCount } = props
    const type = useMemo(() => isDir ? (childrenCount ? 'folder' : 'empty') : (rules?.find(rule => rule[0]?.(ext))?.[1] || 'unknown'), [isDir, childrenCount, ext])
    const icon = <Image
        className="icon"
        width={200}
        height={200}
        preview={false}
        fallback={fileIcons[type]?.default}
        src={type == 'image' ? src : fileIcons[type]?.default}
    />
    return icon
}
export default FileIcon