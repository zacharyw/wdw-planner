# frozen_string_literal: true

class ConvertItineraryDateToDatetime < ActiveRecord::Migration[5.2]
  def up
    remove_column :itineraries, :check_in
    remove_column :itineraries, :check_out

    add_column :itineraries, :check_in, :datetime
    add_column :itineraries, :check_out, :datetime
  end

  def down
    remove_column :itineraries, :check_in
    remove_column :itineraries, :check_out

    add_column :itineraries, :check_in, :date
    add_column :itineraries, :check_out, :date
  end
end
