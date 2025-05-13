import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

/**
 * Button component that uses the global button styles from SiteSettingsContext
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  ...props
}) => {
  // Base classes from our global CSS
  const baseClasses = 'btn';
  const variantClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size];
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Additional classes for when an icon is present
  const iconClasses = icon ? 'inline-flex items-center justify-center' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${iconClasses} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

/**
 * Link styled as a button, using the global button styles
 */
export const ButtonLink: React.FC<ButtonProps & { href: string }> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  href,
  ...props
}) => {
  // Base classes from our global CSS
  const baseClasses = 'btn';
  const variantClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size];
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Additional classes for when an icon is present
  const iconClasses = icon ? 'inline-flex items-center justify-center' : '';
  
  return (
    <a
      href={href}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${iconClasses} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </a>
  );
};
