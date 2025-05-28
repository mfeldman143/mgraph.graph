// examples/findConnectedComponents.js
export default function findConnectedComponents(graph) {
  const visited = new Set();
  const components = [];

  graph.forEachNode(node => {
    if (!visited.has(node.id)) {
      const component = [];
      const stack = [node.id];
      
      while (stack.length > 0) {
        const nodeId = stack.pop();
        if (!visited.has(nodeId)) {
          visited.add(nodeId);
          component.push(nodeId);
          
          graph.forEachLinkedNode(nodeId, neighbor => {
            if (!visited.has(neighbor.id)) {
              stack.push(neighbor.id);
            }
          });
        }
      }
      
      component.sort(); // For consistent ordering in tests
      components.push(component);
    }
  });

  return components;
}