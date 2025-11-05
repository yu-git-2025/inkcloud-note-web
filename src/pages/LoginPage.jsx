import { useState } from 'react';
import { Form, Input, Button, message, Tabs, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, sendVerificationCode } from '../store/slices/authSlice';
import './LoginPage.css';

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loginType, setLoginType] = useState('password'); // password 或 code
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, codeLoading } = useSelector((state) => state.auth);

  const handleSendCode = async () => {
    try {
      const phone = form.getFieldValue('phone');
      if (!phone) {
        message.error('请先输入手机号');
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        message.error('手机号格式不正确');
        return;
      }
      const businessType = 1;
      await dispatch(sendVerificationCode({ phone, businessType })).unwrap();
      message.success('验证码已发送');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      message.error(error || '发送验证码失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        login({
          phone: values.phone,
          code: loginType === 'code' ? values.code : undefined,
          password: loginType === 'password' ? values.password : undefined,
        })
      ).unwrap();
      message.success('登录成功');
      navigate('/home');
    } catch (error) {
      message.error(error || '登录失败');
    }
  };

  const tabItems = [
    {
      key: 'password',
      label: '密码登录',
    },
    {
      key: 'code',
      label: '验证码登录',
    },
  ];

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <div className="login-logo">
            <UserOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
          </div>
          <h1 className="login-title">云创笔记</h1>
          <p className="login-slogan">记录每一刻，让知识更有价值</p>
        </div>
        <div className="login-right">
          <Tabs
            activeKey={loginType}
            onChange={setLoginType}
            items={tabItems}
            className="login-tabs"
          />
          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入手机号"
                maxLength={11}
                autoComplete="tel"
              />
            </Form.Item>

            {loginType === 'password' ? (
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                />
              </Form.Item>
            ) : (
              <Form.Item
                name="code"
                rules={[{ required: true, message: '请输入验证码' }]}
              >
                <Input
                  prefix={<SafetyOutlined />}
                  placeholder="请输入验证码"
                  maxLength={6}
                  suffix={
                    <Button
                      type="link"
                      onClick={handleSendCode}
                      disabled={countdown > 0}
                      style={{ padding: 0 }}
                      loading={codeLoading}
                    >
                      {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                    </Button>
                  }
                />
              </Form.Item>
            )}

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/forgot-password">忘记密码？</Link>
                <Link to="/register">立即注册</Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="login-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

