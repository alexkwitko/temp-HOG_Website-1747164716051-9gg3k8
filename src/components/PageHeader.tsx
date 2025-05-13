import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  image?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, image }) => {
  return (
    <div className="relative pt-20 pb-10 md:pt-32 md:pb-16 bg-background">
      {image && (
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30" 
          style={{ backgroundImage: `url('${image}')` }} />
      )}
      <div className="absolute inset-0 bg-background opacity-70" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-text">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader; 