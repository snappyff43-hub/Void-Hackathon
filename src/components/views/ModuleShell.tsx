import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Card, CardContent } from '../ui/Card';

interface ModuleShellProps {
  title: string;
  subtitle: string;
  description: string;
}

export const ModuleShell: React.FC<ModuleShellProps> = ({
  title,
  subtitle,
  description,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <PageHeader
        title={title}
        subtitle={subtitle}
      />

      <Card>
        <CardContent style={{ padding: '36px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.5 }}>
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
