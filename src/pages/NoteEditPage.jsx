import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Input,
  Button,
  Space,
  message,
  Select,
  Tag,
  Drawer,
  List,
  Modal,
  Card,
} from 'antd';
import {
  SaveOutlined,
  EyeOutlined,
  HistoryOutlined,
  ShareAltOutlined,
  ArrowLeftOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNoteDetail,
  createNote,
  updateNote,
  fetchNoteVersions,
} from '../store/slices/noteSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { fetchTags } from '../store/slices/tagSlice';
import dayjs from 'dayjs';
import './NoteEditPage.css';

const { Option } = Select;

const NoteEditPage = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentNote, saving } = useSelector((state) => state.note);
  const { categories } = useSelector((state) => state.category);
  const { tags } = useSelector((state) => state.tag);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [versionDrawerVisible, setVersionDrawerVisible] = useState(false);
  const [aiDrawerVisible, setAiDrawerVisible] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const saveTimerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTags());
    if (noteId) {
      loadNoteDetail();
    }
  }, [noteId]);

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title || '');
      setContent(currentNote.content || '');
      setCategoryId(currentNote.categoryId || '');
      setSelectedTags(currentNote.tagIds || []);
    }
  }, [currentNote]);

  useEffect(() => {
    // 自动保存
    if (title || content) {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(() => {
        autoSave();
      }, 30000); // 30秒自动保存
    }
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [title, content, categoryId, selectedTags]);

  const loadNoteDetail = async () => {
    try {
      await dispatch(fetchNoteDetail(noteId)).unwrap();
    } catch (error) {
      message.error(error || '加载笔记失败');
    }
  };

  const autoSave = async () => {
    if (!noteId) return;
    try {
      await dispatch(
        updateNote({
          noteId,
          title,
          content,
          categoryId: categoryId || undefined,
          tagIds: selectedTags,
        })
      ).unwrap();
      setSaveStatus('已自动保存');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('自动保存失败:', error);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      message.warning('请输入笔记标题');
      return;
    }
    try {
      if (noteId) {
        await dispatch(
          updateNote({
            noteId,
            title,
            content,
            categoryId: categoryId || undefined,
            tagIds: selectedTags,
          })
        ).unwrap();
        message.success('保存成功');
      } else {
        const result = await dispatch(
          createNote({
            title,
            content,
            categoryId: categoryId || undefined,
            tagIds: selectedTags,
          })
        ).unwrap();
        message.success('创建成功');
        navigate(`/note/edit/${result.data.noteId}`);
      }
      setSaveStatus('已保存');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      message.error(error || '保存失败');
    }
  };

  const handleShare = () => {
    if (!noteId) {
      message.warning('请先保存笔记');
      return;
    }
    // TODO: 实现分享功能
    message.info('分享功能开发中');
  };

  const handleVersionHistory = () => {
    if (!noteId) {
      message.warning('请先保存笔记');
      return;
    }
    dispatch(fetchNoteVersions({ noteId }));
    setVersionDrawerVisible(true);
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <div className="note-edit-page">
      {/* 顶部操作栏 */}
      <div className="edit-header">
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/home')}
          >
            返回
          </Button>
          <Input
            placeholder="请输入笔记标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input"
            style={{ width: '300px' }}
          />
        </Space>
        <Space>
          <Select
            placeholder="选择分类"
            style={{ width: 150 }}
            value={categoryId}
            onChange={setCategoryId}
            allowClear
          >
            {categories.map((cat) => (
              <Option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </Option>
            ))}
          </Select>
          <Select
            mode="multiple"
            placeholder="选择标签"
            style={{ width: 200 }}
            value={selectedTags}
            onChange={setSelectedTags}
            tagRender={(props) => (
              <Tag {...props} closable={props.closable}>
                {props.label}
              </Tag>
            )}
          >
            {tags.map((tag) => (
              <Option key={tag.tagId} value={tag.tagId}>
                {tag.tagName}
              </Option>
            ))}
          </Select>
          <Button
            icon={<EyeOutlined />}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? '编辑' : '预览'}
          </Button>
          <Button
            icon={<HistoryOutlined />}
            onClick={handleVersionHistory}
            disabled={!noteId}
          >
            版本历史
          </Button>
          <Button
            icon={<ShareAltOutlined />}
            onClick={handleShare}
            disabled={!noteId}
          >
            分享
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
          >
            保存
          </Button>
        </Space>
      </div>

      {/* 编辑区 */}
      <div className="edit-content">
        {previewMode ? (
          <div className="preview-area">
            <h1>{title || '无标题'}</h1>
            <div
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        ) : (
          <div className="editor-area">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={quillModules}
              placeholder="开始记录你的想法..."
              style={{ height: 'calc(100vh - 250px)', minHeight: '500px' }}
            />
          </div>
        )}
      </div>

      {/* 底部状态栏 */}
      <div className="edit-footer">
        <Space>
          <span>字数: {content.replace(/<[^>]*>/g, '').length}</span>
          <span>|</span>
          <span>{saveStatus || '已自动保存'}</span>
          {currentNote && (
            <>
              <span>|</span>
              <span>
                最后保存: {dayjs(currentNote.updateTime).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            </>
          )}
        </Space>
      </div>

      {/* 版本历史抽屉 */}
      <Drawer
        title="版本历史"
        placement="right"
        width={600}
        open={versionDrawerVisible}
        onClose={() => setVersionDrawerVisible(false)}
      >
        <VersionHistoryList noteId={noteId} />
      </Drawer>

      {/* AI 助手抽屉 */}
      <Drawer
        title={
          <Space>
            <ThunderboltOutlined style={{ color: '#1890ff' }} />
            <span>AI 助手</span>
          </Space>
        }
        placement="right"
        width={400}
        open={aiDrawerVisible}
        onClose={() => setAiDrawerVisible(false)}
      >
        <AIAssistant content={content} onApply={(text) => setContent(text)} />
      </Drawer>
    </div>
  );
};

