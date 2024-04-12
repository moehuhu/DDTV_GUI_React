
import { Dropdown } from 'antd'
import { PlusOutlined, BlockOutlined } from "@ant-design/icons"
import { useTranslation } from 'react-i18next'

const RightClickWrapper = (props) => {
  const { t } = useTranslation()
  const { filteredList, addToStage, setSelectedUID, selectedUID } = props
  const { children } = props

  const rightClickItems = [
    {
      label: t('Add'),
      icon: <PlusOutlined />,
      key: 'Add',
      onClick: () => { addToStage(selectedUID); setSelectedUID([]) }
    }, {
      label: t('SelectAll'),
      icon: <BlockOutlined />,
      key: 'SelectAll',
      onClick: () => setSelectedUID(filteredList?.map(({ uid }) => uid))
    },
  ]
  return <Dropdown menu={{ items: rightClickItems, }} trigger={['contextMenu']}>{children}</Dropdown>
}
export default RightClickWrapper