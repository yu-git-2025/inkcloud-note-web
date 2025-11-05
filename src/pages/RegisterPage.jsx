import { useState } from 'react';
import { Form, Input, Button, message, Tabs, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, sendVerificationCode } from '../store/slices/authSlice';
import './RegisterPage.css';

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [registerType, setRegisterType] = useState('password');
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
      const businessType = 0;
      await dispatch(sendVerificationCode({phone,businessType})).unwrap();
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
      if (registerType === 'password' && values.password !== values.confirmPassword) {
        message.error('两次输入的密码不一致');
        return;
      }
      await dispatch(
        register({
          phone: values.phone,
          code: registerType === 'code' ? values.code : undefined,
          password: registerType === 'password' ? values.password : undefined,
        })
      ).unwrap();
      message.success('注册成功');
      navigate('/login', { replace: true });
    } catch (error) {
      message.error(error || '注册失败');
    }
  };

  const tabItems = [
    {
      key: 'password',
      label: '密码注册',
    },
    {
      key: 'code',
      label: '验证码注册',
    },
  ];

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-left">
          <div className="register-logo">
            <UserOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
          </div>
          <h1 className="register-title">加入云创笔记</h1>
          <p className="register-slogan">开启你的知识管理之旅</p>
        </div>
        <div className="register-right">
          <Tabs
            activeKey={registerType}
            onChange={setRegisterType}
            items={tabItems}
            className="register-tabs"
          />
          <Form
            form={form}
            name="register"
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

            {registerType === 'password' ? (
              <>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码' },
                    { min: 6, message: '密码长度至少6位' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请输入密码（至少6位）"
                    autoComplete="new-password"
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请确认密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="请确认密码"
                    autoComplete="new-password"
                  />
                </Form.Item>
              </>
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

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error('请同意用户协议')),
                },
              ]}
            >
              <Checkbox>
                我已阅读并同意
                <Link to="/agreement" target="_blank">
                  用户协议
                </Link>
                和
                <Link to="/privacy" target="_blank">
                  隐私政策
                </Link>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="register-button"
              >
                注册
              </Button>
            </Form.Item>

            <Form.Item>
              <div style={{ textAlign: 'center' }}>
                已有账号？
                <Link to="/login">立即登录</Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

