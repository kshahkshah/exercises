#!/usr/bin/env node --harmony

// recreating my ruby implementation in js

// first, i'm going to defined some classes to aid in representing a graph

// nodes, which may have a position and can be labelled
function Node(label, x, y) {
  this.label = label;
  this.edges = [];
  this.parent = null;
  this.heuristic = 0;
  this.cost = 0;
  this.x = x;
  this.y = y;
  this.visited = false;

  this.startNode = function() {
    return (this.label == 'start')
  }
  this.goalNode = function() {
    return (this.label == 'goal')
  }
  this.portalNode = function() {
    return (this.label == 'portal')
  }
  this.wallNode = function() {
    return (this.label == 'wall')
  }
}

// edges, a join which original from and point to a destination nodes
function Edge(destination, cost) {
  this.destination = destination;
  this.cost = cost;
}

// and the graph which we can ask questions of is made up of nodes and edges
function Graph() {
  this.complete = false;
  this.startNode = null;
  this.goalNode = null;
  this.solved = false;
  this.nodes = [];

  this.addNode = function(node) {
    this.complete = false;
    this.nodes.push(node);

    if (node.startNode()) {
      this.startNode = node;
    }
    if (node.goalNode()) {
      this.goalNode = node;
    }
  }

  this.initialize = function() {
    if (!this.startNode) {
      throw "I am adrift at sea without a starting node";
    }
    if (!this.goalNode) {
      throw "Without goal nodes, what is my purpose? Do I pass butter?";
    }

    var delta_x, delta_y;

    // calculate values on each node
    for(var i = 0, node; node = this.nodes[i]; i++) {
      // calculate the heuristic

      // for A*, afaik, our heuristic is the as the crow flies distance to the goal
      // which we can simply calculate as the sum of the absolute values of delta x and y
      delta_x = Math.abs(this.goalNode.x - node.x);
      delta_y = Math.abs(this.goalNode.y - node.y);

      node.heuristic = delta_x + delta_y;

      // add edges, in this case it is all the potential moves

      // this is obviously a naive and inefficient way to do this
      up    = this.nodes.filter(function(p) { return ((p.x == node.x ) && (p.y == node.y + 1 )) })[0];
      upl   = this.nodes.filter(function(p) { return ((p.x == node.x - 1) && (p.y == node.y + 1 )) })[0];
      upr   = this.nodes.filter(function(p) { return ((p.x == node.x + 1) && (p.y == node.y + 1)) })[0];
      down  = this.nodes.filter(function(p) { return ((p.x == node.x) && (p.y == node.y - 1)) })[0];
      downl = this.nodes.filter(function(p) { return ((p.x == node.x - 1) && (p.y == node.y - 1)) })[0];
      downr = this.nodes.filter(function(p) { return ((p.x == node.x + 1) && (p.y == node.y - 1)) })[0];
      left  = this.nodes.filter(function(p) { return ((p.x == node.x - 1) && (p.y == node.y )) })[0];
      right = this.nodes.filter(function(p) { return ((p.x == node.x + 1) && (p.y == node.y )) })[0];

      // left right cost 10
      if (up)    { node.edges.push(new Edge(up, 10)) }
      if (down)  { node.edges.push(new Edge(down, 10)) }
      if (left)  { node.edges.push(new Edge(left, 10)) }
      if (right) { node.edges.push(new Edge(right, 10)) }

      // diagonals cost sqrt(2) * 10
      if (upl)   { node.edges.push(new Edge(upl, 10 * Math.sqrt(2))) }
      if (upr)   { node.edges.push(new Edge(upr, 10 * Math.sqrt(2))) }
      if (downl) { node.edges.push(new Edge(downl, 10 * Math.sqrt(2))) }
      if (downr) { node.edges.push(new Edge(downr, 10 * Math.sqrt(2))) }

      // magic portals!
      if (node.portalNode()) {
        node.edges.push(new Edge(this.goalNode, 0))
      }

    }

    this.complete = true;
  }

  this.solve = function() {

    // the algorithm gets us to the goal node, and tries to do so efficiently
    // 
    // we get to the goal node, purely through the re-parenting procedure
    // which lets us trace our steps backward
    // 
    // to get us to pick our next moves intelligently, we consider two items:
    //    1. the movement costs, which are ~14.1 for diagonals and 10 points for ordinals
    //    2. the heuristic, the as-the-crow flies distance to the goal, which we cached
    // 
    // we arrive at the final cost by for each node by summing the previous movement costs
    // up to and including this point and the heuristic
    // 
    // the previous movement costs are the parents movement costs
    // in this simple case all of the movements are pretty standard, we're on a grid
    // but it's obvious in real life applications where money and time are factored into cost
    // or in a game where there could be a terrain cost (sand vs asphalt) it might
    // have been smarter to go around rather than through something
    // 
    // we account for that through re-parenting, every time a new node is explored we're
    // looking to see if other nodes we intend to visit would benefit from having stepped
    // first through this node. If this is the case, we re-parent and re-calculate that node's cost
    // 

    // LETS DO IT

    // first, the cost of the start node is just the heuristic
    this.startNode.cost = this.startNode.heuristic;

    // we have to keep track of what we've visited, and are considering visiting
    // we store the visited state on the node itself, so we can just ask the object
    // 
    // we start, of course, with the startNode
    var visiting = [this.startNode];
    var currentNode, relevantEdges, indexOfNode, totalCost;

    while(!this.solved) {
      // next, not relevant for the startNode
      // we'd like to examine these in order of lowest cost to greatest
      currentNode = visiting.sort(function(a,b) { return a.cost > b.cost }).shift();

      if (typeof currentNode == 'undefined') {
        throw 'ran out of nodes to check before we found a solution'
      }

      // exclude visited nodes and obstacles like walls
      relevantEdges = currentNode.edges.filter(function(e) { return !(e.destination.wallNode() || e.destination.visited) })

      // iterate over the edges
      for(var i=0, currentEdge; currentEdge = relevantEdges[i]; i++) {

        // so this is the meat and potatoes

        // first, is this in the visiting list?
        // remember JS quirk.. indexOf returns -1 if not in list
        indexOfNode = visiting.indexOf(currentEdge.destination);
        totalCost = currentNode.cost + currentEdge.destination.heuristic + currentEdge.cost;

        // it is not
        if (indexOfNode == -1) {

          // set the cost
          currentEdge.destination.parent = currentNode;
          currentEdge.destination.cost = totalCost;

          visiting.push(currentEdge.destination);

        // it is
        } else {

          if (currentEdge.destination.cost > totalCost) {
            // re-set the cost and parent
            currentEdge.destination.parent = currentNode;
            currentEdge.destination.cost = totalCost;
          }

        }

        if (currentEdge.destination.goalNode()) {
          this.solved = true
        }

      }

      // and now we've visited this node
      currentNode.visited = true;

    }

  }

}

