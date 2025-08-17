# Chapter 2: Drag and Drop System

Welcome back to the `react-blockcode` tutorial! In the [previous chapter](./chapter-1-block-definition&component.markdown), we learned how our "blocks" are defined as recipes and then visually drawn on the screen as interactive components. You now know what a `forward` block looks like and how it's built. But how do we actually *use* these beautiful blocks to create a program?

Imagine you have a box of LEGO bricks. Knowing what each brick is (its definition) and seeing them laid out (the component) is great, but to build something, you need to be able to pick them up, move them around, and snap them together. This is exactly what the **Drag and Drop System** allows us to do in `react-blockcode`.

It's the "invisible hand" that lets you:
*   Pick up a `forward` block from the "Menu".
*   Drag it over to the "Script" area.
*   Drop it into place, adding it to your program.
*   Rearrange blocks already in your "Script".
*   Even "delete" a block by dragging it back to the "Menu" area.

Our goal in this chapter is to understand how this crucial interaction works, enabling us to assemble visual programs.

---

### Key Concepts of Drag and Drop

At its heart, drag and drop involves a few simple ideas:

1.  **Dragging**: This is when you click and hold a block, then move your mouse. The system needs to know *which* block you picked up and *where* it came from (the "Menu" or the "Script").
2.  **Dropping**: This is when you let go of the mouse button. The system needs to know *where* you released the block. Was it on the "Script" area, inside a "repeat" block, or back on the "Menu"?
3.  **Drag Source**: The place where the dragging *starts*. In our app, this can be the `Menu` (where original blocks live) or the `Script` (where your program blocks live).
4.  **Drop Target**: The area where the dragging *ends*. This could be the `Script` area itself, *another* `Block` (especially a container like `repeat`), or even back on the `Menu` (to delete a block).
5.  **The Brain ( `useDragAndDrop` Hook)**: This is the central control center that manages all the logic. It tracks the block being dragged, figures out where it was dropped, and then updates our program's sequence of blocks accordingly.

---

### How to Use the Drag and Drop System

In `react-blockcode`, almost all the drag-and-drop magic is encapsulated within a special React feature called a "hook," specifically `useDragAndDrop`.

This hook is located in `src/hooks/useDragAndDrop.js`. It provides functions that tell your components what to do when a block is dragged or dropped.

Let's look at how the main `App.js` file uses this hook and passes its functions to the `Menu` and `Script` components.

#### `src/App.js` and the `useDragAndDrop` Hook

The `App.js` file is where everything comes together. It imports `useDragAndDrop` and gets back all the tools needed to manage dragging and dropping.

```javascript
// src/App.js (Simplified)
import useDragAndDrop from './hooks/useDragAndDrop'; // Our special hook

function App() {
  const {
    scriptBlocks, // The list of blocks currently in our program
    setScriptBlocks, // Function to update the program blocks
    handleDragStart, // Function for when a drag begins
    handleDragEnter, // Function for when a block enters a drag-sensitive area
    handleDragLeave, // Function for when a block leaves a drag-sensitive area
    handleDragOver,  // Function for when a block is dragged over an area
    handleDrop,      // Function for when a block is dropped
    // ... other functions
  } = useDragAndDrop();

  return (
    // ... layout setup
    <Menu
      onDragStart={handleDragStart} // Pass the drag start function to Menu
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}         // Pass the drop function to Menu
    />
    <Script
      blocks={scriptBlocks}       // Pass the current program blocks
      setBlocks={setScriptBlocks} // Allow Script to update blocks
      onDragStart={handleDragStart} // Pass drag functions to Script too
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}         // Pass drop function to Script
      // ... other props
    />
    // ... other components
  );
}
```

**Explanation:**

*   **`useDragAndDrop()`**: This line is where we "activate" our drag and drop system. It returns several important pieces of information and functions.
*   **`scriptBlocks` and `setScriptBlocks`**: These are super important! `scriptBlocks` is the actual list (an array) of all the blocks that currently make up your visual program. `setScriptBlocks` is the function we use to change this list when blocks are added, moved, or deleted.
*   **`handleDragStart`, `handleDrop`, etc.**: These are the specific functions that `useDragAndDrop` provides to handle the different stages of a drag-and-drop operation. `App.js` takes these functions and passes them down as "props" to the `Menu` and `Script` components.

