# frozen_string_literal: true

class AddShareTokenToItineraries < ActiveRecord::Migration[5.2]
  def change
    add_column :itineraries, :share_token, :string
  end
end
