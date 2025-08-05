import React from 'react';
import Block from './Block';

const Script = ({ blocks, onDragStart, onDragOver, onDrop }) => {
  return (
    <div
      className="script-column"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, 'script', null)}
    >
      <h2>
        Script:
        <button className="clear-action">Clear</button>
        <button className="save-action">Save</button>
        <button className="load-action">Load</button>
      </h2>
      <div className="script">
        {blocks.map((block) => (
          <Block
            key={block.id}
            block={block}
            onDragStart={(e, dragTarget) => onDragStart(e, dragTarget ? dragTarget : block, 'script')}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default Script;
