# frozen_string_literal: true

class CreateMeals < ActiveRecord::Migration[5.2]
  def change
    create_table :meals do |t|
      t.references :day, foreign_key: true
      t.string :restaurant
      t.datetime :time

      t.timestamps
    end
  end
end
