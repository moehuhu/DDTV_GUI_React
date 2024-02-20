import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSystemSettingsStore } from '../../../SystemSettingsStore';
import { ChonkyActions, setChonkyDefaults, } from 'chonky';
import { FileBrowser, FileContextMenu, FileHelper, FileList, FileNavbar, FileToolbar } from 'chonky';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { zhI18n, enI18n, jpI18n } from "./chonkyI18n"
setChonkyDefaults({ iconComponent: ChonkyIconFA });
import '../style.css'
const ChonkyFileBrowser = (props) => {
    const { files, folderChain, setCurrentFolderId } = props
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
    const { isDarkMode } = useSystemSettingsStore(state => state)
    return <>
        <FileBrowser
            darkMode={isDarkMode}
            i18n={i18nConfig}
            files={files}
            folderChain={folderChain}
            onFileAction={handleFileAction}>
            <FileNavbar />
            <FileToolbar />
            <FileList />
            <FileContextMenu />
        </FileBrowser>
    </>
}
export default ChonkyFileBrowser