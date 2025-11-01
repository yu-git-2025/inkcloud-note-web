import { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Upload,
  message,
  Tabs,
  Space,
  Descriptions,
  Row,
  Col,
} from 'antd';
import {
  UserOutlined,
  UploadOutlined,
  LockOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from '../store/slices/userSlice';
import './ProfilePage.css';

const ProfilePage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue(profile);
    }
  }, [profile]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(updateUserProfile(values)).unwrap();
      message.success('更新成功');
    } catch (error) {
      message.error(error || '更新失败');
    }
  };

  const tabItems = [
    {
      key: 'account',
      label: '账号设置',
      children: (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="nickname" label="昵称">
            <Input placeholder="请输入昵称" maxLength={10} />
          </Form.Item>
          <Form.Item name="signature" label="个性签名">
            <Input.TextArea
              placeholder="请输入个性签名"
              maxLength={50}
              rows={3}
            />
          </Form.Item>
          <Form.Item name="avatar" label="头像">
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={() => false}
            >
              <Avatar
                size={100}
                src={profile?.avatar || user?.avatar}
                icon={<UserOutlined />}
              />
              <div style={{ marginTop: 8 }}>上传头像</div>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'security',
      label: '安全设置',
      children: (
        <Card>
          <Form layout="vertical">
            <Form.Item label="修改密码" name="oldPassword">
              <Input.Password placeholder="请输入原密码" autoComplete="current-password" />
            </Form.Item>
            <Form.Item name="newPassword">
              <Input.Password placeholder="请输入新密码" autoComplete="new-password" />
            </Form.Item>
            <Form.Item name="confirmPassword">
              <Input.Password placeholder="请确认新密码" autoComplete="new-password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary">修改密码</Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'info',
      label: '个人信息',
      children: (
        <Card>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="用户ID">
              {profile?.userId || user?.userId}
            </Descriptions.Item>
            <Descriptions.Item label="手机号">
              {profile?.phone || '未绑定'}
            </Descriptions.Item>
            <Descriptions.Item label="昵称">
              {profile?.nickname || user?.nickname}
            </Descriptions.Item>
            <Descriptions.Item label="个性签名">
              {profile?.signature || '暂无'}
            </Descriptions.Item>
            <Descriptions.Item label="注册时间">
              {profile?.createTime || '未知'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ),
    },
  ];

  return (
    <div className="profile-page">
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card style={{ textAlign: 'center' }}>
            <Avatar
              size={120}
              src={profile?.avatar || user?.avatar}
              icon={<UserOutlined />}
            />
            <h2 style={{ marginTop: 16, marginBottom: 8 }}>
              {profile?.nickname || user?.nickname}
            </h2>
            <p style={{ color: '#999' }}>{profile?.signature || '暂无签名'}</p>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card>
            <Tabs items={tabItems} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;

