# typed: false 
file_path = 'input2.txt'

# Open the file in read mode
File.open(file_path, 'r') do |file|
  # read first line
  puts file.first.split('|')
  # file.each_line do |line|
  #   # Print each line to the console
  #   puts line
  # end
end

