
import { FC } from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
}

const Loader: FC<LoaderProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`${sizeClasses[size]} rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin`}></div>
    </div>
  );
};

export default Loader;
