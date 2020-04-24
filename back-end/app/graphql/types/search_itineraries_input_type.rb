# frozen_string_literal: true

module Types
  class SearchItinerariesInputType < Types::BaseInputObject
    description 'Parameters for searching for itineraries'
    argument :hotel, String, required: false
    argument :nights, Int, required: false
    argument :parks, [String], required: false
  end
end
