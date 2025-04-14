import React from 'react';
import { Modal, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { ImageMaterial } from '../types/publish';

// 图片预览弹窗组件
const ImagePreviewModal: React.FC<{
  open: boolean;
  onClose: () => void;
  image: ImageMaterial | null;
}> = ({ open, onClose, image }) => {
  if (!image) return null;

  return (
    <Modal
      title="图片详情"
      open={open}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <div style={{ display: 'flex', gap: '24px' }}>
        <div style={{ flex: 1 }}>
          <img
            src={image.url}
            alt=""
            style={{
              width: '100%',
              maxHeight: '400px',
              objectFit: 'contain'
            }}
          />
          <div style={{ marginTop: '16px' }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', marginRight: '8px' }}>创建时间：</span>
              {dayjs(image.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </div>
            <div>
              <span style={{ fontWeight: 'bold', marginRight: '8px' }}>标签：</span>
              <Space size={[0, 8]} wrap>
                {image.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>
            </div>
          </div>
        </div>
        {image.usagePlan && (
          <div style={{ width: '300px', padding: '16px', backgroundColor: '#f7f7f7', borderRadius: '8px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '16px' }}>使用计划</div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: '#666', fontSize: '12px' }}>计划使用时间</div>
              <div style={{ fontSize: '14px' }}>{dayjs(image.usagePlan.date).format('YYYY-MM-DD')}</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: '#666', fontSize: '12px' }}>内容标题</div>
              <div style={{ fontSize: '14px' }}>{image.usagePlan.title}</div>
            </div>
            <div>
              <div style={{ color: '#666', fontSize: '12px' }}>内容类型</div>
              <div style={{ fontSize: '14px' }}>{image.usagePlan.contentType}</div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImagePreviewModal; 