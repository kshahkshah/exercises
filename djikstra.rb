#! /usr/bin/env ruby

require 'byebug'

class Node
  attr_accessor :label, :edges, :visited

  def initialize(label)
    @label = label
    @visited = false
    @edges = []
  end

  def visited?
    @visited
  end

end

class Edge
  attr_accessor :to, :cost

  def initialize(to, cost)
    @to = to
    @cost = cost
  end
end

@nodes = []

@nodes << a = Node.new('a')
@nodes << b = Node.new('b')
@nodes << c = Node.new('c')
@nodes << d = Node.new('d')
@nodes << e = Node.new('e')
@nodes << f = Node.new('f')
@nodes << g = Node.new('g')
@nodes << h = Node.new('h')

a.edges << Edge.new(g, 90)
a.edges << Edge.new(b, 20)
a.edges << Edge.new(d, 80)
b.edges << Edge.new(f, 10)
f.edges << Edge.new(d, 40)
f.edges << Edge.new(c, 10)
c.edges << Edge.new(f, 50)
c.edges << Edge.new(h, 20)
c.edges << Edge.new(d, 10)
d.edges << Edge.new(g, 20)
g.edges << Edge.new(a, 20)
e.edges << Edge.new(b, 50)
e.edges << Edge.new(g, 30)


module Paths
  attr_accessor :origin

  def self.explore(from, graph)
    @origin = from
    @nodes = graph
    @routes = {}

    @unvisited = [@origin]

    while(current_node = @unvisited.pop) do
      puts "We're visiting destination #{current_node.label}"

      smallest_new = nil

      # starting from the origin, then leaving from it's edges
      current_node.edges.each do |edge|

        # to this edge's node
        current_best_route_to   = @routes[edge.to.label]
        current_best_route_from = @routes[current_node.label]

        total_cost = edge.cost + (current_best_route_from ? current_best_route_from[:cost] : 0)

        # no current route here
        if !current_best_route_to || (current_best_route_to && (current_best_route_to[:cost] > total_cost))
          @routes[edge.to.label] = { cost: total_cost, via: current_node.label }
        end

        unless edge.to.visited?
          if smallest_new
            smallest_new = (smallest_new[:total_cost] > total_cost) ? { total_cost: total_cost, node: edge.to } : smallest_new
          else
            smallest_new = { total_cost: total_cost, node: edge.to }
          end
        end

      end

      @unvisited.push(smallest_new[:node]) if smallest_new
      current_node.visited = true

    end

    return @routes
  end
end


puts "Pick your origin"
puts @nodes.map(&:label).join(', ')

STDOUT.flush

raw_origin = gets.chomp

origin = @nodes.select{|n|n.label == raw_origin}.first

raise ArgumentError, "couldn't find that origin!" unless origin

puts "Okay! Starting from #{origin.label}:"

Paths.explore(origin, @nodes).each_pair do |destination, route|
  puts "to get to #{destination} it'll take #{route[:cost]} via #{route[:via]}"
end

