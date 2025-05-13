import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import CTAConfig from '../../components/admin/CTAConfig';

const CTAConfigPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <CTAConfig />
      </div>
    </AdminLayout>
  );
};

export default CTAConfigPage; 