// 版本历史列表组件
const VersionHistoryList = ({ noteId }) => {
  const dispatch = useDispatch();
  const { versions } = useSelector((state) => state.note);
  const navigate = useNavigate();

  useEffect(() => {
    if (noteId) {
      dispatch(fetchNoteVersions({ noteId }));
    }
  }, [noteId]);

  const handleRollback = (versionId) => {
    // TODO: 实现版本回滚
    Modal.confirm({
      title: '确认回滚',
      content: '确定要回滚到此版本吗？当前版本将被覆盖。',
      onOk: () => {
        // 调用回滚API
        message.info('回滚功能开发中');
      },
    });
  };

  return (
    <List
      dataSource={versions}
      renderItem={(version) => (
        <List.Item>
          <Card style={{ width: '100%' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>
                版本 {version.versionId}
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                {dayjs(version.createTime).format('YYYY-MM-DD HH:mm:ss')} ·{' '}
                {version.editorName}
              </div>
              <div style={{ fontSize: '14px', color: '#595959' }}>
                {version.contentDesc}
              </div>
              <Button
                type="link"
                size="small"
                onClick={() => handleRollback(version.versionId)}
                style={{ marginTop: '8px' }}
              >
                回滚至此版本
              </Button>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

// AI 助手组件
const AIAssistant = ({ content, onApply }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleAIAction = async (action) => {
    if (!content.trim()) {
      message.warning('请先输入笔记内容');
      return;
    }
    setLoading(true);
    try {
      // TODO: 调用AI接口
      setTimeout(() => {
        setResult('AI处理结果：这是示例结果，实际需要对接AI服务');
        setLoading(false);
      }, 2000);
    } catch (error) {
      message.error('AI处理失败');
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          block
          onClick={() => handleAIAction('summary')}
          loading={loading}
        >
          生成摘要
        </Button>
        <Button
          block
          onClick={() => handleAIAction('correct')}
          loading={loading}
        >
          内容纠错
        </Button>
        <Button
          block
          onClick={() => handleAIAction('keywords')}
          loading={loading}
        >
          提取关键词
        </Button>
      </Space>
      {result && (
        <Card style={{ marginTop: '16px' }}>
          <div>{result}</div>
          <Space style={{ marginTop: '12px' }}>
            <Button size="small" onClick={() => navigator.clipboard.writeText(result)}>
              复制结果
            </Button>
            <Button
              type="primary"
              size="small"
              onClick={() => onApply(result)}
            >
              应用到笔记
            </Button>
          </Space>
        </Card>
      )}
    </div>
  );
};

export default NoteEditPage;

