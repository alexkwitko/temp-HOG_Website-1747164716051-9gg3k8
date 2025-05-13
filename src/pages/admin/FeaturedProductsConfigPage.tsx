import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import FeaturedProductsConfig from '../../components/admin/FeaturedProductsConfig';

const FeaturedProductsConfigPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow">
        <FeaturedProductsConfig />
      </div>
    </AdminLayout>
  );
};

export default FeaturedProductsConfigPage; 