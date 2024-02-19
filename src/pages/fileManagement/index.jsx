import { useCallback, useMemo, useState } from 'react';
import { useMount } from "ahooks"
import { message } from 'antd';
import useFileTree from "../../hooks/useFileTree"
import { ChonkyActions, setChonkyDefaults, } from 'chonky';
import { FileBrowser, FileContextMenu, FileHelper, FileList, FileNavbar, FileToolbar } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
setChonkyDefaults({ iconComponent: ChonkyIconFA });
import './style.css'
const FileManagement = () => {
  const { getTree, treeMap } = useFileTree()
  const [currentFolderId, setCurrentFolderId] = useState('')
  const [messageApi, contextHolder] = message.useMessage();
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

  const handleFileAction = useCallback(data => {
    if (data.id === ChonkyActions.OpenFiles.id) {
      const { targetFile, files } = data.payload;
      const fileToOpen = targetFile ?? files[0];
      if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
        setCurrentFolderId(fileToOpen.id);
        return;
      }
    }
  }, [setCurrentFolderId]);
  return <div className="file-management">
    {contextHolder}
    <FileBrowser
      files={files}
      folderChain={folderChain}
      onFileAction={handleFileAction}>
      <FileNavbar />
      <FileToolbar />
      <FileList />
      <FileContextMenu />
    </FileBrowser>
  </div>
}
export default FileManagement