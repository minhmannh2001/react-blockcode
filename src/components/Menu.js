import React from 'react';
import BLOCKS from '../blocks';
import Block from './Block';

const Menu = ({ onDragStart, onDragOver, onDrop }) => {
  return (
    <div
      className="menu-column"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, 'menu', null)}
    >
      <h2>Menu</h2>
      <div className="menu">
        {BLOCKS.map((block) => (
          <Block
            key={block.name}
            block={block}
            onDragStart={(e) => onDragStart(e, block, 'menu')}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;
