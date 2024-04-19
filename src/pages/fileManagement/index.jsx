import { useMemo, useState } from 'react';
import { useMount } from "ahooks"
import { App, Modal } from 'antd';
import useFileTree from "../../hooks/useFileTree"
import FileBrowser from './FileBrowser';
import './style.css'
const FileManagement = () => {
  const { getTree, treeMap } = useFileTree()
  const [currentFolderId, setCurrentFolderId] = useState('')
  const [videoSrc, setVideoSrc] = useState('')
  const { message } = App.useApp()
  useMount(async () => {
    const [err, tree] = await getTree()
    if (err) {
      message.error(err?.message)
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
    <FileBrowser
      files={files}
      setVideoSrc={setVideoSrc}
      folderChain={folderChain}
      setCurrentFolderId={setCurrentFolderId}
    />
    <Modal
      className='video-player'
      closable={false}
      footer={null}
      mask={false}
      open={videoSrc}
      destroyOnClose
      onCancel={() => setVideoSrc('')}>
      <video className='player' controls src={videoSrc} />
    </Modal>
  </div>
}
export default FileManagement