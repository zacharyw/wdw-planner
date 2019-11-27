# frozen_string_literal: true

class SessionsController < Devise::SessionsController
  def create
    super { @token = current_token }
  end

  def show; end

  def destroy
    super { WhitelistedJwt.find_by_jti(request.env['warden-jwt_auth.token']).destroy! }
  end

  private

  def current_token
    request.env['warden-jwt_auth.token']
  end
end
