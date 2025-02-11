export default function findConnectedComponents(graph) {
  const nodeIdToComponentId = new Map();
  const connectedComponents = [];
  let lastComponentId = 0;

  graph.forEachNode((node) => {
    if (nodeIdToComponentId.has(node.id)) {
      return;
    }

    // New connected component:
    nodeIdToComponentId.set(node.id, lastComponentId);
    const currentComponent = [node.id];
    connectedComponents.push(currentComponent);

    dfs(graph, node.id, (otherNode) => {
      const componentId = nodeIdToComponentId.get(otherNode.id);
      if (componentId !== undefined && componentId === lastComponentId) {
        // For loops, ignore.
        return false;
      } else if (componentId !== undefined) {
        throw new Error('Reached a component from another component. DFS is broken?');
      }
      currentComponent.push(otherNode.id);
      nodeIdToComponentId.set(otherNode.id, lastComponentId);
      return true;
    });

    lastComponentId += 1;
  });

  return connectedComponents;
}

function dfs(graph, startFromNodeId, visitor) {
  graph.forEachLinkedNode(startFromNodeId, (otherNode) => {
    if (visitor(otherNode)) {
      dfs(graph, otherNode.id, visitor);
    }
  });
}
