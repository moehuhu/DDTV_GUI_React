import NotFound from "../../../public/not_found.png"
import { Image, Button, theme } from "antd"
import { HomeFilled } from "@ant-design/icons"

const NoMatch = () => {
  const { token } = theme.useToken()
  return <div
    className="no-match"
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: "100vh",
      background: token.colorBgContainer
    }}>
    <Image
      preview={false}
      src={NotFound}
    />
    <Button
      onClick={() => window.location.href = "/"}
      icon={<HomeFilled />}
      type="primary"
      style={{ margin: token.marginLG }}
    />
  </div>
}
export default NoMatch