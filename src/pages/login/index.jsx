
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Button, Form, Input, Layout } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMount } from 'ahooks';
import { useNavigate } from "react-router-dom";
import './style.css'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  useMount(() => navigate('/'))

  const usernameInput = <Form.Item
    name="username"
    rules={[
      {
        required: true,
        message: t('Please input your Username!'),
      },
    ]}
  >
    <Input
      prefix={<UserOutlined className="site-form-item-icon" />}
      placeholder={t('username')}
    />
  </Form.Item>

  const passwordInput = <Form.Item
    name="password"
    rules={[
      {
        required: true,
        message: t('Please input your Password!'),
      },
    ]}
  >
    <Input
      prefix={<LockOutlined className="site-form-item-icon" />}
      type="password"
      placeholder={t('password')}
    />
  </Form.Item>

  const testLogin = <Form.Item>
    <a
      className="login-form-test"
      href="" onClick={() => {
        localStorage.setItem('AccessKeyId', 'ddtv')
        localStorage.setItem('AccessKeySecret', 'ddtv')
      }}
    >
      测试登录
    </a>
  </Form.Item>

  const submitButtom = <Form.Item>
    <Button type="primary" htmlType="submit" className="login-form-button">
      {t('login')}
    </Button>
  </Form.Item>

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
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
    {testLogin}
    {submitButtom}
  </Form>

  const card = <Card className='login-card' style={{ width: 300, }} >{form}</Card>

  return <Layout className="login">{card}</Layout>

};
export default Login;