import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Input,
  Button,
  Select,
  Empty,
  Tag,
  Popconfirm,
  message,
  Avatar,
  Space,
  Row,
  Col,
  Drawer,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  FolderOutlined,
  TagOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, deleteNote } from '../store/slices/noteSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { fetchTags } from '../store/slices/tagSlice';
import dayjs from 'dayjs';
import './HomePage.css';

const { Search } = Input;
const { Option } = Select;

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notes, loading } = useSelector((state) => state.note);
  const { categories } = useSelector((state) => state.category);
  const { tags } = useSelector((state) => state.tag);
  const { user } = useSelector((state) => state.auth);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTags());
    loadNotes();
  }, []);

  useEffect(() => {
    loadNotes();
  }, [selectedCategory, selectedTag, searchKeyword]);

  const loadNotes = () => {
    dispatch(
      fetchNotes({
        categoryId: selectedCategory || undefined,
        tagId: selectedTag || undefined,
        keyword: searchKeyword || undefined,
      })
    );
  };

  const handleDelete = async (noteId) => {
    try {
      await dispatch(deleteNote(noteId)).unwrap();
      message.success('删除成功');
      loadNotes();
    } catch (error) {
      message.error(error || '删除失败');
    }
  };

  const handleEdit = (noteId) => {
    navigate(`/note/edit/${noteId}`);
  };

  const handleShare = (note) => {
    // TODO: 实现分享功能
    message.info('分享功能开发中');
  };

  const categoryColors = {
    工作: '#1890ff',
    学习: '#52c41a',
    生活: '#722ed1',
    灵感: '#fa8c16',
    健康: '#f5222d',
  };

  const getCategoryColor = (categoryName) => {
    return categoryColors[categoryName] || '#1890ff';
  };

  return (
    <div className="home-page">
      {/* 顶部搜索栏 */}
      <div className="home-header">
        <div className="header-left">
          <Search
            placeholder="搜索笔记..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onSearch={loadNotes}
            style={{ width: '100%', maxWidth: '400px' }}
          />
          <Select
            placeholder="全部笔记"
            style={{ width: 120, marginLeft: 12 }}
            value={selectedCategory}
            onChange={setSelectedCategory}
            allowClear
          >
            <Option value="">全部笔记</Option>
            {categories.map((cat) => (
              <Option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </Option>
            ))}
          </Select>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate('/note/edit')}
          className="new-note-btn"
        >
          新建笔记
        </Button>
      </div>

      <Row gutter={16} className="home-content">
        {/* 主内容区 */}
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <div className="notes-section">
            <div className="section-header">
              <h2 className="section-title">最近笔记</h2>
              <Button type="link" onClick={() => navigate('/home')}>
                查看全部
              </Button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>
            ) : notes.length === 0 ? (
              <Empty
                description="暂无笔记，点击新建按钮开始记录"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/note/edit')}
                >
                  新建笔记
                </Button>
              </Empty>
            ) : (
              <Row gutter={[16, 16]} className="notes-grid">
                {notes.map((note) => (
                  <Col xs={24} sm={12} md={12} lg={12} xl={12} key={note.noteId}>
                    <Card
                      className="note-card"
                      hoverable
                      actions={[
                        <EditOutlined key="edit" onClick={() => handleEdit(note.noteId)} />,
                        <Popconfirm
                          key="delete"
                          title="确定要删除这条笔记吗？"
                          onConfirm={() => handleDelete(note.noteId)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <DeleteOutlined />
                        </Popconfirm>,
                        <ShareAltOutlined
                          key="share"
                          onClick={() => handleShare(note)}
                        />,
                      ]}
                    >
                      <div className="note-card-header">
                        {note.categoryName && (
                          <Tag
                            color={getCategoryColor(note.categoryName)}
                            className="category-tag"
                          >
                            {note.categoryName}
                          </Tag>
                        )}
                      </div>
                      <h3
                        className="note-title"
                        onClick={() => handleEdit(note.noteId)}
                      >
                        {note.title || '无标题'}
                      </h3>
                      <p className="note-summary">
                        {note.content
                          ?.replace(/<[^>]*>/g, '')
                          .substring(0, 100) || '暂无内容...'}
                      </p>
                      <div className="note-footer">
                        <span className="note-date">
                          {dayjs(note.createTime || note.updateTime).format('YYYY-MM-DD')}
                        </span>
                        <Space size={4}>
                          {note.tags?.map((tag) => (
                            <Tag key={tag.tagId} size="small" className="tag-item">
                              {tag.tagName}
                            </Tag>
                          ))}
                        </Space>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </Col>

        {/* 右侧边栏 */}
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <div className="sidebar">
            {/* 用户信息卡片 */}
            <Card className="user-card" size="small">
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                <Avatar
                  src={user?.avatar}
                  size={64}
                  icon={<SearchOutlined />}
                />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: '16px' }}>
                    {user?.nickname || '用户'}
                  </div>
                  {user?.signature && (
                    <div style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>
                      {user.signature}
                    </div>
                  )}
                </div>
              </Space>
            </Card>

            {/* 分类列表 */}
            <Card
              className="sidebar-card"
              title={
                <span>
                  <FolderOutlined /> 分类列表
                </span>
              }
              size="small"
            >
              <div className="category-list">
                <div
                  className={`category-item ${!selectedCategory ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('')}
                >
                  <span>全部笔记</span>
                  <span className="count">{notes.length}</span>
                </div>
                {categories.map((cat) => (
                  <div
                    key={cat.categoryId}
                    className={`category-item ${
                      selectedCategory === cat.categoryId ? 'active' : ''
                    }`}
                    onClick={() => setSelectedCategory(cat.categoryId)}
                  >
                    <span>{cat.categoryName}</span>
                    <span className="count">{cat.noteCount || 0}</span>
                  </div>
                ))}
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/category')}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  新建分类
                </Button>
              </div>
            </Card>

            {/* 标签云 */}
            <Card
              className="sidebar-card"
              title={
                <span>
                  <TagOutlined /> 标签云
                </span>
              }
              size="small"
            >
              <div className="tag-cloud">
                {tags.slice(0, 10).map((tag) => (
                  <Tag
                    key={tag.tagId}
                    className={`tag-cloud-item ${selectedTag === tag.tagId ? 'active' : ''}`}
                    onClick={() => setSelectedTag(selectedTag === tag.tagId ? '' : tag.tagId)}
                    style={{ cursor: 'pointer', marginBottom: '8px' }}
                  >
                    {tag.tagName}
                  </Tag>
                ))}
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/tag')}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  管理标签
                </Button>
              </div>
            </Card>

            {/* AI 助手 */}
            <Card className="ai-assistant-card" size="small">
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                <ThunderboltOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                <div style={{ fontWeight: 600, color: '#1890ff' }}>AI 助手</div>
                <div style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
                  智能辅助你的创作
                </div>
              </Space>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;

