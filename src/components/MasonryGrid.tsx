
import { FC, ReactNode } from 'react';
import Masonry from 'react-masonry-css';

interface MasonryGridProps {
  children: ReactNode;
  className?: string;
  breakpointColumns?: { [key: number]: number };
}

const defaultBreakpointColumns = {
  default: 5,
  1536: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 2,
  500: 1
};

const MasonryGrid: FC<MasonryGridProps> = ({ 
  children, 
  className = '',
  breakpointColumns = defaultBreakpointColumns
}) => {
  return (
    <div className={className}>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        {children}
      </Masonry>
    </div>
  );
};

export default MasonryGrid;
