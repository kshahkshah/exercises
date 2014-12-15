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
  this._x = x;
  this._y = y;
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
      if (up)    { nodes.edge << new Edge(up, 10) }
      if (down)  { nodes.edge << new Edge(down, 10) }
      if (left)  { nodes.edge << new Edge(left, 10) }
      if (right) { nodes.edge << new Edge(right, 10) }

      // diagonals cost sqrt(2) * 10
      if (upl)   { nodes.edge << new Edge(upl, 10 * Math.sqrt(2)) }
      if (upr)   { nodes.edge << new Edge(upr, 10 * Math.sqrt(2)) }
      if (downl) { nodes.edge << new Edge(downl, 10 * Math.sqrt(2)) }
      if (downr) { nodes.edge << new Edge(downr, 10 * Math.sqrt(2)) }
    }

    this.complete = true;
  }

  this.solve = function() {
    // 
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


