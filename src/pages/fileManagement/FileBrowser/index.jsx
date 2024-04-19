import FileCard from "./FileCard"
import { Menu } from "antd"
import { HolderOutlined, FolderOutlined } from "@ant-design/icons"
import { useSize } from "ahooks"
import { useCallback, useMemo, useRef } from "react"
import _ from "lodash"
const FileBrowser = (props) => {
    const { files, setFileSrc, folderChain, setCurrentFolderId } = props
    const getPathItems = useCallback((folderChain) => {
        const items = (folderChain || []).map?.(node => ({
            icon: <FolderOutlined />,
            label: node?.name,
            key: node?.id,
            onClick: () => setCurrentFolderId(node?.id)
        }))
        if (_.size(items) <= 5) { return items }
        const headItems = _.take(items, 2)
        const middleItems = _(items).slice(2, _.size(items) - 2).reverse().value()
        const tailItems = _.takeRight(items, 2)
        return [
            ...headItems,
            { icon: <HolderOutlined />, children: middleItems },
            ...tailItems,
        ]
    }, [setCurrentFolderId])
    const paths = useMemo(() => getPathItems(folderChain), [folderChain, getPathItems])
    const header = <Menu className="nav" mode="horizontal" items={paths} selectedKeys={[]} />
    const fileListRef = useRef(null)
    const width = useSize(fileListRef)?.width
    const lineItemCount = Math.floor(width / 270)
    const widthPercent = `${100.0 / lineItemCount}%`
    const renderItem = (node) => <FileCard
        key={node?.id}
        file={node}
        fileCardStyle={{ width: widthPercent, maxWidth: widthPercent }}
        setFileSrc={setFileSrc}
        setCurrentFolderId={setCurrentFolderId}
    />

    return <div className="file-browser">
        {header}
        <div ref={fileListRef} className="file-list">{files?.map?.(renderItem)}</div>
    </div>
}
export default FileBrowser