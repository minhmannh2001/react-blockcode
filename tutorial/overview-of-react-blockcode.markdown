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
](01_block_definition___component_.md)
2. [Drag and Drop System
](02_drag_and_drop_system_.md)
3. [Script Management
](03_script_management_.md)
4. [Turtle Graphics Engine
](04_turtle_graphics_engine_.md)
5. [Application Layout & State Flow
](05_application_layout___state_flow_.md)
