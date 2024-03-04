import dayjs from "dayjs";
import useRecordingPath from "../../hooks/useRecordingPath"
import useFileNameAndPath from "../../hooks/useFileNameAndPath"
import { useTranslation } from "react-i18next";
import { useMount } from "ahooks";
import _ from "lodash"
import { Input, Space, Col, Row, Button, theme, Table } from "antd";
const FullRow = ({ children }) => <Col span={24}><Space size={24}>{children}</Space></Col>
const BackEnd = () => {
  const { token } = theme.useToken()
  const color = token.colorText
  const style = { color }
  const { t } = useTranslation()
  const { isLoading, getPath, checkAndApplyPath, path, editPath } = useRecordingPath()
  useMount(getPath)
  const { isLoading: isLoadingPathName, getPathName, checkAndApplyPathName, pathName, editPathName } = useFileNameAndPath()
  useMount(getPathName)
  const now = dayjs()
  const tagList = [
    { tag: "{ROOMID}", effect: t('roomID') },
    { tag: "{NAME}", effect: t('displayName') },
    { tag: "{TITLE}", effect: t('roomTitle') },
    { tag: "{DATE}", effect: now.format("YYYY_MM_DD") },
    { tag: "{TIME}", effect: now.format("HH_mm_ss") },
    { tag: "{YYYY},{yyyy}", effect: now.format("YYYY") },
    { tag: "{YY},{yy}", effect: now.format("YY") },
    { tag: "{MM}", effect: now.format("MM") },
    { tag: "{DD},{dd}", effect: now.format("DD") },
    { tag: "{HH}", effect: now.format("HH") },
    { tag: "{mm}", effect: now.format("mm") },
    { tag: "{SS},{ss}", effect: now.format("ss") },
    { tag: "{FFFF},{fff}", effect: now.format("SSS") + '(ms)' },
    { tag: "{R}", effect: t('randomNumber') },
    { tag: "\\\\", effect: "/" },
  ]
  const nameTable = <Table
    columns={[
      {
        title: t('Tag'),
        dataIndex: 'tag'
      },
      {
        title: t('Effect'),
        dataIndex: 'effect'
      }
    ]}
    dataSource={tagList}
    style={{ width: '25vw' }}
    scroll={{ y: 400 }}
    pagination={false}
  />

  return <Row className="backtend-settings" align="middle" gutter={[16, 16]}>
    <FullRow>
      <span style={style}>{`${t('Path')}:`}</span>
      <Space>
        <Input style={{ width: '25vw' }} disabled={isLoading} value={path} onChange={e => editPath(e.target.value)} />
        <Button onClick={checkAndApplyPath}>{t('Apply')}</Button>
      </Space>
    </FullRow>
    <FullRow>
      <span style={style}>{`${t('File') + t('name')}:`}</span>
      <Space>
        <Input style={{ width: '25vw' }} disabled={isLoadingPathName} value={pathName} onChange={e => editPathName(e.target.value)} />
        <Button onClick={checkAndApplyPathName}>{t('Apply')}</Button>
      </Space>
    </FullRow>
    <FullRow>{nameTable}</FullRow>
  </Row>
}
export default BackEnd