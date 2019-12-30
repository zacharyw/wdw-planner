module Types
  class DayInputType < Types::BaseInputObject
    description 'Attributes for updating a day'
    argument :park, String, required: false
    argument :fastPasses, [FastPassInputType], required: false
    argument :activities, [ActivityInputType], required: false
    argument :meals, [MealInputType], required: false
  end
end
