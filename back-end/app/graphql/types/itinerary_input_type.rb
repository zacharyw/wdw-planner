module Types
  class ItineraryInputType < Types::BaseInputObject
    description 'Attributes for updating an entire Itinerary'
    argument :id, ID, required: true
    argument :name, String, required: false
    argument :hotel, String, required: false
    argument :check_in, String, required: false
    argument :check_out, String, required: false
    argument :days, [DayInputType], required: false
  end
end
