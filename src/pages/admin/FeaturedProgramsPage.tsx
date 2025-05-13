import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import FeaturedProgramsConfig from '../../components/admin/FeaturedProgramsConfig';

const FeaturedProgramsPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <FeaturedProgramsConfig />
      </div>
    </AdminLayout>
  );
};

export default FeaturedProgramsPage; 