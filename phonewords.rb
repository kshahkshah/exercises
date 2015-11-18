
def digitToLetters(digit)
  return {
    '1': [],
    '2': ['a', 'b', 'c'],
    '3': ['d', 'e', 'f'],
    '4': ['g', 'h', 'i'],
    '5': ['j', 'k', 'l'],
    '6': ['m', 'n', 'o'],
    '7': ['p', 'q', 'r', 's'],
    '8': ['t', 'u', 'v'],
    '9': ['w', 'x', 'y', 'z'],
    '0': []
  }[digit.to_s.to_sym]
end

def digitsToLetters(digits)
  digits.to_s.split('').map{|c| digitToLetters(c)}
end

digits = gets.chomp

stack = digitsToLetters(digits)
words = []

while letters = stack.shift do
  if words.empty?
    # first pass
    words.push(*letters)
  else
    temporary = []
    # subsequent passes
    words.each do |word|
      # join this word with each letter
      letters.each do |letter|
        temporary.push(word + letter)
      end
    end
    words = temporary
  end
end

puts words.join(', ')
