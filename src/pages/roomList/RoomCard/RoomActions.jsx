import { UnorderedListOutlined, VideoCameraOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import { Menu, Button, Popover, Tooltip } from 'antd'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRafInterval, useBoolean } from 'ahooks';
import useRecordTask from '../../../hooks/useRecordTask.jsx'
import useAutoRec from '../../../hooks/useAutoRec.jsx';

const RoomActions = (item) => {
  const { userInfo, taskStatus, setEditingRoom, refreshPage, messageApi } = item
  const { t } = useTranslation()

  const { isDownload } = taskStatus
  const { appointmentRecord, isAutoRec } = userInfo
  const [blink, { toggle }] = useBoolean(false)
  useRafInterval(toggle, 500)
  const willOrRecording = appointmentRecord || isDownload
  const taskActionType = willOrRecording ? 'cancelRecTask' : 'createRecTask'
  const taskActions = useRecordTask()
  const onClick = async () => {
    await taskActions[taskActionType](userInfo?.uid)
    refreshPage?.()
  }
  const autoRecActionType = isAutoRec ? 'closeAutoRec' : 'openAutoRec'
  const autoRecActions = useAutoRec()
  const actions = [
    { label: t('cutSlice'), key: 'cutSlice' },
    { label: t(autoRecActionType), key: autoRecActionType },
    { label: t('settings'), key: 'settings' },
  ]
  const handleMenu = async ({ key }) => {
    setMenuOpen(false)
    if (['openAutoRec', 'closeAutoRec'].includes(key)) {
      const [err] = await autoRecActions[key](userInfo?.uid)
      if (err) { messageApi.err(err?.message) }
    }
    if (['settings'].includes(key)) {
      setEditingRoom(item)
    }
    refreshPage?.()
  }
  const menu = <Menu onClick={handleMenu} style={{ borderInlineEnd: 'none' }} items={actions} />
  const [menuOpen, setMenuOpen] = useState(false)
  const settingButton = <Popover
    destroyTooltipOnHide
    trigger={'click'}
    open={menuOpen}
    onOpenChange={setMenuOpen}
    content={menu}
  >
    <Button icon={<UnorderedListOutlined />} shape="circle" />
  </Popover>
  const blinkState = isDownload && blink
  const cameraButton = <Tooltip title={t(taskActionType)}>
    <Button
      onClick={onClick}
      icon={willOrRecording ? <VideoCameraOutlined spin={taskActions?.isLoading} /> : <VideoCameraAddOutlined />}
      loading={taskActions?.isLoading}
      shape="circle"
      type={((appointmentRecord || blinkState) && 'primary') || 'default'} />
  </Tooltip>
  const buttons = <div className='buttons'>
    {settingButton}
    {cameraButton}
  </div>

  return buttons
}
export default RoomActions