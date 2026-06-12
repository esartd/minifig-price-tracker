import { ReactNode } from 'react';

interface GridContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Apple-style 12-column grid container
 * Usage:
 * <GridContainer>
 *   <div className="col-span-12 md:col-span-6">Half width on desktop</div>
 *   <div className="col-span-12 md:col-span-6">Half width on desktop</div>
 * </GridContainer>
 */
export function GridContainer({ children, className = '', size = 'md' }: GridContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-container-sm',
    md: 'max-w-container',
    lg: 'max-w-container-lg',
  }[size];

  return (
    <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {children}
      </div>
    </div>
  );
}

/**
 * Simple container without grid (for single column content)
 */
export function Container({ children, className = '', size = 'md' }: GridContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-container-sm',
    md: 'max-w-container',
    lg: 'max-w-container-lg',
  }[size];

  return (
    <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
