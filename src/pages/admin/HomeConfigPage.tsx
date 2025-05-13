import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import HomePageConfig from '../../components/admin/home/HomePageConfig';

const HomeConfigPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <HomePageConfig />
      </div>
    </AdminLayout>
  );
};

export default HomeConfigPage; 