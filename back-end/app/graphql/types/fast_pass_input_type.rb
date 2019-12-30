module Types
  class FastPassInputType < Types::BaseInputObject
    description 'Attributes to update a fast pass'
    argument :attraction, String, required: false
    argument :time, String, required: false
  end
end