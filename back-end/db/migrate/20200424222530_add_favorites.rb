# frozen_string_literal: true

class AddFavorites < ActiveRecord::Migration[5.2]
  def change
    create_table :favorites do |t|
      t.references :user
      t.references :itinerary

      t.timestamps
    end
  end
end
