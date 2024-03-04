import dayjs from "dayjs";
import useRecordingPath from "../../hooks/useRecordingPath"
import useFileNameAndPath from "../../hooks/useFileNameAndPath"
import { useTranslation } from "react-i18next";
import { useMount } from "ahooks";
import _ from "lodash"
import { Input, Space, Col, Row, Button, theme, Table, Popconfirm, message } from "antd";
const FullRow = ({ children }) => <Col span={24}><Space size={24}>{children}</Space></Col>
const BackEnd = () => {
  const { token } = theme.useToken()
  const color = token.colorText
  const style = { color }
  const { t } = useTranslation()
  const { isLoading, getPath, checkPath, checkPathData, applyPath, path, editPath } = useRecordingPath()
  useMount(getPath)
  const { isLoading: isLoadingPathName, getPathName, checkPathName, checkNameData, pathName, editPathName } = useFileNameAndPath()
  useMount(getPathName)
  const now = dayjs()
  const tagList = [
    { tag: "{ROOMID}", effect: t('roomID') },
    { tag: "{NAME}", effect: t('displayName') },
    { tag: "{TITLE}", effect: t('roomTitle') },
    { tag: "{DATE}", effect: now.format("YYYY_MM_DD") },
    { tag: "{YYYY} {yyyy}", effect: now.format("YYYY") },
    { tag: "{YY} {yy}", effect: now.format("YY") },
    { tag: `{MM} (${t('case-sensitive')})`, effect: now.format("MM") },
    { tag: "{DD} {dd}", effect: now.format("DD") },
    { tag: "{TIME}", effect: now.format("HH_mm_ss") },
    { tag: "{HH}", effect: now.format("HH") },
    { tag: `{mm} (${t('case-sensitive')})`, effect: now.format("mm") },
    { tag: "{SS} {ss}", effect: now.format("ss") },
    { tag: "{FFFF} {fff}", effect: now.format("SSS") },
    { tag: "{R}", effect: t('randomNumber') },
    { tag: "\\\\", effect: `(${t('Folder')})/` },
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
  const applyRecordingPathButton = <Popconfirm
    okText={t('Confirm')}
    onConfirm={applyPath}
    showCancel={false}
    description={<div style={{ width: 300 }}>{checkPathData?.message}</div>}
  >
    <Button onClick={checkPath}>{t('Apply')}</Button>
  </Popconfirm>

  const applyFileNameAndPathButton = <Popconfirm
    okText={t('Confirm')}
    onConfirm={applyPath}
    showCancel={false}
    description={<div style={{ width: 300 }}>{checkNameData?.message}</div>}
  >
    <Button onClick={checkPathName}>{t('Apply')}</Button>
  </Popconfirm>

  return <Row className="backtend-settings" align="middle" gutter={[16, 16]}>
    <FullRow>
      <span style={style}>{`${t('Path')}:`}</span>
      <Space>
        <Input style={{ width: '25vw' }} disabled={isLoading} value={path} onChange={e => editPath(e.target.value)} />
        {applyRecordingPathButton}
      </Space>
    </FullRow>
    <FullRow>
      <span style={style}>{`${t('File') + t('name')}:`}</span>
      <Space>
        <Input style={{ width: '25vw' }} disabled={isLoadingPathName} value={pathName} onChange={e => editPathName(e.target.value)} />
        {applyFileNameAndPathButton}
      </Space>
    </FullRow>
    <FullRow>{nameTable}</FullRow>
  </Row>
}
export default BackEnd