module Types
  class ItineraryType < Types::BaseObject
    field :id, ID, null: false
    field :hotel, String, null: true
    field :check_in, GraphQL::Types::ISO8601Date, null: true
    field :check_out, GraphQL::Types::ISO8601Date, null: true
    field :name, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    field :days, [Types::DayType], null: false

    def days
      AssociationLoader.for(Itinerary, :days).load(object)
    end
  end
end
