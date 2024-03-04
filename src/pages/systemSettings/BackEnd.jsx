import useRecordingPath from "../../hooks/useRecordingPath"
import { useTranslation } from "react-i18next";
import { useMount } from "ahooks";
import _ from "lodash"
import { Input, Space, Col, Row, Button, theme } from "antd";
const FullRow = ({ children }) => <Col span={24}><Space size={24}>{children}</Space></Col>
const BackEnd = () => {
  const { token } = theme.useToken()
  const color = token.colorText
  const style = { color }
  const { t } = useTranslation()
  const { isLoading, getPath, checkAndApplyPath, path, editPath } = useRecordingPath()
  useMount(getPath)

  return <Row className="backtend-settings" align="middle" gutter={[16, 16]}>
    <FullRow>
      <span style={style}>{`${t('Path')}:`}</span>
      <Space>
        <Input disabled={isLoading} value={path} onChange={e => editPath(e.target.value)} />
        <Button onClick={checkAndApplyPath}>{t('Apply')}</Button>
      </Space>
    </FullRow>
    <FullRow></FullRow>
  </Row>

}
export default BackEnd