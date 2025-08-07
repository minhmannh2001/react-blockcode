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
    if (Array.isArray(parsedBlocks)) {
      setBlocks(parsedBlocks); // Assuming setBlocks is a function to update the blocks state
    } else {
      console.error("Error: JSON data is not an array");
      alert("Failed to load file: JSON data is not an array");
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    alert(`Failed to load file: ${error.message}`);
  }
}
