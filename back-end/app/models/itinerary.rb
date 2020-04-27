# frozen_string_literal: true

class Itinerary < ApplicationRecord
  belongs_to :user

  has_many :days, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :itinerary_copies, dependent: :destroy

  validates :share_token, presence: true
  validates :share_token, uniqueness: true

  before_validation :generate_token, if: :generate_token_on_save?

  def generate_token
    self.share_token = SecureRandom.urlsafe_base64(64, false)
  end

  def generate_token_on_save?
    !persisted? || (will_save_change_to_public? && !public?)
  end

  def popularity
    itinerary_copies.count * 100
  end
end
