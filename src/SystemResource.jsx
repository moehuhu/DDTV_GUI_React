import useSystemSource from './hooks/useSystemResource';
import { useRafInterval } from 'ahooks';
import { theme } from 'antd';
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
  const memory = <span>{`${t('Memory')}: ${occupiedMemory} / ${totalMemory}`}</span>
  const totalDisk = systemState?.HDDInfo?.[0]?.Size
  const occupiedDisk = systemState?.HDDInfo?.[0]?.Usage
  const disk = <span>{`${t('Disk')}: ${occupiedDisk} / ${totalDisk}`}</span>
  return <div className='system-bar' style={{ margin: token.margin }}>
    {memory}
    {disk}
  </div>
}
export default SystemResource