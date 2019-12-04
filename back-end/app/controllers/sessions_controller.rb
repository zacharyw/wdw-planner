# frozen_string_literal: true

class SessionsController < Devise::SessionsController
  def create
    super { @token = current_token }
  end

  def show
    puts 'welp'
  end

  def destroy
    super
  end

  private

  def current_token
    request.env['warden-jwt_auth.token']
  end
end
