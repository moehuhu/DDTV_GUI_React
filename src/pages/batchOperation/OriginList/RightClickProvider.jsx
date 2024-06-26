import useAutoRec from '../../../hooks/useAutoRec'
import useDanmuRec from '../../../hooks/useDanmuRec'
import useRemindMe from '../../../hooks/useRemindMe'
import { Dropdown, theme } from 'antd'
import Icon, { PlusOutlined, BlockOutlined, VideoCameraOutlined, BellOutlined } from "@ant-design/icons"
import { useTranslation } from 'react-i18next'
const Danmakus = () => <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
  <path fillRule="evenodd"
    d="M11.989 4.828c-.47 0-.975.004-1.515.012l-1.71-2.566a1.008 1.008 0 0 0-1.678 1.118l.999 1.5c-.681.018-1.403.04-2.164.068a4.013 4.013 0 0 0-3.83 3.44c-.165 1.15-.245 2.545-.245 4.185 0 1.965.115 3.67.35 5.116a4.012 4.012 0 0 0 3.763 3.363l.906.046c1.205.063 1.808.095 3.607.095a.988.988 0 0 0 0-1.975c-1.758 0-2.339-.03-3.501-.092l-.915-.047a2.037 2.037 0 0 1-1.91-1.708c-.216-1.324-.325-2.924-.325-4.798 0-1.563.076-2.864.225-3.904.14-.977.96-1.713 1.945-1.747 2.444-.087 4.465-.13 6.063-.131 1.598 0 3.62.044 6.064.13.96.034 1.71.81 1.855 1.814.075.524.113 1.962.141 3.065v.002c.01.342.017.65.025.88a.987.987 0 1 0 1.974-.068c-.008-.226-.016-.523-.025-.856v-.027c-.03-1.118-.073-2.663-.16-3.276-.273-1.906-1.783-3.438-3.74-3.507-.9-.032-1.743-.058-2.531-.078l1.05-1.46a1.008 1.008 0 0 0-1.638-1.177l-1.862 2.59c-.38-.004-.744-.007-1.088-.007h-.13Zm.521 4.775h-1.32v4.631h2.222v.847h-2.618v1.078h2.618l.003.678c.36.026.714.163 1.01.407h.11v-1.085h2.694v-1.078h-2.695v-.847H16.8v-4.63h-1.276a8.59 8.59 0 0 0 .748-1.42L15.183 7.8a14.232 14.232 0 0 1-.814 1.804h-1.518l.693-.308a8.862 8.862 0 0 0-.814-1.408l-1.045.352c.297.396.572.847.825 1.364Zm-4.18 3.564.154-1.485h1.98V8.294h-3.2v.98H9.33v1.43H7.472l-.308 3.453h2.277c0 1.166-.044 1.925-.12 2.277-.078.352-.386.528-.936.528-.308 0-.616-.022-.902-.055l.297 1.067.062.005c.285.02.551.04.818.04 1.001-.067 1.562-.419 1.694-1.057.11-.638.176-1.903.176-3.795h-2.2Zm7.458.11v-.858h-1.254v.858h1.254Zm-2.376-.858v.858h-1.199v-.858h1.2Zm-1.199-.946h1.2v-.902h-1.2v.902Zm2.321 0v-.902h1.254v.902h-1.254Z"
    clipRule="evenodd"></path>
  <path fillRule="evenodd"
    d="M22.846 14.627a1 1 0 0 0-1.412.075l-5.091 5.703-2.216-2.275-.097-.086-.008-.005a1 1 0 0 0-1.322 1.493l2.963 3.041.093.083.007.005c.407.315 1 .27 1.354-.124l5.81-6.505.08-.102.005-.008a1 1 0 0 0-.166-1.295Z"
    clipRule="evenodd"></path>
</svg>

const RightClickWrapper = (props) => {
  const { t } = useTranslation()
  const { token } = theme.useToken()
  const { filteredList = [], addToStage, setSelectedUID, selectedUID = [], message, refreshPage } = props
  const { children } = props

  const messager = (err, res) => {
    if (err) { message('error')?.(err); return; }
    if (res) { message('success')?.({ message: t('Applied') }) }
  }

  const { openAutoRec, closeAutoRec } = useAutoRec()
  const applyAutoRec = async (autoRec) => {
    const [err, res] = await (autoRec ? openAutoRec : closeAutoRec)(selectedUID)
    messager(err, res)
    refreshPage()
  }

  const { openDanmuRec, closeDanmuRec } = useDanmuRec()
  const applyRecDanmu = async (recDanmu) => {
    const [err, res] = await (recDanmu ? openDanmuRec : closeDanmuRec)(selectedUID)
    messager(err, res)
    refreshPage()
  }

  const { openRemindMe, closeRemindMe } = useRemindMe()
  const applyRemind = async (remind) => {
    const [err, res] = await (remind ? openRemindMe : closeRemindMe)(selectedUID)
    messager(err, res)
    refreshPage()
  }
  const style = { color: token.colorText, fontSize: '16px' }


  const rightClickItems = [
    {
      label: t('Add'),
      icon: <PlusOutlined style={style} />,
      key: 'Add',
      onClick: () => { addToStage(selectedUID); setSelectedUID([]) }
    }, {
      label: t('SelectAll'),
      icon: <BlockOutlined style={style} />,
      key: 'SelectAll',
      onClick: () => setSelectedUID(filteredList?.map(({ uid }) => uid))
    }, {
      label: t('autoRec'),
      icon: <VideoCameraOutlined style={style} />,
      key: 'autoRec',
      children: [
        { label: t('Enable'), key: 'EnablAutoRec', onClick: () => applyAutoRec(true) },
        { label: t('Disable'), key: 'DisableAutoRec', onClick: () => applyAutoRec(false) }
      ]
    }, {
      label: t('recDanmu'),
      icon: <Icon style={style} component={Danmakus} />,
      key: 'recDanmu',
      children: [
        { label: t('Enable'), key: 'EnableRecDanmu', onClick: () => applyRecDanmu(true) },
        { label: t('Disable'), key: 'DisableRecDanmu', onClick: () => applyRecDanmu(false) }
      ]
    }, {
      label: t('remind'),
      icon: <BellOutlined style={style} />,
      key: 'remind',
      children: [
        { label: t('Enable'), key: 'EnableRemind', onClick: () => applyRemind(true) },
        { label: t('Disable'), key: 'DisableRemind', onClick: () => applyRemind(false) }
      ]
    }
  ]
  return <Dropdown menu={{ items: rightClickItems, }} trigger={['contextMenu']}>{children}</Dropdown>
}
export default RightClickWrapper