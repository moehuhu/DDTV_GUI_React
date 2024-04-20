import useSystemSource from './hooks/useSystemResource';
import { useRafInterval } from 'ahooks';
import { theme, Progress, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import bytes from 'bytes';
const SystemResource = () => {
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const { getSystemState, systemState } = useSystemSource()
  useRafInterval(getSystemState, 60000, { immediate: true })
  const totalMem = systemState?.Memory?.Total || 0
  const occupiedMem = totalMem - (systemState?.Memory?.Available || 0)
  const totalMemory = bytes(totalMem, { unitSeparator: ' ' })
  const occupiedMemory = bytes(occupiedMem, { unitSeparator: ' ' })
  const usedMemoryPercent = Math.round((occupiedMem / totalMem) * 100)
  const usedMemoryColor = usedMemoryPercent > 90 ? token.colorError : usedMemoryPercent > 80 ? token.colorWarning : token.colorPrimary
  const memory = <Tooltip title={`${t('Memory')}: ${occupiedMemory} / ${totalMemory}`}>
    <Progress
      percent={usedMemoryPercent}
      format={(percent) => <span style={{ color: usedMemoryColor }}>{percent}%</span>}
      strokeColor={usedMemoryColor}
      size="small" />
  </Tooltip>
  const totalDisk = systemState?.HDDInfo?.[0]?.Size
  const occupiedDisk = systemState?.HDDInfo?.[0]?.Usage
  const usedDiskPercent = parseInt((systemState?.HDDInfo?.[0]?.Used || '').replace('%', ''))
  const usedDiskColor = usedDiskPercent > 90 ? token.colorError : usedDiskPercent > 80 ? token.colorWarning : token.colorPrimary;
  const disk = <Tooltip title={`${t('Disk')}: ${occupiedDisk} / ${totalDisk}`}>
    <Progress
      strokeColor={usedDiskColor}
      format={(percent) => <span style={{ color: usedDiskColor }}>{percent}%</span>}
      percent={usedDiskPercent} size="small" />
  </Tooltip>
  return <div className='system-bar' style={{ margin: token.margin }}>
    {systemState?.Memory && memory}
    {systemState?.HDDInfo && disk}
  </div>
}
export default SystemResource