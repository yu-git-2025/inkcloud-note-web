import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  Input,
  Button,
  List,
  Avatar,
  Space,
  message,
  Empty,
} from 'antd';
import { SendOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatMessages, sendMessage, addMessage, setCurrentFriend } from '../store/slices/chatSlice';
import { fetchFriends } from '../store/slices/friendSlice';
import dayjs from 'dayjs';
import './ChatPage.css';

const { TextArea } = Input;

const ChatPage = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chat);
  const { friends } = useSelector((state) => state.friend);
  const { user } = useSelector((state) => state.auth);

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const currentFriend = friends.find((f) => f.friendId === friendId);

  useEffect(() => {
    if (friendId) {
      dispatch(fetchChatMessages({ friendId }));
      dispatch(setCurrentFriend(friendId));
      dispatch(fetchFriends());
    }
  }, [friendId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!inputValue.trim()) {
      return;
    }
    try {
      await dispatch(
        sendMessage({
          receiveUserId: friendId,
          content: inputValue,
          type: 1,
        })
      ).unwrap();
      setInputValue('');
    } catch (error) {
      message.error(error || '发送失败');
    }
  };

  const chatMessages = friendId ? messages[friendId] || [] : [];

  return (
    <div className="chat-page">
      {friendId && currentFriend ? (
        <>
          <Card className="chat-header" size="small">
            <Space>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/friend')}
              />
              <Avatar src={currentFriend.avatar} icon={<UserOutlined />} />
              <div>
                <div style={{ fontWeight: 600 }}>
                  {currentFriend.remark || currentFriend.nickname}
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>在线</div>
              </div>
            </Space>
          </Card>
          <div className="chat-messages">
            <List
              dataSource={chatMessages}
              renderItem={(msg) => {
                const isOwn = msg.sendUserId === user?.userId;
                return (
                  <div className={`message-item ${isOwn ? 'own' : ''}`}>
                    <Avatar
                      src={isOwn ? user?.avatar : currentFriend.avatar}
                      icon={<UserOutlined />}
                    />
                    <div className="message-content">
                      <div className="message-bubble">{msg.content}</div>
                      <div className="message-time">
                        {dayjs(msg.sendTime).format('HH:mm')}
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <div ref={messagesEndRef} />
          </div>
          <Card className="chat-input-area" size="small">
            <Space.Compact style={{ width: '100%' }}>
              <TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="输入消息..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                发送
              </Button>
            </Space.Compact>
          </Card>
        </>
      ) : (
        <Empty description="请选择好友开始聊天" />
      )}
    </div>
  );
};

export default ChatPage;

