import { useEffect } from 'react';
import { Card, Row, Col, Statistic, Space } from 'antd';
import { FileTextOutlined, FolderOutlined, TagOutlined } from '@ant-design/icons';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserStatistics } from '../store/slices/userSlice';
import './StatisticsPage.css';

const StatisticsPage = () => {
  const dispatch = useDispatch();
  const { statistics } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserStatistics());
  }, []);

  const categoryData = statistics?.categoryStats || [];
  const tagData = statistics?.tagStats || [];
  const monthlyData = statistics?.monthlyStats || [];

  const COLORS = ['#1890ff', '#52c41a', '#722ed1', '#fa8c16', '#f5222d', '#13c2c2'];

  return (
    <div className="statistics-page">
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="笔记总数"
              value={statistics?.totalNotes || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="分类数量"
              value={statistics?.totalCategories || 0}
              prefix={<FolderOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="标签数量"
              value={statistics?.totalTags || 0}
              prefix={<TagOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="笔记月新增数量" style={{ marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="分类占比" style={{ marginBottom: 16 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="标签使用频率">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={tagData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#722ed1" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPage;

