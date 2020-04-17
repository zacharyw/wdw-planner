module Types
  class DayType < Types::BaseObject
    field :id, ID, null: false
    field :itinerary_id, ID, null: false
    field :park, String, null: true
    field :notes, String, null: true
    field :date, GraphQL::Types::ISO8601Date, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    field :fast_passes, [Types::FastPassType], null: false
    field :meals, [Types::MealType], null: false
    field :activities, [Types::ActivityType], null: false

    def fast_passes
      AssociationLoader.for(Day, :fast_passes).load(object)
    end

    def meals
      AssociationLoader.for(Day, :meals).load(object)
    end

    def activities
      AssociationLoader.for(Day, :activities).load(object)
    end
  end
end
