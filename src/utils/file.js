// Function to serialize the script to JSON
export function scriptToJson(blocks) {
  if (!blocks || blocks.length === 0) {
    return null;
  }
  return JSON.stringify(blocks);
}

// Function to deserialize JSON to script
export function jsonToScript(json, setBlocks) {
  try {
    const parsedBlocks = JSON.parse(json);
    setBlocks(parsedBlocks); // Assuming setBlocks is a function to update the blocks state
  } catch (error) {
    console.error("Error parsing JSON:", error);
    alert("Invalid JSON file");
  }
}
