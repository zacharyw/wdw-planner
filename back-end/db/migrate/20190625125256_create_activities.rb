# frozen_string_literal: true

class CreateActivities < ActiveRecord::Migration[5.2]
  def change
    create_table :activities do |t|
      t.references :day, foreign_key: true
      t.string :name
      t.datetime :time

      t.timestamps
    end
  end
end
