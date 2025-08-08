import { useState } from 'react';

const useDragAndDrop = () => {
  const [dragTarget, setDragTarget] = useState(null);
  const [dragType, setDragType] = useState(null);
  const [scriptBlocks, setScriptBlocks] = useState([]);

  const handleDragStart = (e, block, type) => {
    e.stopPropagation()
    setDragTarget(block);
    setDragType(type);
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    if (type === 'menu') {
      e.dataTransfer.effectAllowed = 'copy';
    } else {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragEnter = (e) => {
    // Always add 'over' to the closest menu/script/content container
    const container = e.target.closest('.menu, .script, .content');
    if (container) {
      container.classList.add('over');
      if (e.preventDefault) { e.preventDefault(); }
    }
  };

  const handleDragLeave = (e) => {
    // Only remove 'over' if leaving the container entirely
    const container = e.target.closest('.menu, .script, .content');
    const related = e.relatedTarget;
    if (container && (!related || !container.contains(related))) {
      container.classList.remove('over');
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
      if (draggedBlock && (!dropTarget || draggedBlock.id !== dropTarget.id)) {
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
        } else if (dropZoneType === 'menu') {
          // Block is deleted
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

  const clearScript = () => setScriptBlocks([]);

  const updateBlockValue = (blockId, newValue) => {
    const updateBlockInArray = (blocks) => {
      return blocks.map(block => {
        if (block.id === blockId) {
          return { ...block, value: newValue };
        }
        if (Array.isArray(block.contents)) {
          return { ...block, contents: updateBlockInArray(block.contents) };
        }
        return block;
      });
    };
    
    setScriptBlocks(prevBlocks => updateBlockInArray(prevBlocks));
  };

  return {
    dragTarget,
    dragType,
    scriptBlocks,
    setScriptBlocks,
    handleDragStart,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    clearScript,
    updateBlockValue,
  };
};

export default useDragAndDrop;
