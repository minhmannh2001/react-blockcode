import React from 'react';
import BLOCKS from '../blocks';
import Block from './Block';

const Menu = ({ onDragStart, onDragEnter, onDragLeave, onDragOver, onDrop, onDragEnd }) => {
  return (
    <div
      className="menu-column"
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, 'menu', null)}
      onDragEnd={onDragEnd}
    >
      <h2>Menu</h2>
      <div className="menu">
        {BLOCKS.map((block) => (
          <Block
            key={block.name}
            block={block}
            onDragStart={(e) => onDragStart(e, block, 'menu')}
            onDragEnter={onDragEnter}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;
