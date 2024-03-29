# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_04_27_124853) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: :cascade do |t|
    t.bigint "day_id"
    t.string "name"
    t.datetime "time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["day_id"], name: "index_activities_on_day_id"
  end

  create_table "days", force: :cascade do |t|
    t.bigint "itinerary_id"
    t.string "park"
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "notes"
    t.index ["itinerary_id"], name: "index_days_on_itinerary_id"
  end

  create_table "fast_passes", force: :cascade do |t|
    t.bigint "day_id"
    t.string "attraction"
    t.datetime "time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["day_id"], name: "index_fast_passes_on_day_id"
  end

  create_table "favorites", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "itinerary_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["itinerary_id"], name: "index_favorites_on_itinerary_id"
    t.index ["user_id"], name: "index_favorites_on_user_id"
  end

  create_table "itineraries", force: :cascade do |t|
    t.bigint "user_id"
    t.string "hotel"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "check_in"
    t.datetime "check_out"
    t.string "share_token"
    t.text "notes"
    t.boolean "public", default: true, null: false
    t.index ["user_id"], name: "index_itineraries_on_user_id"
  end

  create_table "itinerary_copies", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "itinerary_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["itinerary_id"], name: "index_itinerary_copies_on_itinerary_id"
    t.index ["user_id"], name: "index_itinerary_copies_on_user_id"
  end

  create_table "meals", force: :cascade do |t|
    t.bigint "day_id"
    t.string "restaurant"
    t.datetime "time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["day_id"], name: "index_meals_on_day_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "whitelisted_jwts", force: :cascade do |t|
    t.string "jti", null: false
    t.string "aud"
    t.datetime "exp", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["jti"], name: "index_whitelisted_jwts_on_jti", unique: true
    t.index ["user_id"], name: "index_whitelisted_jwts_on_user_id"
  end

  add_foreign_key "activities", "days"
  add_foreign_key "days", "itineraries"
  add_foreign_key "fast_passes", "days"
  add_foreign_key "itineraries", "users"
  add_foreign_key "itinerary_copies", "itineraries"
  add_foreign_key "itinerary_copies", "users"
  add_foreign_key "meals", "days"
  add_foreign_key "whitelisted_jwts", "users", on_delete: :cascade
end
