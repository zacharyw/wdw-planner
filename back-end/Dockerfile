FROM ruby:2.5

RUN apt-get update -qq && apt-get install -y postgresql-client
RUN mkdir /railsapp
WORKDIR /railsapp
COPY Gemfile /railsapp/Gemfile
COPY Gemfile.lock /railsapp/Gemfile.lock
RUN bundle install
COPY . /railsapp

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

EXPOSE 8080
EXPOSE 1234
EXPOSE 26166-26168

# CMD ["rails", "server", "-b", "0.0.0.0"]
