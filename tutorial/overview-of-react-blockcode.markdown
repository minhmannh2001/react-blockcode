# Tutorial: react-blockcode

This project is a **visual programming application** that lets you create drawings using a virtual *turtle*. You build programs by *dragging and dropping* colorful instruction blocks, like "move forward" or "turn left", into a sequence. Once assembled, the application runs your script, and the turtle draws your design on a *canvas*.


## Visual Overview

```mermaid
flowchart TD
    A0["Block Definition & Component
"]
    A1["Drag and Drop System
"]
    A2["Script Management
"]
    A3["Turtle Graphics Engine
"]
    A4["Application Layout & State Flow
"]
    A4 -- "Utilizes State Management" --> A1
    A2 -- "Requests Updates From" --> A1
    A0 -- "Triggers Events For" --> A1
    A2 -- "Renders Components" --> A0
    A4 -- "Passes Script Data" --> A3
    A3 -- "Interprets Instructions" --> A0
```

## Chapters

1. [Block Definition & Component
](./chapter-1-block-definition&component.markdown)
2. [Drag and Drop System
](./chapter-2-drag-and-drop-system.markdown)
3. [Script Management
](./chapter-3-script-management.markdown)
4. [Turtle Graphics Engine
](./chapter-4-turtle-graphics-engine.markdown)
5. [Application Layout & State Flow
](./chapter-5-application-layout&state-flow.markdown)
