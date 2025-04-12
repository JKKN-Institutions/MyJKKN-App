'use client';

import React from 'react';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  width = 180,
  height = 60,
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 240 80'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      {/* Primary color rounded rectangle for "My" */}
      <rect
        x='40'
        y='15'
        width='70'
        height='50'
        rx='12'
        fill='var(--primary)'
      />

      {/* "My" text in white script font inside primary rectangle */}
      <text
        x='50'
        y='50'
        fontFamily='Arial, sans-serif'
        fontSize='32'
        fontWeight='bold'
        fill='white'
        fontStyle='italic'
      >
        My
      </text>

      {/* Last part of text */}
      <text
        x='120'
        y='50'
        fontFamily='Arial, sans-serif'
        fontSize='30'
        fontWeight='bold'
        fill='black'
      >
        JKKN
      </text>
    </svg>
  );
};

export default Logo;
