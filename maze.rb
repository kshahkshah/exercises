#! /usr/bin/env ruby

# for a given maze, which we'll just use the one below, is there a solution?
require 'byebug'

@solutions = []
maze = [
        ['*','*','*','*','*','-','-','-'],
        ['*','-','-','-','*','-','-','-'],
        ['*','S','*','*','*','-','-','-'],
        ['*','-','-','-','*','*','*','*'],
        ['*','-','*','-','-','-','-','*'],
        ['*','-','-','-','*','-','-','*'],
        ['*','*','*','*','*','-','E','*'],
        ['-','-','-','-','*','*','*','*']
       ]

def print_maze(maze)
  maze.each do |row|
    puts row.join(' ')
  end
end

def solve(maze)
  start_coordinates = maze.map{|c| c.index("S") }.map.with_index{ |c, i| c ? [c,i] : nil }.compact.first
  end_coordinates   = maze.map{|c| c.index("E") }.map.with_index{ |c, i| c ? [c,i] : nil }.compact.first

  raise ArgumentError unless start_coordinates && end_coordinates

  puts "Start is at (#{start_coordinates[1]}, #{start_coordinates[0]})\n"
  puts "Exploring the maze!"
  print_maze(maze)

  explore(maze, start_coordinates[1], start_coordinates[0])
end

def travel_through(maze, row, col)
  new_maze = maze.dup
  new_maze[row][col] = "~"
  new_maze
end

def explore(maze, row, col)

  # a move up is     [current_row - 1][current_column]
  # a move down is   [current_row + 1][current_column]
  # a move left is   [current_row][current_column - 1]
  # a move right is  [current_row][current_column + 1]

  # it is a valid move if it doesn't include a wall (*),
  # traversing back over the start (S),
  # or a traversed space (~)
  invalid_moves = ['*','S','~']

  # test move up
  if row > 0
    up = maze[row-1][col]

    if up == 'E'
      # puts "End Found!"
      # print_maze(maze)
      @solutions << maze
    elsif !invalid_moves.include?(up)
      # puts "going up from row #{row} and col #{col} to row #{row-1} and col #{col}!"
      new_maze = travel_through(maze, row-1, col)
      # print_maze(new_maze)

      explore(new_maze, row-1, col)
    end
  end

  # test move down
  if row < maze.length
    down = maze[row+1][col]

    if down == 'E'
      # puts "End Found!"
      # print_maze(maze)
      @solutions << maze
    elsif !invalid_moves.include?(down)
      # puts "going down from row #{row} and col #{col} to row #{row+1} and col #{col}!"
      new_maze = travel_through(maze, row+1, col)
      # print_maze(new_maze)

      explore(new_maze, row+1, col)
    end
  end

  # test move left
  if col > 0
    left = maze[row][col-1]

    if left == 'E'
      # puts "End Found!"
      # print_maze(maze)
      @solutions << maze
    elsif !invalid_moves.include?(left)
      # puts "going left from row #{row} and col #{col} to row #{row} and col #{col-1}!"
      new_maze = travel_through(maze, row, col-1)
      # print_maze(new_maze)

      explore(new_maze, row, col-1)
    end
  end

  # test move right
  if col < maze[0].length
    right = maze[row][col+1]

    if right == 'E'
      # puts "End Found!"
      # print_maze(maze)
      @solutions << maze
    elsif !invalid_moves.include?(right)
      # puts "going right from row #{row} and col #{col} to row #{row} and col #{col+1}!"
      new_maze = travel_through(maze, row, col+1)
      # print_maze(new_maze)

      explore(new_maze, row, col+1)
    end
  end

end

solve(maze)

if @solutions.length > 0
  puts "Found #{@solutions.uniq.length} unique solutions"
  @solutions.uniq.each_with_index do |maze, index|
    puts "Solution #{index+1}:"
    print_maze(maze)
  end
else
  puts "No Solutions Found! Profound Sadness ensues!"
end

