import React from 'react';

const Block = ({ block, onDragStart, onDragOver, onDrop }) => {
  const handleDrop = (e) => {
    e.stopPropagation();
    onDrop(e, 'block', block);
  };

  return (
    <div
      className="block"
      draggable="true"
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      {block.name}
      {block.value !== undefined && <input type="number" defaultValue={block.value} />}
      {typeof block.contents === 'string' && ` ${block.contents}`}
      {Array.isArray(block.contents) && (
        <div className="container">
          {block.contents.map((childBlock) => (
            <Block
              key={childBlock.id}
              block={childBlock}
              onDragStart={(e) => {
                onDragStart(e, childBlock);
              }}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Block;
