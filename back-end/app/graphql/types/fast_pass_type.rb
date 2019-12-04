module Types
  class FastPassType < Types::BaseObject
    field :id, ID, null: false
    field :day_id, ID, null: false
    field :attraction, String, null: true
    field :time, GraphQL::Types::ISO8601DateTime, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
