module Types
  class MealInputType < Types::BaseInputObject
    description 'Attributes to update a fast pass'
    argument :restaurant, String, required: false
    argument :time, String, required: false
  end
end