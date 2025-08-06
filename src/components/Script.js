import React from 'react';
import Block from './Block';

const Script = ({ blocks, onDragStart, onDragEnter, onDragLeave, onDragOver, onDrop, onDragEnd, onClear }) => {
  return (
    <div
      className="script-column"
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, 'script', null)}
      onDragEnd={onDragEnd}
    >
      <h2>
        Script:
        <button className="clear-action" onClick={onClear}>Clear</button>
        <button className="save-action">Save</button>
        <button className="load-action">Load</button>
      </h2>
      <div className="script">
        {blocks.map((block) => (
          <Block
            key={block.id}
            block={block}
            onDragStart={(e, dragTarget) => onDragStart(e, dragTarget ? dragTarget : block, 'script')}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default Script;
