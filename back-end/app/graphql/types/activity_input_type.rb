module Types
  class ActivityInputType < Types::BaseInputObject
    description 'Attributes to update a fast pass'
    argument :name, String, required: false
    argument :time, String, required: false
  end
end