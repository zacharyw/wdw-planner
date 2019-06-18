restaurants = []

File.foreach('restaurant_list.txt').with_index do |line, line_num|
  new_line = line.strip

  next if new_line.length == 0

  restaurants << "\"#{new_line}\""
end

puts "[#{restaurants.join(', ')}]"