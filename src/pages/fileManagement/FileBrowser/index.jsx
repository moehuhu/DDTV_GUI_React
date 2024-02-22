import { Menu, List } from "antd"
import { HolderOutlined, FolderOutlined } from "@ant-design/icons"
import _ from "lodash"
import { useCallback, useMemo } from "react"
import FileCard from "./FileCard"
const FileBrowser = (props) => {
    const { files, folderChain, setCurrentFolderId } = props
    const getPathItems = useCallback((folderChain) => {
        const items = (folderChain || []).map?.(node => ({
            icon: <FolderOutlined />,
            label: node?.name,
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
    const grid = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6, }
    const header = <Menu className="nav" mode="horizontal" items={paths} selectedKeys={[]} />
    const renderItem = (node) => <List.Item>
        <FileCard key={node?.id} file={node} setCurrentFolderId={setCurrentFolderId} />
    </List.Item>
    const list = <List
        className="file-list"
        grid={grid}
        header={header}
        renderItem={renderItem}
        bordered={false}
        dataSource={files}
    />
    return <div className="file-browser">
        {list}
    </div>
}
export default FileBrowser