# frozen_string_literal: true

module Types
  class QueryType < Types::BaseObject
    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    field :itineraries, [Types::ItineraryType],
          null: false,
          description: 'Returns list of itineraries for current user'

    field :itinerary, Types::ItineraryType, null: false do
      description 'Returns single itinerary for current user for given itinerary ID'
      argument :id, ID, required: true
    end

    field :shared_itinerary, Types::ItineraryType, null: false do
      description 'Returns single itinerary for the given share token'
      argument :share_token, ID, required: true
    end

    field :search_itineraries, [Types::ItineraryType], null: false do
      description 'Returns list of itineraries matching search criteria'
      argument :params, Types::SearchItinerariesInputType, required: true
    end

    def itineraries
      Itinerary.where(user: context[:current_user])
    end

    def itinerary(id:)
      itinerary = Itinerary.where(id: id, user: context[:current_user]).first

      itinerary ||= Itinerary.new(user: context[:current_user])

      itinerary
    end

    def shared_itinerary(share_token:)
      Itinerary.where(share_token: share_token).first
    end

    def search_itineraries(params:)
      query = Itinerary.includes(:days, :itinerary_copies).where(public: true)

      if params.parks.present?
        parks = params.parks.map do |park|
          park == 'No Park' ? nil : park
        end

        query = query
                .distinct
                .joins('INNER JOIN days on days.itinerary_id = itineraries.id')
                .where(days: { park: parks })
      end

      if params.hotel.present?
        query = query.where('hotel ILIKE ?', "%#{params.hotel}%")
      end

      itineraries = query.to_a

      if params.nights.present?
        itineraries = itineraries.select do |itinerary|
          itinerary.days.count == params.nights + 1
        end
      end

      itineraries
    end
  end
end
