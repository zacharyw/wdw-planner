# frozen_string_literal: true

class CreateItineraryCopies < ActiveRecord::Migration[5.2]
  def change
    create_table :itinerary_copies do |t|
      t.references :user, foreign_key: true
      t.references :itinerary, foreign_key: true

      t.timestamps
    end
  end
end
