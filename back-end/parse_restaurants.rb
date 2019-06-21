restaurants = []

File.foreach('hs_fastpass.txt').with_index do |line, line_num|
  new_line = line.strip

  next if new_line.length == 0

  restaurants << "{ name: \"#{new_line}\", tier: 2 }"
end

puts "[#{restaurants.join(', ')}]"