# Chapter 3: Script Management

Welcome back! In [Chapter 1: Block Definition & Component](01_block_definition___component_.md), we learned how to create our visual "LEGO bricks," and in [Chapter 2: Drag and Drop System](02_drag_and_drop_system_.md), we mastered the art of picking up and snapping those bricks together to build a program. You can now build amazing sequences of actions!

But imagine you've just spent an hour building an incredible LEGO castle. What happens if you need to clear the table for dinner? Or what if you want to show your castle to a friend later? You wouldn't want to lose all your hard work, right?

This is exactly the problem **Script Management** solves in `react-blockcode`. Your visual program, the sequence of blocks you've assembled, is your "script." This chapter will teach you how to:

*   **Clear** your entire program to start fresh.
*   **Save** your program (your "script") to a file so you can open it again later.
*   **Load** a saved program from a file, bringing your creation back to life.

Think of it as having controls to manage your digital LEGO creations: clearing the board, saving the building instructions, and loading them back.

---

### What is a Script?

At its core, your **Script** is just a list of blocks, arranged in the order you've dropped them. It's like a scroll or a sheet of paper where each block is a step in your instructions.

Visually, this "scroll" is displayed in the main `Script` area of our application. Behind the scenes, this list of blocks is stored in a special variable called `scriptBlocks` within our `useDragAndDrop` hook (which we briefly met in the last chapter).

```mermaid
graph TD
    A[Your Assembled Blocks] --> B{The Script (Data)};
    B --> C[Visual Display: Script Area];
    B --> D[File: Saved Program];
    C -- Controls --> B;
    D -- Load --> B;
```

This diagram shows that your visual blocks form the "script" data. This data is then shown in the `Script Area`, and you can also save it to a file or load it from a file.

---

### Managing Your Script: Clear, Save, and Load

The `Script` component (`src/components/Script.js`) is where you'll find the buttons to perform these essential management tasks.

Let's look at the controls in the `Script` component:

```javascript
// src/components/Script.js (Simplified Header)
import React from 'react';
import { Button, ButtonGroup, Typography } from '@mui/material';
import { Clear, Save, Upload } from '@mui/icons-material';

const Script = ({ blocks, onClear, onUpdateBlockValue }) => {
  // ... other code for rendering blocks

  const handleSave = () => { /* ... calls a utility to save ... */ };
  const handleLoad = () => { /* ... calls a utility to load ... */ };

  return (
    <div>
      {/* ... Script title */}
      <Typography variant="h6">Script</Typography>

      <ButtonGroup size="small" variant="outlined">
        <Button
          onClick={onClear} // When clicked, this calls the 'onClear' function
          disabled={!blocks || blocks.length === 0}
          startIcon={<Clear />}
        >
          Clear
        </Button>
        <Button
          onClick={handleSave} // Calls our save function
          disabled={!blocks || blocks.length === 0}
          startIcon={<Save />}
        >
          Save
        </Button>
        <Button
          onClick={handleLoad} // Calls our load function
          startIcon={<Upload />}
        >
          Load
        </Button>
      </ButtonGroup>
      {/* ... rest of the Script component */}
    </div>
  );
};

export default Script;
```

**Explanation:**

*   **`Clear` Button**: When you click this, it removes all blocks from your script. It's like wiping the slate clean!
    *   It uses a function called `onClear` which is passed from the main application.
