# frozen_string_literal: true

class Day < ApplicationRecord
  belongs_to :itinerary
  has_many :fast_passes, dependent: :destroy
  has_many :activities, dependent: :destroy
  has_many :meals, dependent: :destroy
end
