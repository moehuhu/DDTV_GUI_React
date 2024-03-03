import { Image, theme } from "antd"
import NotFound from "../../../public/not_found.png"
const NoMatch = () => {
  const { token } = theme.useToken()
  return <div
    className="no-match"
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: "100vh",
      background: token.colorBgContainer
    }}>
    <Image preview={false} src={NotFound} />
  </div>
}
export default NoMatch