*   **`Save` Button**: This takes your current script and lets you save it to a file on your computer. This file will be in a special text format called JSON (we'll explain this soon!).
    *   It calls a function `handleSave` within the `Script` component.
*   **`Load` Button**: This lets you pick a previously saved script file from your computer and load it back into the application, restoring your program.
    *   It calls a function `handleLoad` within the `Script` component.

Notice how the `Save` and `Clear` buttons are `disabled` if there are no `blocks` in the script. This prevents you from trying to save or clear an empty program.

---

### How it Works: Under the Hood

The `scriptBlocks` variable in the `useDragAndDrop` hook is the "truth" about your program. When you drag blocks, it updates this list. When you manage your script, you're interacting with this same list.

Let's explore how the `Clear`, `Save`, and `Load` operations change or use this `scriptBlocks` list.

#### 1. Clearing the Script (`clearScript`)

This is the simplest operation. When you click "Clear," we just reset the `scriptBlocks` list to be empty.

```javascript
// src/hooks/useDragAndDrop.js (Simplified)
import { useState } from 'react';

const useDragAndDrop = () => {
  const [scriptBlocks, setScriptBlocks] = useState([]); // Our program's blocks

  // ... other drag and drop functions

  const clearScript = () => {
    setScriptBlocks([]); // Simply set the list of blocks to an empty array
  };

  return {
    // ... other returned values
    scriptBlocks,
    setScriptBlocks, // Used by the load function
    clearScript,     // Used by the Script component's Clear button
  };
};

export default useDragAndDrop;
```

**Explanation:**

*   The `clearScript` function is part of our `useDragAndDrop` hook.
*   It calls `setScriptBlocks([])`, which is React's way of saying: "Hey, update our program's block list to be completely empty!"
*   When `scriptBlocks` becomes empty, the `Script` component (which displays these blocks) automatically re-renders, and you'll see the "Drag blocks here to build your script" message.

#### 2. Saving the Script (`scriptToJson`)

To save your program, we need to convert your `scriptBlocks` (which are JavaScript objects, potentially nested) into a simple text format that can be stored in a file. This format is called **JSON** (JavaScript Object Notation). It's a very common way to represent data as text.

Consider a simple script: a "forward 10 steps" block inside a "repeat 5 times" block.

```javascript
// Simplified representation of scriptBlocks for our example
const myScriptBlocks = [
  {
    id: 1,
    name: 'repeat',
    value: 5,
    contents: [ // This block contains other blocks
      {
        id: 2,
        name: 'forward',
        value: 10,
        contents: 'steps'
      }
    ]
  }
];
```

When we save this, it becomes a JSON string:

```json
[
  {
    "id": 1,
    "name": "repeat",
    "value": 5,
    "contents": [
      {
        "id": 2,
        "name": "forward",
        "value": 10,
        "contents": "steps"
      }
    ]
  }
]
```

The conversion happens in a helper file: `src/utils/file.js`.

```javascript
// src/utils/file.js (Simplified scriptToJson)

// Function to convert your blocks (JavaScript objects) into a JSON string
export function scriptToJson(blocks) {
  if (!blocks || blocks.length === 0) {
    return null; // Don't save if there are no blocks
  }
  return JSON.stringify(blocks); // This line converts the blocks array into a JSON string
}
```

**Explanation:**

*   `JSON.stringify(blocks)`: This built-in JavaScript function is the magic! It takes your array of `block` objects (even with their nested `contents`) and turns them into a single, long text string that follows the JSON rules.
*   Once this JSON string is ready, the `Script` component takes it and uses a little browser trick (`Blob`, `URL.createObjectURL`) to create a file download for the user. You then get to choose where to save it on your computer.

```mermaid
sequenceDiagram
    participant User
    participant ScriptComp as Script Component
    participant FileUtils as src/utils/file.js
    participant Browser

    User->>ScriptComp: Clicks "Save" button
    ScriptComp->>ScriptComp: Gets current scriptBlocks from useDragAndDrop hook
    ScriptComp->>FileUtils: Calls scriptToJson(scriptBlocks)
    FileUtils-->>ScriptComp: Returns JSON string
    ScriptComp->>Browser: Initiates file download with JSON string
    Browser->>User: Prompts to save file
```

#### 3. Loading the Script (`jsonToScript`)

To load a script, we do the reverse: we read the JSON text from a file and convert it back into the JavaScript `block` objects that our application understands.

```javascript
// src/utils/file.js (Simplified jsonToScript)

// Function to convert a JSON string back into your blocks (JavaScript objects)
export function jsonToScript(json, setBlocks) {
  try {
    const parsedBlocks = JSON.parse(json); // This line converts the JSON string back into JavaScript objects
    if (Array.isArray(parsedBlocks)) {
      setBlocks(parsedBlocks); // Update the main scriptBlocks state in the app
    } else {
      console.error("Error: JSON data is not an array");
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
}
```

**Explanation:**

*   `JSON.parse(json)`: This is the opposite of `JSON.stringify()`. It takes a JSON text string and turns it back into the correct JavaScript objects (including nested arrays for `contents`).
*   `setBlocks(parsedBlocks)`: After successfully parsing the JSON, this line is crucial! It takes the newly created `parsedBlocks` array and uses the `setBlocks` function (which is actually `setScriptBlocks` from our `useDragAndDrop` hook, passed down as a prop) to update the application's central script state.
*   Once `scriptBlocks` is updated, React re-renders the `Script` component, and your loaded program appears!

```mermaid
sequenceDiagram
    participant User
    participant ScriptComp as Script Component
    participant FileUtils as src/utils/file.js
    participant Browser
    participant DragDropHook as useDragAndDrop Hook

    User->>ScriptComp: Clicks "Load" button
    ScriptComp->>Browser: Opens file selection dialog
    User->>Browser: Selects and confirms a JSON file
    Browser-->>ScriptComp: Provides file content (JSON string)
    ScriptComp->>FileUtils: Calls jsonToScript(jsonString, DragDropHook.setScriptBlocks)
    FileUtils->>FileUtils: Parses JSON string
    FileUtils->>DragDropHook: Calls setScriptBlocks(parsedBlocks)
    DragDropHook-->>ScriptComp: scriptBlocks state is updated
    ScriptComp->>ScriptComp: Rerenders to show loaded blocks
```

### Conclusion

In this chapter, you've learned how **Script Management** is vital for making your visual programs permanent and shareable. You now know:

*   Your "script" is the sequence of blocks, represented by the `scriptBlocks` array in the `useDragAndDrop` hook.
*   The `Script` component provides intuitive buttons to `Clear`, `Save`, and `Load` your programs.
*   `Clear` simply empties the `scriptBlocks` array.
*   `Save` uses `scriptToJson` (from `src/utils/file.js`) to convert your block structure into a savable JSON text format.
*   `Load` uses `jsonToScript` (also from `src/utils/file.js`) to parse a JSON file back into your `scriptBlocks` array, restoring your program.

These features transform `react-blockcode` from a temporary canvas into a powerful tool for creating, storing, and sharing your visual code. With your program now built and manageable, the next exciting step is to make it actually *do* something! In [Chapter 4: Turtle Graphics Engine](04_turtle_graphics_engine_.md), we'll explore how our blocks translate into actions on the screen, drawing shapes and lines!