#### `src/components/Menu.js` and `src/components/Script.js`

These components are the "zones" where blocks can be picked up from or dropped into. They use the `onDragStart` and `onDrop` functions they received from `App.js`.

```javascript
// src/components/Menu.js (Simplified)
import Block from './Block'; // Imports the visual Block component
import BLOCKS from '../blocks'; // Imports all block definitions

const Menu = ({ onDragStart, onDragEnter, onDragLeave, onDragOver, onDrop }) => {
  // ... state for visual feedback (isDragOver)

  const handleDropOnMenu = (e) => {
    // When something is dropped ON THE MENU area (e.g., from script)
    // We notify the main drop handler in the hook, specifying it's the 'menu' zone.
    onDrop(e, 'menu', null);
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragEnter={handleDragEnter} // Menu specific handler
      onDragLeave={handleDragLeave} // Menu specific handler
      onDrop={handleDropOnMenu}     // Menu specific drop handler
    >
      {/* ... Menu title and styling */}
      {BLOCKS.map((blockDefinition) => (
        <Block
          key={blockDefinition.name}
          block={blockDefinition}
          variant="menu"
          // When THIS specific block is dragged, call the hook's handleDragStart
          onDragStart={(e) => onDragStart(e, blockDefinition, 'menu')}
          // Blocks in the menu don't directly handle drops *on themselves* for new blocks
          // They only participate in starting a drag.
        />
      ))}
    </div>
  );
};
```

```javascript
// src/components/Script.js (Simplified)
import Block from './Block'; // Imports the visual Block component

const Script = ({ blocks, onDragStart, onDragEnter, onDragLeave, onDragOver, onDrop, onUpdateBlockValue }) => {
  // ... state for visual feedback (isDragOver)

  const handleDropOnScriptArea = (e) => {
    // When something is dropped ON THE MAIN SCRIPT AREA (not on a specific block)
    // Notify the hook's handleDrop, specifying it's the 'script' zone.
    onDrop(e, 'script', null);
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragEnter={onDragEnter} // Script specific handler
      onDragLeave={onDragLeave} // Script specific handler
      onDrop={handleDropOnScriptArea} // Script specific drop handler
    >
      {/* ... Script title and buttons */}
      {blocks && blocks.length > 0 ? (
        blocks.map((block) => (
          <Block
            key={block.id} // Each script block has a unique ID
            block={block}
            variant="script"
            // When THIS specific block is dragged (from script), call hook's handleDragStart
            onDragStart={(e) => onDragStart(e, block, 'script')}
            onDragEnter={onDragEnter} // Passes general drag handlers
            onDragOver={onDragOver}   // Passes general drag handlers
            // If a block is dropped *ONTO* this specific block (e.g., for nesting or insertion)
            onDrop={(e, type, target) => onDrop(e, type, target || block)}
            onUpdateBlockValue={onUpdateBlockValue} // For updating number inputs
          />
        ))
      ) : (
        <p>Drag blocks here to build your script</p>
      )}
    </div>
  );
};
```

**Explanation:**

*   Both `Menu` and `Script` are set up to be *drop targets*. This means they have `onDragOver`, `onDragEnter`, `onDragLeave`, and `onDrop` event listeners. When a block is dragged over them or dropped, these functions are called, and they pass the event to the main `useDragAndDrop` hook's functions.
*   Each `Block` component inside the `Menu` or `Script` is set up to be a *drag source*. When you `onDragStart` a `Block`, it calls the `handleDragStart` function from the `useDragAndDrop` hook, telling it *which specific block* is being dragged and *where it came from* (`'menu'` or `'script'`).
*   Crucially, `Block` components in the `Script` can also be *drop targets* themselves. This is how you can drop blocks *inside* a `repeat` block or *between* existing blocks.

---

### What Happens Under the Hood? (The `useDragAndDrop` Hook)

The `useDragAndDrop` hook is the "brain" of our drag and drop system. Let's trace a simple scenario: **dragging a `forward` block from the `Menu` and dropping it into the `Script` area.**

