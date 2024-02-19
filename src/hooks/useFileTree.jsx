import { useState } from "react"
import { useBoolean } from 'ahooks'
import to from "await-to-js"
import { getFileTree } from '@/api/file'
import _ from 'lodash'

const useFileTree = () => {
    const [err, setError] = useState(null)
    const [fileTree, setFileTree] = useState({})
    const [flattenTree, setFlattenTree] = useState([])
    const [treeMap, setTreeMap] = useState({})
    const [isLoading, { setTrue, setFalse }] = useBoolean(false)

    const formatFileInfo = (node) => {
        const { Extension, Name, RelativePath, Size, Type, Children } = node
        const id = RelativePath || _.uniqueId(Type)
        const FileData = {
            id,
            name: Name,
            ext: Extension,
            isDir: Type == 'folder',
            size: Size,
            childrenCount: _.size(Children),
            children: Children,
            childrenIds: []
        }
        return FileData
    }

    const getFormattedTree = (tree) => {
        const formatTree = (tree) => {
            const newTree = formatFileInfo(tree)
            const { children: originChildren } = newTree
            if (_.isEmpty(originChildren)) { return newTree }
            newTree.children = originChildren?.map(child => ({ ...formatTree(child), parentId: newTree.id }))
            newTree.childrenIds = newTree?.children?.map(child => child?.id)
            return newTree
        }
        formatTree(tree)
        return formatTree(tree)
    }

    const getTreeArrayAndMap = (tree) => {
        const treeArray = []
        const treeMap = {}
        const flatTree = (node) => {
            const newNode = _.omit(node, 'children')
            treeArray.push(newNode)
            treeMap[newNode.id] = newNode
            if (node.childrenCount > 0) {
                node.children.forEach(child => flatTree(child))
            }
        }
        flatTree(tree)
        return [treeArray, treeMap]
    }

    const getTree = async () => {
        setTrue()
        const [err, res] = await to(getFileTree())
        const originTree = res?.data?.data
        const newTree = getFormattedTree(originTree)
        setFileTree(newTree)
        const [treeArray, treeMap] = getTreeArrayAndMap(newTree)
        setFlattenTree(treeArray)
        setTreeMap(treeMap)
        setFalse()
        setError(err)
        return [err, newTree]
    }
    return { err, fileTree, flattenTree, treeMap, isLoading, getTree }
}
export default useFileTree