import { useCallback, useMemo, useState } from 'react';
import { useMount } from "ahooks"
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import useFileTree from "../../hooks/useFileTree"
import { ChonkyActions, setChonkyDefaults, } from 'chonky';
import { FileBrowser, FileContextMenu, FileHelper, FileList, FileNavbar, FileToolbar } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { zhI18n, enI18n, jpI18n } from "./chonkyI18n"
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

  const { i18n } = useTranslation()
  const i18nConfig = {
    'zh': zhI18n,
    'zh-CN': zhI18n,
    'en': enI18n,
    'en-US': enI18n,
    'jp': jpI18n,
    'ja-JP': jpI18n
  }[i18n.language]
  return <div className="file-management">
    {contextHolder}
    <FileBrowser
      i18n={i18nConfig}
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