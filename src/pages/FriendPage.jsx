import { useEffect, useState } from 'react';
import {
  Card,
  Input,
  Button,
  List,
  Avatar,
  Space,
  message,
  Modal,
  Form,
  Popconfirm,
} from 'antd';
import {
  SearchOutlined,
  UserAddOutlined,
  MessageOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFriends, addFriend, deleteFriend } from '../store/slices/friendSlice';
import './FriendPage.css';

const FriendPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { friends, loading } = useSelector((state) => state.friend);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchFriends());
  }, []);

  const handleAddFriend = async (values) => {
    try {
      await dispatch(addFriend(values)).unwrap();
      message.success('好友请求已发送');
      setAddModalVisible(false);
      form.resetFields();
      dispatch(fetchFriends());
    } catch (error) {
      message.error(error || '添加好友失败');
    }
  };

  const handleDelete = async (friendId) => {
    try {
      await dispatch(deleteFriend(friendId)).unwrap();
      message.success('删除成功');
      dispatch(fetchFriends());
    } catch (error) {
      message.error(error || '删除失败');
    }
  };

  const filteredFriends = friends.filter((friend) =>
    friend.nickname?.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="friend-page">
      <Card
        title="好友列表"
        extra={
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setAddModalVisible(true)}
          >
            添加好友
          </Button>
        }
      >
        <Input
          placeholder="搜索好友..."
          prefix={<SearchOutlined />}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <List
          loading={loading}
          dataSource={filteredFriends}
          renderItem={(friend) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<MessageOutlined />}
                  onClick={() => navigate(`/chat/${friend.friendId}`)}
                >
                  聊天
                </Button>,
                <Popconfirm
                  title="确定要删除此好友吗？"
                  onConfirm={() => handleDelete(friend.friendId)}
                >
                  <Button type="link" danger icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={friend.avatar} icon={<UserAddOutlined />} />}
                title={friend.remark || friend.nickname}
                description={friend.signature || '暂无签名'}
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="添加好友"
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleAddFriend} layout="vertical">
          <Form.Item
            name="friendPhone"
            label="好友手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
            ]}
          >
            <Input placeholder="请输入好友手机号" />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input placeholder="请输入备注（可选）" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                发送请求
              </Button>
              <Button onClick={() => setAddModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FriendPage;

