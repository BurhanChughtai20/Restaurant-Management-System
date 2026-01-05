import React from 'react';
import { Space, Typography } from 'antd';
import type { JSX } from 'react';

const { Text, Title } = Typography;

interface DynamicContentProps {
  heading?: string;
  paragraph?: string;
  className?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5;
}

const DynamicContent: React.FC<DynamicContentProps> = ({
  heading,
  paragraph,
  className = '',
  headingLevel = 3
}) => {
  const HeadingTag = `h${headingLevel}` as keyof JSX.IntrinsicElements;

  return (
    <Space className={className} vertical style={{ width: '100%' }}>
      {heading && (
        <Title level={headingLevel} className="dynamic-heading">
          {heading}
        </Title>
      )}
      {paragraph && (
        <Text type="secondary" className="dynamic-paragraph">
          {paragraph}
        </Text>
      )}
    </Space>
  );
};

export default DynamicContent;
