import { useMemo, useState } from 'react';
import { useMount } from "ahooks"
import { App, Modal, theme } from 'antd';
import useFileTree from "../../hooks/useFileTree"
import FileBrowser from './FileBrowser';
import './style.css'
const FileManagement = () => {
  const { token } = theme.useToken()
  const { getTree, treeMap } = useFileTree()
  const [currentFolderId, setCurrentFolderId] = useState('')
  const [pdfPageNum, setPdfPageNum] = useState(1)
  const [fileSrc, setFileSrc] = useState(null)
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

  const previewContent = fileSrc?.isVideo ? <video className='video-player' controls src={fileSrc?.src} /> : <audio className='audio-player' controls src={fileSrc?.src} />
  return <div className="file-management">
    <FileBrowser
      files={files}
      setFileSrc={setFileSrc}
      folderChain={folderChain}
      setCurrentFolderId={setCurrentFolderId}
    />
    <Modal
      className='preview-content'
      closable={false}
      width={null}
      footer={null}
      mask={false}
      open={fileSrc}
      destroyOnClose
      centered
      onCancel={() => setFileSrc(null)}>
      {previewContent}
    </Modal>
  </div>
}
export default FileManagement