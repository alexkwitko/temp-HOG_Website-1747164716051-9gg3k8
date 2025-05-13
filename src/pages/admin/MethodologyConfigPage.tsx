import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import MethodologyConfig from '../../components/admin/methodology/MethodologyConfig';

const MethodologyConfigPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <MethodologyConfig />
      </div>
    </AdminLayout>
  );
};

export default MethodologyConfigPage; 