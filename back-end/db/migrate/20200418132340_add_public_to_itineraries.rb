# frozen_string_literal: true

class AddPublicToItineraries < ActiveRecord::Migration[5.2]
  def change
    add_column :itineraries, :public, :boolean, null: false, default: true
  end
end
