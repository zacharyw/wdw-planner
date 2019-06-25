# frozen_string_literal: true

class CreateItineraries < ActiveRecord::Migration[5.2]
  def change
    create_table :itineraries do |t|
      t.references :user, foreign_key: true
      t.string :hotel
      t.date :check_in
      t.date :check_out
      t.string :name

      t.timestamps
    end
  end
end
