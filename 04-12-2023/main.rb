# this means that strings can't be changed here
# frozen_string_literal: true

DEFAULT_FILE_PATH = 'input2.txt'

# num == 3
def rec_double(num)
  return 0 if num.zero?
  return 1 if num == 1
  return 2 if num == 2

  # rec_double(2) * 2
  # 2 * 2
  # 4
  rec_double(num - 1) * 2
end

# puts rec_double(6)
#
def sum_from_array(array)
  count = 0
  array.each do |new_line|
    # puts new_line
    # puts new_line.class
    # puts new_line
    # puts new_line
    # puts new_line.class
    line = new_line.split('|')
    # puts 'This is the winning combo 🤴'
    winning_numbers = line[0].split(':')[1].split(' ')
    # puts winning_numbers
    # puts 'This is what you got 📘'
    your_numbers = line[1].split(' ')
    # Iterate over your_numbers
    # 1 + 1 + 2 + 4 = 4 * 2
    # 1 + 1 + 2 = 3 * 2
    matches = 0
    your_numbers.each do |your_number|
      matches += 1 if winning_numbers.include?(your_number)
    end
    # puts "matches: #{matches}"
    count += rec_double(matches)
  end
  puts "count: #{count}"
end

def sum_from_file(file_path)
  File.open(file_path, 'r') do |file|
    # Read first line
    lines = file.readlines
    puts lines.length
    sum_from_array(lines)
  end
end

# this is to solve 1
# sum_from_file(DEFAULT_FILE_PATH)
