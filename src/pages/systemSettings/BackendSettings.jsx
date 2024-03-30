import useCoreVersion from "../../hooks/useCoreVersion";
import useResetConfig from "../../hooks/useResetConfig";
import useAutoRepair from "../../hooks/useAutoRepair";
import useHLSTime from "../../hooks/useHLSTime";
import useRecordingPath from "../../hooks/useRecordingPath"
import useFileNameAndPath from "../../hooks/useFileNameAndPath"
import useLoginBiliBili from "../../hooks/useLoginBiliBili";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useMount, useResponsive, } from "ahooks";
import { Avatar, Input, InputNumber, Checkbox, Space, Col, Row, Button, theme, Table, Popconfirm } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import _ from "lodash"

const FullRow = ({ children }) => <Col span={24}><Space size={24}>{children}</Space></Col>
const BackEnd = (props) => {
  const { token } = theme.useToken()
  const color = token.colorText
  const style = { color }
  const { t } = useTranslation()
  const { loginStatus } = props
  const { getLoginUser, userInfo, relogin } = useLoginBiliBili()
  useMount(getLoginUser)
  const { isLoading, getPath, checkPath,
    checkPathData, setCheckData, applyPath, path, editPath } = useRecordingPath()
  useMount(getPath)
  const { isLoading: isLoadingPathName, getPathName, checkPathName,
    checkNameData, setCheckNameData, applyPathName, pathName, editPathName } = useFileNameAndPath()
  useMount(getPathName)
  const { isLoading: isLoadingHLSTime, time, setTime, getHLSTime, setHLSTime } = useHLSTime()
  useMount(getHLSTime)
  const { isLoading: isLoadingAutoRepair, isAutoRepair, setIsAutoRepair, getRepairConfig, setRepairConfig } = useAutoRepair()
  useMount(getRepairConfig)
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
    { tag: "{R}", effect: t('randomString') },
    { tag: "/", effect: `(${t('Folder')})/` },
    { tag: "\\\\", effect: `(${t('Folder')})/` },
  ]
  const responsive = useResponsive();
  const nameTable = <Table
    columns={[
      {
        title: `${t('File')}${t('name')}`,
        dataIndex: 'tag'
      },
      {
        title: t('Effect'),
        dataIndex: 'effect'
      }
    ]}
    dataSource={tagList}
    style={{ width: responsive.sm ? '25vw' : '60vw' }}
    scroll={{ y: 400 }}
    pagination={false}
  />
  const failedIcon = <CloseCircleFilled style={{ color: token.colorError }} />
  const applyRecordingPathButton = <Popconfirm
    okText={t('Confirm')}
    icon={checkPathData?.checkFailed ? failedIcon : undefined}
    onConfirm={applyPath}
    onOpenChange={open => !open && setCheckData(null)}
    open={!_.isEmpty(checkPathData)}
    showCancel={false}
    title={checkPathData?.title}
    description={<div style={{ width: 300 }}>{checkPathData?.message}</div>}
  >
    <Button loading={isLoading} onClick={checkPath}>{t('Apply')}</Button>
  </Popconfirm>

  const applyFileNameAndPathButton = <Popconfirm
    okText={t('Confirm')}
    icon={checkNameData?.checkFailed ? failedIcon : undefined}
    onConfirm={applyPathName}
    onOpenChange={open => !open && setCheckNameData(null)}
    open={!_.isEmpty(checkNameData)}
    showCancel={false}
    title={checkNameData?.title}
    description={<div style={{ width: 300 }}>{checkNameData?.message}</div>}
  >
    <Button loading={isLoadingPathName} onClick={checkPathName}>{t('Apply')}</Button>
  </Popconfirm>

  const renderFullRow = (title, content) => <FullRow>
    <span style={style}>{`${title}:`}</span>
    <Space>{content}</Space>
  </FullRow>
  const setAutoRepair = renderFullRow(t('AutoRepair'),
    <><Checkbox
      onChange={e => setIsAutoRepair(e.target.checked)}
      checked={isAutoRepair}
      disabled={isLoadingAutoRepair} />
      <Button onClick={() => setRepairConfig()}>{t('Apply')}</Button></>)
  const setHLS = renderFullRow(t('HLS Waiting Time'),
    <><InputNumber
      style={{ width: '80px' }}
      min={0}
      disabled={isLoadingHLSTime}
      value={time}
      onChange={setTime} />
      <span style={style}>{t('s')}</span>
      <Button onClick={() => setHLSTime()}>{t('Apply')}</Button></>)
  const setPath = renderFullRow(t('Path'),
    <><Input
      style={{ width: '25vw' }}
      disabled={isLoading}
      value={path}
      onChange={e => editPath(e.target.value)} />
      {applyRecordingPathButton}</>)
  const setFilename = renderFullRow(`${t('File')}${t('name')}`,
    <><Input
      style={{ width: '25vw' }}
      disabled={isLoadingPathName}
      value={pathName}
      onChange={e => editPathName(e.target.value)} />
      {applyFileNameAndPathButton}</>)

  const noAvatar = 'https://i0.hdslb.com/bfs/face/member/noface.jpg@52w_52h_1c_1s.webp'
  const avatar = <Avatar className="avatar" src={userInfo?.face || noAvatar} />
  const name = <h4
    className="name"
    style={{ lineHeight: token.lineHeight, color: token.colorText }}>
    {userInfo?.uname}
  </h4>
  const description = <span
    className="description"
    style={{ lineHeight: token.lineHeight, color: token.colorText }}>
    {`UID: ${userInfo?.mid} `}
  </span>
  const user = <div
    style={{ borderRadius: token.borderRadiusLG, borderColor: token.colorBorder }}
    className="user">
    {avatar}
    <div className="info">{name}{description}</div>
    {<Button onClick={relogin}>{t('logout')}</Button>}
  </div>
  const setUser = renderFullRow(t('User'), user)
  return <Row className="backtend-settings" align="middle" gutter={[16, 16]}>
    {setAutoRepair}
    {setHLS}
    {setPath}
    {setFilename}
    {loginStatus && setUser}
  </Row>
}
export default BackEnd