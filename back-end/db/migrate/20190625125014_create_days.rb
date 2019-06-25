# frozen_string_literal: true

class CreateDays < ActiveRecord::Migration[5.2]
  def change
    create_table :days do |t|
      t.references :itinerary, foreign_key: true
      t.string :park
      t.date :date

      t.timestamps
    end
  end
end
