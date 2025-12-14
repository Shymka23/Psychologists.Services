import React from 'react';

export type IconName = 'arrow-right' | 'filter-chevron';

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  name: IconName;
}

const ICON_PATHS: Record<IconName, React.ReactElement> = {
  'arrow-right': (
    <path
      d="M1 17L17 1M17 1H5.8M17 1V12.2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  'filter-chevron': (
    <path
      d="M1 6L6 1L11 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
};

/**
 * Lightweight SVG icon component.
 * Icons are inlined as paths to avoid external sprite loading issues.
 */
export const Icon: React.FC<IconProps> = ({ name, className, ...rest }) => {
  const path = ICON_PATHS[name];

  return (
    <svg
      className={className}
      aria-hidden={rest['aria-label'] ? undefined : true}
      viewBox={name === 'filter-chevron' ? '0 0 12 7' : '0 0 18 18'}
      fill="none"
      {...rest}
    >
      {path}
    </svg>
  );
};



