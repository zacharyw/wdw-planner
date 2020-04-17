# frozen_string_literal: true

class AddNotes < ActiveRecord::Migration[5.2]
  def change
    add_column :itineraries, :notes, :text, null: true, default: nil
    add_column :days, :notes, :text, null: true, default: nil
  end
end
