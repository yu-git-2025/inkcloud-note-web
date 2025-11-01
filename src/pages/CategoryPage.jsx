import { useEffect, useState } from 'react';
import {
  Tree,
  Button,
  Form,
  Input,
  Modal,
  message,
  Popconfirm,
  Space,
  Card,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../store/slices/categorySlice';
import './CategoryPage.css';

const CategoryPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({ categoryId: editingCategory.categoryId, ...values })
        ).unwrap();
        message.success('更新成功');
      } else {
        await dispatch(createCategory(values)).unwrap();
        message.success('创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
      dispatch(fetchCategories());
    } catch (error) {
      message.error(error || '操作失败');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setModalVisible(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      await dispatch(deleteCategory(categoryId)).unwrap();
      message.success('删除成功');
      dispatch(fetchCategories());
    } catch (error) {
      message.error(error || '删除失败');
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const treeData = categories.map((cat) => ({
    title: (
      <div className="tree-node">
        <span>{cat.categoryName}</span>
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(cat);
            }}
          />
          <Popconfirm
            title="确定要删除此分类吗？删除后该分类下的所有笔记将被移动到默认分类。"
            onConfirm={(e) => {
              e.stopPropagation();
              handleDelete(cat.categoryId);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </Space>
      </div>
    ),
    key: cat.categoryId,
    noteCount: cat.noteCount || 0,
  }));

  return (
    <div className="category-page">
      <Card
        title="分类管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新建分类
          </Button>
        }
      >
        <div className="category-content">
          <Tree
            treeData={treeData}
            selectedKeys={selectedKeys}
            onSelect={setSelectedKeys}
            defaultExpandAll
            className="category-tree"
          />
        </div>
      </Card>

      <Modal
        title={editingCategory ? '编辑分类' : '新建分类'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingCategory(null);
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="categoryName"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item
            name="sortOrder"
            label="排序号"
            rules={[{ type: 'number', transform: (value) => Number(value) }]}
          >
            <Input type="number" placeholder="数字越小越靠前" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCategory ? '更新' : '创建'}
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

export default CategoryPage;

