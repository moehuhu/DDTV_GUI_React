
import { LockOutlined, KeyOutlined } from '@ant-design/icons';
import { Card, Button, Form, Input, Layout, App } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMount } from 'ahooks';
import useDokiDoki from '../../hooks/useDokiDoki';
import { useNavigate } from "react-router-dom";
import './style.css'

const Login = ({ setIsLoggedIn }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  useMount(() => navigate('/'))

  const usernameInput = <Form.Item
    name="AccessKeyId"
    rules={[
      {
        required: true,
        message: '',
      },
    ]}
  >
    <Input
      prefix={<KeyOutlined className="site-form-item-icon" />}
      placeholder="AccessKeyId"
    />
  </Form.Item>

  const passwordInput = <Form.Item
    name="AccessKeySecret"
    rules={[
      {
        required: true,
        message: '',
      },
    ]}
  >
    <Input
      prefix={<LockOutlined className="site-form-item-icon" />}
      type="password"
      placeholder="AccessKeySecret"
    />
  </Form.Item>

  const submitButtom = <Form.Item className='login-button-item'>
    <Button type="primary" htmlType="submit" className="login-form-button">
      {t('login')}
    </Button>
  </Form.Item>

  const { heartBeat } = useDokiDoki()
  const { message } = App.useApp()
  const onFinish = async (values) => {
    const { AccessKeyId, AccessKeySecret } = values
    localStorage.setItem('AccessKeyId', AccessKeyId)
    localStorage.setItem('AccessKeySecret', AccessKeySecret)
    const [err, res] = await heartBeat()
    if (res) { setIsLoggedIn?.(true) }
    if (err) {
      localStorage.removeItem('AccessKeyId')
      localStorage.removeItem('AccessKeySecret')
      setIsLoggedIn?.(false)
      message.error(err?.message)
    }
  }

  const form = <Form
    name="login-form"
    className="login-form"
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
  >
    {usernameInput}
    {passwordInput}
    {submitButtom}
  </Form>

  const card = <Card className='login-card' style={{ width: 300, }} >{form}</Card>

  return <Layout className="login">{card}</Layout>

};
export default Login;