import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Form,
  Input,
  Modal,
  message,
  Popconfirm,
  Space,
  Tag,
  Row,
  Col,
  ColorPicker,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTags, createTag, updateTag, deleteTag } from '../store/slices/tagSlice';
import './TagPage.css';

const TagPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { tags, loading } = useSelector((state) => state.tag);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  useEffect(() => {
    dispatch(fetchTags());
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editingTag) {
        await dispatch(updateTag({ tagId: editingTag.tagId, ...values })).unwrap();
        message.success('更新成功');
      } else {
        await dispatch(createTag(values)).unwrap();
        message.success('创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingTag(null);
      dispatch(fetchTags());
    } catch (error) {
      message.error(error || '操作失败');
    }
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    form.setFieldsValue({ ...tag, color: tag.color || '#1890ff' });
    setModalVisible(true);
  };

  const handleDelete = async (tagId) => {
    try {
      await dispatch(deleteTag(tagId)).unwrap();
      message.success('删除成功');
      dispatch(fetchTags());
    } catch (error) {
      message.error(error || '删除失败');
    }
  };

  const handleAdd = () => {
    setEditingTag(null);
    form.resetFields();
    setModalVisible(true);
  };

  return (
    <div className="tag-page">
      <Card
        title="标签管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建标签
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
          {tags.map((tag) => (
            <Col xs={12} sm={8} md={6} lg={4} xl={4} key={tag.tagId}>
              <Card
                className="tag-card"
                hoverable
                actions={[
                  <EditOutlined key="edit" onClick={() => handleEdit(tag)} />,
                  <Popconfirm
                    key="delete"
                    title="确定要删除此标签吗？"
                    onConfirm={() => handleDelete(tag.tagId)}
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
                ]}
              >
                <Tag color={tag.color || '#1890ff'} style={{ fontSize: '14px' }}>
                  {tag.tagName}
                </Tag>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
                  使用次数: {tag.noteCount || 0}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Modal
        title={editingTag ? '编辑标签' : '新建标签'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingTag(null);
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="tagName"
            label="标签名称"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
          <Form.Item
            name="color"
            label="标签颜色"
            initialValue="#1890ff"
          >
            <ColorPicker showText />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingTag ? '更新' : '创建'}
              </Button>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                }}
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagPage;

