import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, List, Button, message, Modal, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNoteVersions } from '../store/slices/noteSlice';
import dayjs from 'dayjs';
import './VersionHistoryPage.css';

const VersionHistoryPage = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { versions } = useSelector((state) => state.note);

  useEffect(() => {
    if (noteId) {
      dispatch(fetchNoteVersions({ noteId }));
    }
  }, [noteId]);

  const handleRollback = (versionId) => {
    Modal.confirm({
      title: '确认回滚',
      content: '确定要回滚到此版本吗？当前版本将被覆盖。',
      onOk: () => {
        // TODO: 调用回滚API
        message.info('回滚功能开发中');
      },
    });
  };

  return (
    <div className="version-history-page">
      <Card
        title={
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
            返回
          </Button>
        }
      >
        {versions.length === 0 ? (
          <Empty description="暂无版本记录" />
        ) : (
          <List
            dataSource={versions}
            renderItem={(version) => (
              <List.Item>
                <Card style={{ width: '100%' }}>
                  <div className="version-header">
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
                    </div>
                    <Button
                      type="primary"
                      onClick={() => handleRollback(version.versionId)}
                    >
                      回滚至此版本
                    </Button>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default VersionHistoryPage;

