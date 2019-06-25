# frozen_string_literal: true

class CreateFastPasses < ActiveRecord::Migration[5.2]
  def change
    create_table :fast_passes do |t|
      t.references :day, foreign_key: true
      t.string :attraction
      t.datetime :time

      t.timestamps
    end
  end
end
