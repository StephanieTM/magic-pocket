import React from 'react';
import { Link } from 'react-router-dom';

export default function Comp(): JSX.Element {
  return (
    <div>
      <div>Demos</div>

      <div>
        <Link to="/demos/custom-tree">Custom Tree</Link>
      </div>
    </div>
  );
}
