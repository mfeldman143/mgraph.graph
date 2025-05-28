// examples/hasCycles.js
export default function hasCycle(graph) {
  const WHITE = 0;
  const GRAY = 1;
  const BLACK = 2;
  
  const colors = new Map();
  
  // Initialize all nodes as WHITE
  graph.forEachNode(node => {
    colors.set(node.id, WHITE);
  });
  
  function dfs(nodeId) {
    colors.set(nodeId, GRAY);
    
    let hasCycleFromHere = false;
    graph.forEachLinkedNode(nodeId, (neighbor, link) => {
      // Only follow outbound edges for cycle detection
      if (link.fromId === nodeId) {
        const neighborColor = colors.get(neighbor.id);
        
        if (neighborColor === GRAY) {
          // Back edge found - cycle detected
          hasCycleFromHere = true;
          return true; // Stop iteration
        } else if (neighborColor === WHITE && dfs(neighbor.id)) {
          hasCycleFromHere = true;
          return true; // Stop iteration
        }
      }
    }, true); // oriented = true
    
    colors.set(nodeId, BLACK);
    return hasCycleFromHere;
  }
  
  // Check each unvisited node
  let result = false;
  graph.forEachNode(node => {
    if (colors.get(node.id) === WHITE) {
      if (dfs(node.id)) {
        result = true;
        return true; // Stop iteration
      }
    }
  });
  
  return result;
}