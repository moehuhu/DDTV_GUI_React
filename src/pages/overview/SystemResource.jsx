import useSystemSource from '../../hooks/useSystemResource';
import { useRafInterval } from 'ahooks';
import bytes from 'bytes';
const SystemResource = () => {
  const { getSystemState, systemState } = useSystemSource()
  useRafInterval(getSystemState, 60000, { immediate: true })
  const totalMem = systemState?.Memory?.Total || 0
  const occupiedMem = totalMem - (systemState?.Memory?.Available || 0)
  const totalMemory = bytes(occupiedMem, { unitSeparator: ' ' })
  const occupiedMemory = bytes(occupiedMem, { unitSeparator: ' ' })
  const percents = Math.round((occupiedMem / totalMem) * 100)
  console.log(percents);
}
export default SystemResource