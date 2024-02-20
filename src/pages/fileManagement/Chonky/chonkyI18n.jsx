import { FileHelper, ChonkyActions } from 'chonky';
export const enI18n = { locale: 'en' }
export const zhI18n = {
    locale: 'zh',
    formatters: {
        formatFileModDate: (intl, file) => {
            const safeModDate = FileHelper.getModDate(file);
            if (safeModDate) {
                return `${intl.formatDate(safeModDate)}, ${intl.formatTime(
                    safeModDate
                )}`;
            } else {
                return null;
            }
        },
    },
    messages: {
        'chonky.toolbar.searchPlaceholder': '搜索',
        'chonky.toolbar.visibleFileCount': `{fileCount, plural,
            =0 {# 项}
            one {# 项}
            other {# 项}
        }`,
        'chonky.toolbar.selectedFileCount': `{fileCount, plural,
            =0 {}
            one {# 项}
            other {# 项}
        }`,
        'chonky.toolbar.hiddenFileCount': `{fileCount, plural,
            =0 {}
            one {# 隐藏项}
            other {# 隐藏项}
        }`,
        'chonky.fileList.nothingToShow': '空',
        'chonky.contextMenu.browserMenuShortcut': '打开浏览器右键: {shortcut}',

        // File action translation strings. These depend on which actions you have
        // enabled in Chonky.
        [`chonky.actionGroups.Actions`]: '操作',
        [`chonky.actionGroups.Options`]: '选项',
        [`chonky.actions.${ChonkyActions.OpenParentFolder.id}.button.name`]: '打开上级文件夹',
        [`chonky.actions.${ChonkyActions.CreateFolder.id}.button.name`]: '新建文件夹',
        [`chonky.actions.${ChonkyActions.CreateFolder.id}.button.tooltip`]: '新建文件夹',
        [`chonky.actions.${ChonkyActions.DeleteFiles.id}.button.name`]: '删除',
        [`chonky.actions.${ChonkyActions.OpenSelection.id}.button.name`]: '打开选择',
        [`chonky.actions.${ChonkyActions.SelectAllFiles.id}.button.name`]: '全选',
        [`chonky.actions.${ChonkyActions.ClearSelection.id}.button.name`]: '取消选择',
        [`chonky.actions.${ChonkyActions.EnableListView.id}.button.name`]: '列表视图',
        [`chonky.actions.${ChonkyActions.EnableGridView.id}.button.name`]: '网格视图',
        [`chonky.actions.${ChonkyActions.SortFilesByName.id}.button.name`]: '按名称排序',
        [`chonky.actions.${ChonkyActions.SortFilesBySize.id}.button.name`]: '按大小排序',
        [`chonky.actions.${ChonkyActions.SortFilesByDate.id}.button.name`]: '按日期排序',
        [`chonky.actions.${ChonkyActions.ToggleHiddenFiles.id}.button.name`]: '展示隐藏文件',
        [`chonky.actions.${ChonkyActions.ToggleShowFoldersFirst.id}.button.name`]: '文件夹靠前显示',
    },
}
export const jpI18n = {
    locale: 'jp',
    formatters: {
        formatFileModDate: (intl, file) => {
            const safeModDate = FileHelper.getModDate(file);
            if (safeModDate) {
                return `${intl.formatDate(safeModDate)}, ${intl.formatTime(
                    safeModDate
                )}`;
            } else {
                return null;
            }
        },
    },
    messages: {
        'chonky.toolbar.searchPlaceholder': '搜索',
        'chonky.toolbar.visibleFileCount': `{fileCount, plural,
            =0 {# 项}
            one {# 项}
            other {# 项}
        }`,
        'chonky.toolbar.selectedFileCount': `{fileCount, plural,
            =0 {}
            one {# 项}
            other {# 项}
        }`,
        'chonky.toolbar.hiddenFileCount': `{fileCount, plural,
            =0 {}
            one {# 隐藏项}
            other {# 隐藏项}
        }`,
        'chonky.fileList.nothingToShow': '空',
        'chonky.contextMenu.browserMenuShortcut': '打开浏览器右键: {shortcut}',

        // File action translation strings. These depend on which actions you have
        // enabled in Chonky.
        [`chonky.actionGroups.Actions`]: '操作',
        [`chonky.actionGroups.Options`]: '选项',
        [`chonky.actions.${ChonkyActions.OpenParentFolder.id}.button.name`]: '打开上级文件夹',
        [`chonky.actions.${ChonkyActions.CreateFolder.id}.button.name`]: '新建文件夹',
        [`chonky.actions.${ChonkyActions.CreateFolder.id}.button.tooltip`]: '新建文件夹',
        [`chonky.actions.${ChonkyActions.DeleteFiles.id}.button.name`]: '删除',
        [`chonky.actions.${ChonkyActions.OpenSelection.id}.button.name`]: '打开选择',
        [`chonky.actions.${ChonkyActions.SelectAllFiles.id}.button.name`]: '选择所有',
        [`chonky.actions.${ChonkyActions.ClearSelection.id}.button.name`]: '清除选择',
        [`chonky.actions.${ChonkyActions.EnableListView.id}.button.name`]: '列表视图',
        [`chonky.actions.${ChonkyActions.EnableGridView.id}.button.name`]: '网格视图',
        [`chonky.actions.${ChonkyActions.SortFilesByName.id}.button.name`]: '按名称排序',
        [`chonky.actions.${ChonkyActions.SortFilesBySize.id}.button.name`]: '按大小排序',
        [`chonky.actions.${ChonkyActions.SortFilesByDate.id}.button.name`]: '按日期排序',
        [`chonky.actions.${ChonkyActions.ToggleHiddenFiles.id}.button.name`]: '展示隐藏文件',
        [`chonky.actions.${ChonkyActions.ToggleShowFoldersFirst.id}.button.name`]: '文件夹靠前显示',
    },
}