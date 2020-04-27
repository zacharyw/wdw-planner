# frozen_string_literal: true

class ItineraryCopy < ApplicationRecord
  belongs_to :user
  belongs_to :itinerary
end
