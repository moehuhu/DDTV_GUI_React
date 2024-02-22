import { useMemo, useState } from 'react';
import { useMount } from "ahooks"
import { message } from 'antd';
import useFileTree from "../../hooks/useFileTree"
import { setChonkyDefaults, } from 'chonky';
import ChonkyFileBrowser from './Chonky'
import FileBrowser from './FileBrowser';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
setChonkyDefaults({ iconComponent: ChonkyIconFA });
import './style.css'
const FileManagement = () => {
  const { getTree, treeMap } = useFileTree()
  const [currentFolderId, setCurrentFolderId] = useState('')
  const [messageApi, contextHolder] = message.useMessage()
  useMount(async () => {
    const [err, tree] = await getTree()
    if (err) {
      messageApi.error(err?.message)
      return
    }
    setCurrentFolderId(tree?.id)
  })
  const currentFolder = treeMap[currentFolderId];

  const { files, folderChain } = useMemo(() => {
    const folderChain = [currentFolder];
    const files = currentFolder?.childrenIds?.map((fileId) => treeMap[fileId] || null) || []
    let parentId = currentFolder?.parentId;
    while (parentId) {
      const parentFile = treeMap[parentId];
      if (parentFile) {
        folderChain.unshift(parentFile);
        parentId = parentFile.parentId;
      } else {
        parentId = null;
      }
    }
    return { files, folderChain };
  }, [treeMap, currentFolder])


  return <div className="file-management">
    {contextHolder}
    <FileBrowser files={files} folderChain={folderChain} setCurrentFolderId={setCurrentFolderId} />
    {/* <ChonkyFileBrowser files={files} folderChain={folderChain} setCurrentFolderId={setCurrentFolderId} /> */}
  </div>
}
export default FileManagement