// now we're going to instantiate a graph
var graph = new Graph();

// add nodes
graph.addNode(new Node('wall', 0, 0))
graph.addNode(new Node('wall', 1, 0))
graph.addNode(new Node('wall', 2, 0))
graph.addNode(new Node('wall', 3, 0))
graph.addNode(new Node('wall', 4, 0))
graph.addNode(new Node('corridor', 5, 0))
graph.addNode(new Node('corridor', 6, 0))
graph.addNode(new Node('corridor', 7, 0))

graph.addNode(new Node('wall', 0, 1))
graph.addNode(new Node('corridor', 1, 1))
graph.addNode(new Node('corridor', 2, 1))
graph.addNode(new Node('portal', 3, 1))
graph.addNode(new Node('wall', 4, 1))
graph.addNode(new Node('corridor', 5, 1))
graph.addNode(new Node('corridor', 6, 1))
graph.addNode(new Node('corridor', 7, 1))

graph.addNode(new Node('wall', 0, 2))
graph.addNode(new Node('start', 1, 2))
graph.addNode(new Node('wall', 2, 2))
graph.addNode(new Node('wall', 3, 2))
graph.addNode(new Node('wall', 4, 2))
graph.addNode(new Node('corridor', 5, 2))
graph.addNode(new Node('corridor', 6, 2))
graph.addNode(new Node('corridor', 7, 2))

graph.addNode(new Node('wall', 0, 3))
graph.addNode(new Node('corridor', 1, 3))
graph.addNode(new Node('corridor', 2, 3))
graph.addNode(new Node('corridor', 3, 3))
graph.addNode(new Node('wall', 4, 3))
graph.addNode(new Node('wall', 5, 3))
graph.addNode(new Node('wall', 6, 3))
graph.addNode(new Node('wall', 7, 3))

graph.addNode(new Node('wall', 0, 4))
graph.addNode(new Node('corridor', 1, 4))
graph.addNode(new Node('wall', 2, 4))
graph.addNode(new Node('corridor', 3, 4))
graph.addNode(new Node('corridor', 4, 4))
graph.addNode(new Node('corridor', 5, 4))
graph.addNode(new Node('corridor', 6, 4))
graph.addNode(new Node('wall', 7, 4))

graph.addNode(new Node('wall', 0, 5))
graph.addNode(new Node('corridor', 1, 5))
graph.addNode(new Node('corridor', 2, 5))
graph.addNode(new Node('corridor', 3, 5))
graph.addNode(new Node('wall', 4, 5))
graph.addNode(new Node('corridor', 5, 5))
graph.addNode(new Node('corridor', 6, 5))
graph.addNode(new Node('wall', 7, 5))

graph.addNode(new Node('wall', 0, 6))
graph.addNode(new Node('wall', 1, 6))
graph.addNode(new Node('wall', 2, 6))
graph.addNode(new Node('wall', 3, 6))
graph.addNode(new Node('wall', 4, 6))
graph.addNode(new Node('corridor', 5, 6))
graph.addNode(new Node('goal', 6, 6))
graph.addNode(new Node('wall', 7, 6))

graph.addNode(new Node('corridor', 0, 7))
graph.addNode(new Node('corridor', 1, 7))
graph.addNode(new Node('corridor', 2, 7))
graph.addNode(new Node('corridor', 3, 7))
graph.addNode(new Node('wall', 4, 7))
graph.addNode(new Node('wall', 5, 7))
graph.addNode(new Node('wall', 6, 7))
graph.addNode(new Node('wall', 7, 7))

// mark it as complete, which will calculate heuristics and add edges
graph.initialize()

// use it
graph.solve()

console.log('solution found:')

var solutionParent;
while (solutionParent = (solutionParent ? solutionParent.parent : graph.goalNode)) {
  console.log("coordinates are: (" + solutionParent.x + ", " + solutionParent.y + ")")
}

