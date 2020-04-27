# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :update_itinerary, ItineraryType, null: true do
      description 'Fully update an itinerary, or create one if ID does not exist'
      argument :attributes, ItineraryInputType, required: true
    end
    def update_itinerary(attributes:)
      itinerary = Itinerary.where(
        id: attributes.id, user: context[:current_user]
      ).first

      itinerary ||= Itinerary.new(user: context[:current_user])

      ActiveRecord::Base.transaction do
        Day.destroy(itinerary.days.map(&:id))

        itinerary.update(
          name: attributes.name,
          hotel: attributes.hotel,
          check_in: attributes.check_in,
          check_out: attributes.check_out,
          notes: attributes.notes,
          public: attributes.public
        )

        attributes.days.each do |day_attrs|
          day = itinerary.days.create!(
            park: day_attrs.park,
            notes: day_attrs.notes
          )

          day_attrs.fast_passes.each do |fast_pass_attrs|
            day.fast_passes.create!(fast_pass_attrs.to_h)
          end

          day_attrs.activities.each do |activity_attrs|
            day.activities.create!(activity_attrs.to_h)
          end

          day_attrs.meals.each do |meal_attrs|
            day.meals.create!(meal_attrs.to_h)
          end
        end
      end

      itinerary.reload
    end

    field :delete_itinerary, ItineraryType, null: true do
      description 'Deletes itinerary matching given id'
      argument :id, ID, required: true
    end
    def delete_itinerary(id:)
      itinerary = Itinerary.where(id: id, user: context[:current_user]).first

      itinerary.destroy!

      itinerary
    end

    field :clone_itinerary, ItineraryType, null: true do
      description 'Given a share token, deep clones the itinerary to the current user'
      argument :share_token, ID, required: true
    end
    def clone_itinerary(share_token:)
      itinerary = Itinerary.find_by(share_token: share_token)

      clone = itinerary.deep_clone(
        include: {
          days: %i[fast_passes activities meals]
        },
        validate: false
      )

      clone.tap do |c|
        c.user = context[:current_user]
        c.generate_token
      end

      ActiveRecord::Base.transaction do
        clone.save!
        ItineraryCopy.new(user: context[:current_user], itinerary: itinerary).save!
      end

      clone
    end

    ## LOGIN
    field :login, UserType, null: true do
      description 'Login for users'
      argument :email, String, required: true
      argument :password, String, required: true
    end
    def login(email:, password:)
      user = User.find_for_authentication(email: email)
      return nil unless user

      is_valid_for_auth = user.valid_for_authentication? do
        user.valid_password?(password)
      end

      is_valid_for_auth ? user.login! : nil
    end

    ## TOKEN-LOGIN
    field :token_login, UserType, null: true do
      description 'JWT token login'
    end
    def token_login
      context[:current_user]
    end

    ## LOGOUT
    field :logout, Boolean, null: true do
      description 'Logout for users'
    end
    def logout
      if context[:current_user]
        WhitelistedJwt.find_by(
          jti: request.env['warden-jwt_auth.token']
        ).destroy!
        return true
      end
      false
    end

    # Uncomment to enable features

    field :update_user, UserType, null: true do
      description 'Update user'
      argument :password, String, required: false
      argument :passwordConfirmation, String, required: false
    end

    def update_user(
      password: context[:current_user] ? context[:current_user].password : '',
      password_confirmation: context[:current_user] ? context[:current_user].password_confirmation : ''
    )
      user = context[:current_user]
      return nil unless user

      user.update!(
        password: password,
        password_confirmation: password_confirmation
      )
      user
    end

    field :sign_up, UserType, null: true do
      description 'Sign up for users'
      argument :email, String, required: true
      argument :password, String, required: true
    end
    def sign_up(email:, password:)
      User.create(
        email: email,
        password: password
      )
    end

    field :send_reset_password_instructions, Boolean, null: true do
      description 'Send password reset instructions to users email'
      argument :email, String, required: true
    end
    def send_reset_password_instructions(email:)
      user = User.find_by(email: email)
      return true unless user

      user.send_reset_password_instructions
      true
    end

    field :reset_password, Boolean, null: true do
      argument :password, String, required: true
      argument :passwordConfirmation, String, required: true
      argument :resetPasswordToken, String, required: true
    end
    def reset_password(password:, password_confirmation:, reset_password_token:)
      user = User.with_reset_password_token(reset_password_token)
      return false unless user

      user.reset_password(password, password_confirmation)
    end

    #
    # uncomment for unlock instructions
    #
    # UNLOCK ACCOUNT
    # field :unlock, Boolean, null: false do
    #   argument :unlockToken, String, required: true
    # end
    # def unlock(unlock_token:)
    #   user = User.unlock_access_by_token(unlock_token)
    #   return user.id
    # end

    # RESEND UNLOCK INSTRUCTIONS
    # field :resend_unlock_instructions, Boolean, null: false do
    #   argument :email, String, required: true
    # end
    # def resend_unlock_instructions(email:)
    #   user = User.find_by_email(email)
    #   return false if !user

    #   user.resend_unlock_instructions
    # end
  end
end
