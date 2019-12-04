# frozen_string_literal: true

class Day < ApplicationRecord
  belongs_to :itinerary
  has_many :fast_passes
  has_many :activities
  has_many :meals
end
