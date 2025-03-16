import React from 'react';

const TitleBar = ({ 
  title, 
  subtitle,
  titleClassName = "text-3xl font-bold text-zinc-200", 
  subtitleClassName = "text-zinc-400"
}) => {
  return (
    <div className='mt-16'>
      <h1 className={titleClassName}>{title}</h1>
      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
    </div>
  );
};

export default TitleBar;