# frozen_string_literal: true

class Itinerary < ApplicationRecord
  belongs_to :user

  has_many :days
end
