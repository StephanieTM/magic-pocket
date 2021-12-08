import React from 'react';
import { Link } from 'react-router-dom';
import { useClassName } from 'app/utils';

export default function Header(): JSX.Element {
  const c = useClassName();

  return (
    <div className={c('app-header-container')}>
      <div className={c('menu-container')}>
        <Link to="/" className={c('menu-link')}>Home</Link>
        <Link to="/projects" className={c('menu-link')}>Projects</Link>
      </div>
    </div>
  );
}