```mermaid
sequenceDiagram
    participant User
    participant BlockComp as Block Component (Menu)
    participant MenuComp as Menu Component
    participant ScriptComp as Script Component
    participant DragDropHook as useDragAndDrop Hook

    User->>BlockComp: Starts dragging "forward" block
    BlockComp->>DragDropHook: Calls handleDragStart(event, forwardBlock, 'menu')
    DragDropHook->>DragDropHook: Stores 'forwardBlock' as dragTarget, 'menu' as dragType
    Note over User: User drags "forward" block over Script area
    ScriptComp->>DragDropHook: Calls handleDragEnter(event) & handleDragOver(event)
    ScriptComp->>ScriptComp: Changes visual style (e.g., highlights border)
    User->>ScriptComp: Drops "forward" block
    ScriptComp->>DragDropHook: Calls handleDrop(event, 'script', null)
    DragDropHook->>DragDropHook: Sees dragType is 'menu', dropZoneType is 'script'
    DragDropHook->>DragDropHook: Creates a NEW 'forward' block with a unique ID
    DragDropHook->>DragDropHook: Adds new block to scriptBlocks
    DragDropHook-->>ScriptComp: scriptBlocks state is updated
    ScriptComp->>ScriptComp: Rerenders to show new "forward" block
```

#### Inside `src/hooks/useDragAndDrop.js`

Let's peek at the most important functions within `useDragAndDrop`.

**1. Remembering the Dragged Block (`handleDragStart`)**

When you begin dragging a block, `handleDragStart` is called. Its job is to remember which block is being dragged and where it came from.

```javascript
// src/hooks/useDragAndDrop.js (Simplified handleDragStart)
import { useState } from 'react';

const useDragAndDrop = () => {
  const [dragTarget, setDragTarget] = useState(null); // Stores the block being dragged
  const [dragType, setDragType] = useState(null);     // 'menu' or 'script'
  const [scriptBlocks, setScriptBlocks] = useState([]); // Our program's blocks

  const handleDragStart = (e, block, type) => {
    e.stopPropagation(); // Stop other elements from reacting
    setDragTarget(block); // We remember the actual block object
    setDragType(type);   // We remember if it's from the menu or script
    // e.dataTransfer is for browser's native drag-and-drop info
    e.dataTransfer.effectAllowed = type === 'menu' ? 'copy' : 'move';
  };

  // ... rest of the hook
};
```

**Explanation:**

*   `setDragTarget(block)`: This line saves the entire block object that you just picked up into our `dragTarget` state variable. Now the hook knows exactly what you're dragging.
*   `setDragType(type)`: This tells the hook if the block originated from the `'menu'` (meaning we'll make a *copy* when dropped) or from the `'script'` (meaning we'll *move* the original block when dropped).

**2. Handling the Drop (`handleDrop`)**

This is the core logic. Once you release the mouse button, `handleDrop` is called. It uses the `dragTarget` (the block being dragged) and the `dropZoneType` (where it was dropped) to update the `scriptBlocks` state.

