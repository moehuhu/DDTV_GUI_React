import { useSystemSettingsStore } from "../../SystemSettingsStore"
import config from '../../../package.json'
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Space, InputNumber, Col, Row, Popconfirm, theme } from 'antd';
import _ from 'lodash'

const FrontEnd = () => {
  const FullRow = ({ children }) => <Col span={24}><Space size={24}>{children}</Space></Col>
  const { t } = useTranslation()
  const {
    isAutoRefresh,
    autoRefreshIntervalSeconds,
    recDanmu,
    autoRec,
    remind,
  } = useSystemSettingsStore(state => state)
  const {
    resetConfig,
    setAutoRefresh,
    setAutoRefreshIntervalSeconds,
    setRecDanmu,
    setAutoRec,
    setRemind,
  } = useSystemSettingsStore(state => state)
  const { token } = theme.useToken()
  const color = token.colorText
  const style = { color }
  const overviewSettings = <Row align="middle" gutter={[16, 16]}>
    <FullRow>
      <span style={style}>{t('frontend')}: {config?.version}</span>
    </FullRow>
    <FullRow>
      <span style={style}>{`${t('AutoRefresh')}:`}</span>
      <Space>
        <Checkbox onChange={e => setAutoRefresh(e.target.checked)} checked={isAutoRefresh} />
        <InputNumber
          onChange={setAutoRefreshIntervalSeconds}
          value={autoRefreshIntervalSeconds}
          min={10}
          max={86400}
          formatter={_.toInteger}
          disabled={!isAutoRefresh} />
        <span style={style}>{t('s')}</span>
      </Space>
    </FullRow>
    <FullRow>
      <span style={style}>{`${t('DefaultRoomConfig')}:`}</span>
      <Space>
        <Checkbox onChange={e => setRecDanmu(e.target.checked)} checked={recDanmu} />
        <span style={style}>{t('recDanmu')}</span>
      </Space>
      <Space>
        <Checkbox onChange={e => setAutoRec(e.target.checked)} checked={autoRec} />
        <span style={style}>{t('autoRec')}</span>
      </Space>
      <Space>
        <Checkbox onChange={e => setRemind(e.target.checked)} checked={remind} />
        <span style={style}>{t('remind')}</span>
      </Space>
    </FullRow>
    <FullRow>
      <Popconfirm
        key={'delete'}
        title={t('Confirm')}
        description={t('Are you sure to reset these settings?')}
        onConfirm={resetConfig}
        okText={t('Confirm')}
        okButtonProps={{ danger: true }}
        showCancel={false}>
        <Button danger>{t('resetSettings')}</Button>
      </Popconfirm>
    </FullRow>
  </Row>
  return overviewSettings
}
export default FrontEnd