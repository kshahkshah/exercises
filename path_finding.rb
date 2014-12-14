#! /usr/bin/env ruby


# My reference to the algorithm:
# https://www.youtube.com/watch?v=KNXfSOx4eEE
# 
# and using the maze from maze.rb

class Graph
  attr_accessor :start_node, :goal_node, :nodes, :initialized

  def initialize
    @initialized = false
    @nodes = []
  end

  def initialized?
    @initialized
  end

  def add_node(node)
    @initialized = false

    node.graph = self

    if node.start_node?
      raise ArgumentError, 'already defined one' if @start_node
      @start_node = node
    end
    if node.goal_node?
      raise ArgumentError, 'already defined one' if @goal_node
      @goal_node = node
    end

    @nodes << node
  end

  def complete!
    @nodes.map(&:heuristic)

    @nodes.each do |node|
      # up
      up = @nodes.select{ |n| (n.x == node.x) && (n.y == node.y+1) }.first
      node.edges << Edge.new(up, 10) if up

      # up-left
      upl = @nodes.select{ |n| (n.x == node.x+1) && (n.y == node.y+1) }.first
      node.edges << Edge.new(upl, 14) if upl

      # up-right
      upr = @nodes.select{ |n| (n.x == node.x-1) && (n.y == node.y+1) }.first
      node.edges << Edge.new(upr, 14) if upr

      # down
      down = @nodes.select{ |n| (n.x == node.x) && (n.y == node.y-1) }.first
      node.edges << Edge.new(down, 10) if down

      # down-left
      downl = @nodes.select{ |n| (n.x == node.x-1) && (n.y == node.y-1) }.first
      node.edges << Edge.new(downl, 14) if downl

      # down-right
      downr = @nodes.select{ |n| (n.x == node.x+1) && (n.y == node.y-1) }.first
      node.edges << Edge.new(downr, 14) if downr

      # left
      left = @nodes.select{ |n| (n.x == node.x-1) && (n.y == node.y) }.first
      node.edges << Edge.new(left, 10) if left

      # right
      right = @nodes.select{ |n| (n.x == node.x+1) && (n.y == node.y) }.first
      node.edges << Edge.new(right, 10) if right
    end

    @initialized = true
  end

  def solve!

    self.start_node.cost = 0
    @open = [self.start_node]

    while(current_node = @open.sort!{|a,b| a.cost <=> b.cost }.shift) do

      puts "examining #{current_node.x}, #{current_node.y}"

      current_node.edges.each do |edge|

        puts "looking at edge going to #{edge.to.x}, #{edge.to.y} (cost : #{edge.movement}, heuristic: #{edge.to.heuristic}, class: #{edge.to.class})"

        # don't do anything
        if edge.to.visited? || edge.to.obstacle_node?

        elsif edge.to.goal_node?
          edge.to.parent = current_node
          puts "Goal Node Reach, path through: #{current_node.x}, #{current_node.y}"

        else
          total_cost = edge.to.heuristic + edge.movement + (current_node.cost)

          if @open.index(edge.to)
            # reassign
            if edge.to.cost > total_cost
              edge.to.cost = total_cost
              edge.to.parent = current_node
            end

          else
            # add to the open list, set an initial value from here, set a current parent
            @open << edge.to
            edge.to.cost = total_cost
            edge.to.parent = current_node
          end

        end
      end

      current_node.visited = true

    end
  end
end

class Node
  attr_accessor :visited, :parent, :edges, :x, :y, :cost, :graph

  def initialize(x,y)
    @x = x
    @y = y

    @visited = false
    @parent  = nil
    @edges = []
  end

  def start_node?
    false
  end

  def goal_node?
    false
  end

  def obstacle_node?
    false
  end

  def visited?
    @visited
  end

  def heuristic
    return @heuristic if @heuristic

    delta_x = (graph.goal_node.x - self.x).abs
    delta_y = (graph.goal_node.y - self.y).abs

    @heuristic = delta_x + delta_y
  end
end

class StartNode < Node
  def start_node?
    true
  end
