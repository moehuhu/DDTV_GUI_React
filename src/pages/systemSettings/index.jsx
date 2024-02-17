import { useTranslation } from "react-i18next";
import { useSystemSettingsStore } from "../../SystemSettingsStore"
import { Button, Checkbox, Divider, Space, InputNumber, Col, Row, Popconfirm } from 'antd';
import './style.css'

const Settings = () => {
  const { t } = useTranslation()
  const {
    isAutoRefresh,
    autoRefreshIntervalSeconds,
    pageSize,
    recDanmu,
    autoRec,
    remind,
  } = useSystemSettingsStore(state => state)
  const {
    resetConfig,
    setAutoRefresh,
    setAutoRefreshIntervalSeconds,
    setPageSize,
    setRecDanmu,
    setAutoRec,
    setRemind,
  } = useSystemSettingsStore(state => state)
  const FullRow = ({ children }) => <Col span={24}><Space size={24}>{children}</Space></Col>
  const overviewSettings = <>
    <FullRow>
      {`${t('AutoRefresh')}:`}
      <Space>
        <Checkbox onChange={e => setAutoRefresh(e.target.checked)} checked={isAutoRefresh} />
        <InputNumber
          onChange={setAutoRefreshIntervalSeconds}
          value={autoRefreshIntervalSeconds}
          min={10}
          max={86400}
          disabled={!isAutoRefresh}
          addonAfter={t('s')} />
      </Space>
    </FullRow>
    <FullRow>
      {`${t('PageSize')}:`}
      <InputNumber onChange={setPageSize} value={pageSize} min={4} max={64} />
    </FullRow>
    <FullRow>
      {`${t('DefaultRoomConfig')}:`}
      <Space><Checkbox onChange={e => setRecDanmu(e.target.checked)} checked={recDanmu} />{t('recDanmu')}</Space>
      <Space><Checkbox onChange={e => setAutoRec(e.target.checked)} checked={autoRec} />{t('autoRec')}</Space>
      <Space><Checkbox onChange={e => setRemind(e.target.checked)} checked={remind} />{t('remind')}</Space>
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
  </>
  return <div className="system-settings">
    <h3>{t('systemSettings')}</h3>
    <Divider />
    <Row align="middle" gutter={[16, 16]}>{overviewSettings}</Row>
    <Divider />
  </div>
}
export default Settings