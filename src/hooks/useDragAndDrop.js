import { useState } from 'react';

const useDragAndDrop = () => {
  const [dragTarget, setDragTarget] = useState(null);
  const [dragType, setDragType] = useState(null);
  const [scriptBlocks, setScriptBlocks] = useState([]);

  const handleDragStart = (e, block, type) => {
    setDragTarget(block);
    setDragType(type);
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    if (type === 'menu') {
      e.dataTransfer.effectAllowed = 'copy';
    } else {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropZoneType, dropTarget) => {
    e.preventDefault();
    e.stopPropagation();

    let newScriptBlocks = [...scriptBlocks];

    if (dragType === 'menu') {
      const newBlock = {
        ...dragTarget,
        id: new Date().getTime(),
        contents: Array.isArray(dragTarget.contents) ? [] : dragTarget.contents,
      };

      if (dropZoneType === 'script') {
        newScriptBlocks.push(newBlock);
      } else if (dropZoneType === 'block') {
        const dropTargetBlock = findBlock(newScriptBlocks, dropTarget.id);
        if (dropTargetBlock && Array.isArray(dropTargetBlock.contents)) {
          dropTargetBlock.contents.push(newBlock);
        } else if (dropTargetBlock) {
          const containingArray = findContainingArray(newScriptBlocks, dropTarget.id);
          const index = containingArray.findIndex(b => b.id === dropTarget.id);
          containingArray.splice(index + 1, 0, newBlock);
        }
      }
    } else if (dragType === 'script') {
      const draggedBlock = findBlock(newScriptBlocks, dragTarget.id);
      if (draggedBlock) {
        // Remove the block from its original position
        const containingArray = findContainingArray(newScriptBlocks, dragTarget.id);
        const index = containingArray.findIndex(b => b.id === dragTarget.id);
        containingArray.splice(index, 1);

        if (dropZoneType === 'script') {
          newScriptBlocks.push(draggedBlock);
        } else if (dropZoneType === 'block') {
          const dropTargetBlock = findBlock(newScriptBlocks, dropTarget.id);
          if (dropTargetBlock && Array.isArray(dropTargetBlock.contents)) {
            dropTargetBlock.contents.push(draggedBlock);
          } else if (dropTargetBlock) {
            const containingArray = findContainingArray(newScriptBlocks, dropTarget.id);
            const index = containingArray.findIndex(b => b.id === dropTarget.id);
            containingArray.splice(index + 1, 0, draggedBlock);
          }
        }
      }
    }

    setScriptBlocks(newScriptBlocks);
    setDragTarget(null);
    setDragType(null);
  };

  const findBlock = (blocks, id) => {
    for (const block of blocks) {
      if (block.id === id) {
        return block;
      }
      if (Array.isArray(block.contents)) {
        const found = findBlock(block.contents, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const findContainingArray = (blocks, id) => {
    for (const block of blocks) {
      if (block.id === id) {
        return blocks;
      }
      if (Array.isArray(block.contents)) {
        const found = findContainingArray(block.contents, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  return {
    dragTarget,
    dragType,
    scriptBlocks,
    setScriptBlocks,
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
};

export default useDragAndDrop;