end
class GoalNode < Node
  def goal_node?
    true
  end
  def heuristic
    0
  end
end
class ObstacleNode < Node
  def obstacle_node?
    true
  end
  def heuristic
    nil
  end
end

class Edge
  attr_accessor :to, :movement

  def initialize(to, movement)
    @to = to
    @movement = movement
  end
end

# MAZE LIKE THIS
# row, by row.
# astericks are walls/obstacles
# dashes are open space
# S is the start
# E is the goal

# '*','*','*','*','*','-','-','-'
graph = Graph.new

graph.add_node ObstacleNode.new(0,0)
graph.add_node ObstacleNode.new(1,0)
graph.add_node ObstacleNode.new(2,0)
graph.add_node ObstacleNode.new(3,0)
graph.add_node ObstacleNode.new(4,0)
graph.add_node Node.new(5,0)
graph.add_node Node.new(6,0)
graph.add_node Node.new(7,0)

# '*','-','-','-','*','-','-','-'
graph.add_node ObstacleNode.new(0,1)
graph.add_node Node.new(1,1)
graph.add_node Node.new(2,1)
graph.add_node Node.new(3,1)
graph.add_node ObstacleNode.new(4,1)
graph.add_node Node.new(5,1)
graph.add_node Node.new(6,1)
graph.add_node Node.new(7,1)

# '*','S','*','*','*','-','-','-'
graph.add_node ObstacleNode.new(0,2)
graph.add_node StartNode.new(1,2)
graph.add_node ObstacleNode.new(2,2)
graph.add_node ObstacleNode.new(3,2)
graph.add_node ObstacleNode.new(4,2)
graph.add_node Node.new(5,2)
graph.add_node Node.new(6,2)
graph.add_node Node.new(7,2)

# '*','-','-','-','*','*','*','*'
graph.add_node ObstacleNode.new(0,3)
graph.add_node Node.new(1,3)
graph.add_node Node.new(2,3)
graph.add_node Node.new(3,3)
graph.add_node ObstacleNode.new(4,3)
graph.add_node ObstacleNode.new(5,3)
graph.add_node ObstacleNode.new(6,3)
graph.add_node ObstacleNode.new(7,3)

# '*','-','*','-','-','-','-','*'
graph.add_node ObstacleNode.new(0,4)
graph.add_node Node.new(1,4)
graph.add_node ObstacleNode.new(2,4)
graph.add_node Node.new(3,4)
graph.add_node Node.new(4,4)
graph.add_node Node.new(5,4)
graph.add_node Node.new(6,4)
graph.add_node ObstacleNode.new(7,4)

# '*','-','-','-','*','-','-','*'
graph.add_node ObstacleNode.new(0,5)
graph.add_node Node.new(1,5)
graph.add_node Node.new(2,5)
graph.add_node Node.new(3,5)
graph.add_node ObstacleNode.new(4,5)
graph.add_node Node.new(5,5)
graph.add_node Node.new(6,5)
graph.add_node ObstacleNode.new(7,5)

# '*','*','*','*','*','-','E','*'
graph.add_node ObstacleNode.new(0,6)
graph.add_node ObstacleNode.new(1,6)
graph.add_node ObstacleNode.new(2,6)
graph.add_node ObstacleNode.new(3,6)
graph.add_node ObstacleNode.new(4,6)
graph.add_node Node.new(5,6)
graph.add_node GoalNode.new(6,6)
graph.add_node ObstacleNode.new(7,6)

# '-','-','-','-','*','*','*','*'
graph.add_node Node.new(0,7)
graph.add_node Node.new(1,7)
graph.add_node Node.new(2,7)
graph.add_node Node.new(3,7)
graph.add_node ObstacleNode.new(4,7)
graph.add_node ObstacleNode.new(5,7)
graph.add_node ObstacleNode.new(6,7)
graph.add_node ObstacleNode.new(7,7)

graph.complete!
graph.solve!

parent = graph.goal_node

while(parent = parent.parent) do
  puts "#{parent.class}: #{parent.x}, #{parent.y}"
end
