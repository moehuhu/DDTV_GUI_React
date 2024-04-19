import { useEffect, useMemo, useState } from "react"
import { VideoThumbnailGenerator } from "browser-video-thumbnail-generator";
import mime from "mime"
import { Image } from "antd"
import _ from 'lodash'

const fileIconModules = import.meta.glob('@/assets/fileIcons/*.svg', { eager: true })
const fileIcons = _(fileIconModules).mapKeys((item, key) => _(_(key).split('/').last()).split('.').first()).value()

const extIs = type => [ext => _.toLower(ext) == type, type]
const extIsIn = type => [ext => mime.getType(_.toLower(ext))?.includes(type), type]
const strictRules = _(fileIcons).keys().map(extIs).value()
const weakRules = _(fileIcons).keys().map(extIsIn).value()
const rules = [...strictRules, ...weakRules]

const FileIcon = (props) => {
    const [thumbnail, setThumbnail] = useState()
    const { src, isDir, ext, childrenCount } = props
    const [width, setWidth] = useState(200)
    const type = useMemo(() => isDir ? (childrenCount ? 'folder' : 'empty') : (rules?.find(rule => rule[0]?.(ext))?.[1] || 'unknown'), [isDir, childrenCount, ext])
    useEffect(() => {
        if (type == 'image') { setWidth(240); return }
        if (!['flv', 'video'].includes(type)) { return }
        const generator = new VideoThumbnailGenerator(src)
        generator.getThumbnail().then((thumbnail) => {
            setThumbnail(thumbnail?.thumbnail);
            setWidth(240)
        });
        return () => { generator.revokeUrls() }
    }, [src, type])
    const icon = <Image
        className="icon"
        width={width}
        height={200}
        preview={false}
        onError={() => { setWidth(200) }}
        fallback={fileIcons[type]?.default}
        src={type == 'image' ? src : (thumbnail || fileIcons[type]?.default)}
    />
    return icon
}
export default FileIcon