```javascript
// src/hooks/useDragAndDrop.js (Simplified handleDrop)

  const handleDrop = (e, dropZoneType, dropTarget) => {
    e.preventDefault();
    e.stopPropagation();

    let newScriptBlocks = [...scriptBlocks]; // Create a working copy of our blocks

    if (dragType === 'menu') {
      // Scenario 1: Dragging a block FROM THE MENU
      const newBlock = {
        ...dragTarget, // Copy all properties from the original menu block
        id: new Date().getTime(), // IMPORTANT: Give it a unique ID for the script
        contents: Array.isArray(dragTarget.contents) ? [] : dragTarget.contents, // Reset contents if it's a container
      };

      if (dropZoneType === 'script') {
        newScriptBlocks.push(newBlock); // Add the new block to the end of the script
      } else if (dropZoneType === 'block') {
        // Find the block we dropped onto (the dropTarget)
        const targetBlock = findBlock(newScriptBlocks, dropTarget.id);
        if (targetBlock && Array.isArray(targetBlock.contents)) {
          // If it's a container block (like 'repeat'), add the new block inside it
          targetBlock.contents.push(newBlock);
        } else if (targetBlock) {
          // If it's a regular block, insert the new block right after it
          const containingArray = findContainingArray(newScriptBlocks, dropTarget.id);
          const index = containingArray.findIndex(b => b.id === dropTarget.id);
          containingArray.splice(index + 1, 0, newBlock); // Insert after target
        }
      }
    } else if (dragType === 'script') {
      // Scenario 2: Dragging a block FROM THE SCRIPT (moving or deleting)
      const draggedBlock = findBlock(newScriptBlocks, dragTarget.id); // Get the actual block being moved

      // First, remove the block from its original position
      const containingArray = findContainingArray(newScriptBlocks, dragTarget.id);
      const index = containingArray.findIndex(b => b.id === dragTarget.id);
      containingArray.splice(index, 1); // Remove it from where it was

      if (dropZoneType === 'script') {
        newScriptBlocks.push(draggedBlock); // Add it to the end of the main script
      } else if (dropZoneType === 'block') {
        // Move it into or next to another block
        const targetBlock = findBlock(newScriptBlocks, dropTarget.id);
        if (targetBlock && Array.isArray(targetBlock.contents)) {
          targetBlock.contents.push(draggedBlock); // Move into a container
        } else if (targetBlock) {
          const targetContainingArray = findContainingArray(newScriptBlocks, dropTarget.id);
          const targetIndex = targetContainingArray.findIndex(b => b.id === dropTarget.id);
          targetContainingArray.splice(targetIndex + 1, 0, draggedBlock); // Insert after target
        }
      } else if (dropZoneType === 'menu') {
        // Dropped back onto the Menu area: This means delete the block!
        // (It's already removed by the splice above, so no further action needed here)
      }
    }

    setScriptBlocks(newScriptBlocks); // Update our program's blocks, triggering a re-render!
    setDragTarget(null); // Clear the dragged block info
    setDragType(null);   // Clear the drag type info
  };

  // Helper functions to find blocks in nested arrays:
  // findBlock(blocks, id) finds a block by its unique ID, even inside 'contents' arrays.
  // findContainingArray(blocks, id) finds the specific array (main script or contents array)
  // that contains a block with a given ID.
  const findBlock = (blocks, id) => { /* ... recursive search logic ... */ return null; };
  const findContainingArray = (blocks, id) => { /* ... recursive search logic ... */ return null; };
```

**Explanation:**

*   **`dragType === 'menu'`**: If you're dragging from the `Menu`, `handleDrop` *creates a brand new copy* of that block. This new copy gets a unique `id` so we can track it independently within our script.
*   **`dragType === 'script'`**: If you're dragging a block already in the `Script`, `handleDrop` first *removes* that block from its original position. Then, it *adds* the *same* block to its new dropped position. This correctly performs a "move" operation.
*   **`dropZoneType`**: This parameter tells `handleDrop` where you actually dropped the block.
    *   `'script'`: Means you dropped it directly onto the main script area, so it's added to the top level.
    *   `'block'`: Means you dropped it onto another specific block. The code then checks if that `dropTarget` block is a container (like `repeat`). If it is, your block is added to its `contents` array. If not, your block is inserted right after the `dropTarget` in the same list.
    *   `'menu'`: This is a special case. If you drag a script block back to the menu, it's effectively "deleted" from your program.
*   **`setScriptBlocks(newScriptBlocks)`**: After all the logic of adding, moving, or deleting blocks is done, this crucial line updates the `scriptBlocks` state. When this state changes, React automatically re-renders the `Script` component, showing your blocks in their new positions.

The `handleDragEnter`, `handleDragLeave`, and `handleDragOver` functions, though important for making the drag-and-drop feel smooth (like highlighting the areas you can drop on), mostly manage visual feedback and prevent default browser behaviors. The real heavy lifting for changing your program structure happens in `handleDragStart` and `handleDrop`.

---

### Conclusion

The Drag and Drop System is the engine that brings `react-blockcode` to life as an interactive programming environment. By using the `useDragAndDrop` hook, we can manage the complex logic of:

*   Identifying which block is being dragged (`dragTarget`, `dragType`).
*   Determining where it's dropped (`dropZoneType`, `dropTarget`).
*   Correctly updating the central list of `scriptBlocks` to reflect additions, rearrangements, and deletions.

This system allows you to intuitively build and modify your visual programs simply by moving blocks with your mouse. Now that we understand how blocks are defined, displayed, and moved, the next logical step is to dive deeper into how our program (`scriptBlocks`) is structured and how we manage it more broadly. That's what we'll explore in [Chapter 3: Script Management](./chapter-3-script-management.markdown).