import React from 'react';
import BLOCKS from '../blocks';
import Block from './Block';

const Menu = ({ onDragStart }) => {
  return (
    <div className="menu-column">
      <h2>Menu</h2>
      <div className="menu">
        {BLOCKS.map((block) => (
          <Block
            key={block.name}
            block={block}
            onDragStart={(e) => onDragStart(e, block, 'menu')}
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;
