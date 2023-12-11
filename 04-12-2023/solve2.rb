# this means that strings can't be changed here
# frozen_string_literal: true

require_relative 'main'

file_path = 'input.txt'

def subst(tree, root, container_ref)
  # c1
  node = tree[root]
  # puts root
  # push the root
  # puts root

  node.each do |key|
    # push the result value
    container_ref.push(subst(tree, key, container_ref)) if key != root
  end
end

File.open(file_path, 'r+') do |file|
  # Peek at the next line without advancing the file pointer
  stuff = file.readlines
  rem = {}
  disconnected = []
  stuff.each_with_index do |new_line, index|
    copies = []

    line = new_line.split('|')
    winning_numbers = line[0].split(':')[1].split(' ')
    your_numbers = line[1].split(' ')

    # Iterate over your_numbers
    # c1 creates 4 copies of the next (c2, c3, c4, c5), one for each
    matches = 0
    your_numbers.each do |your_number|
      matches += 1 if winning_numbers.include?(your_number)
    end

    # puts "new index 🆘 #{index}"

    # puts 'match begin ⭐'
    # to_append = []
    copies.push(stuff[index])
    (1..matches).each do |match|
      # 0 + 1, card 1
      # 0 + 1, card 1
      #  file.puts stuff[match + i]
      # stuff.insert(index + match, stuff[match + index])
      # check if there is anything for the copies
      copies.push(stuff[match + index])
    end

    if matches == 0
      disconnected.push(stuff[index])
      puts "no matches for this line #{stuff[index]}"
    end

    # Add copies array as the value for the key in the rem hash
    rem[stuff[index].to_s] = copies

    # stuff.insert(index + 1, *to_append)
  end

  root = stuff[0]
  data = []

  data.push(subst(rem, root, data))

  result = data.map do |element|
    if element.is_a?(Array) && element
      # If it's an array, convert each element to string
      element.map(&:to_s)
    else
      # If it's not an array, keep it as is
      element
    end
  end

  array_a = result.flatten

  disconnected.each do |disco|
    array_a.push(disco) unless array_a.include?(disco)
  end
  puts array_a.size
  # puts final
  # feed the value to the old program
end
