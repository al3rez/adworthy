
import { FC, useEffect, useRef, ReactNode } from 'react';
import Masonry from 'react-masonry-css';

interface MasonryGridProps {
  children: ReactNode;
  className?: string;
  breakpointColumns?: { [key: number]: number };
}

const defaultBreakpointColumns = {
  default: 4,
  1280: 3,
  1024: 3,
  768: 2,
  500: 1
};

const MasonryGrid: FC<MasonryGridProps> = ({ 
  children, 
  className = '',
  breakpointColumns = defaultBreakpointColumns
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={gridRef} className={className}>
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
