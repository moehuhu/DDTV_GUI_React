import { Col, Row, Space, theme } from "antd";
import { useTranslation } from "react-i18next";
const FullRow = ({ children }) => <Col span={24}><Space size={24}>{children}</Space></Col>
const About = () => {
  const { token } = theme.useToken()
  const { t } = useTranslation();
  const color = token.colorText
  const style = { color }
  const renderFullRow = (title, content) => <FullRow>
    <span style={style}>{`${title}:`}</span>
    <Space>{content}</Space>
  </FullRow>
  const xiaobi = <a onClick={() => window.open("https://space.bilibili.com/225553")}
    style={{ ...style, textDecoration: 'underline' }}>
    {'彼方鸢羽_Official'}
  </a>
  const nene = <a onClick={() => window.open("https://space.bilibili.com/1716560")}
    style={{ ...style, textDecoration: 'underline' }}>
    {'柠宁Ramune'}
  </a>
  const shigure = <a onClick={() => window.open("https://space.bilibili.com/32827764")}
    style={{ ...style, textDecoration: 'underline' }}>
    {'神乐时雨Ch'}
  </a>
  return <div>
    <h3>{t('About')}</h3>
    <Row className="about" align="middle" gutter={[16, 16]}>
      {renderFullRow(t('jpTranslation'), <span>{xiaobi}, {nene}, {shigure}</span>)}
    </Row>
  </div>
}
export default About