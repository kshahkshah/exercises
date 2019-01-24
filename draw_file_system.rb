
# recursively walks file system

def draw_file_system(base, depth)
  stack = Dir.glob("#{File.expand_path(base)}/*")

  while(directory = stack.shift) do
    puts "|" + ("--" * depth) + " #{directory.split('/').last}\n"
    draw_file_system(directory, depth + 1)
  end

end

puts "Which directory?"

base = gets.chomp
base = base[-1] == '/' ? base.chop : base

draw_file_system(base, 1)
