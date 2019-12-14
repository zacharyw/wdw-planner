export default class ApolloScheme {
  constructor(auth, options) {
    this.$auth = auth;
    this.name = options._name;
    this.options = Object.assign({}, DEFAULTS, options);
    this.$client = auth.ctx.app.apolloProvider.clients[this.options.clientName];
    this.$helpers = auth.ctx.app.$apolloHelpers;
    this.loginMutation = this.options.mutations.login;
    this.logoutMutation = this.options.mutations.logout;
    this.userMutation = this.options.mutations.user;
    this.loginDataKey = this.options.loginDataKey;
    this.fetchUserDataKey = this.options.fetchUserDataKey;
  }

  async login(variables) {
    if (!this.loginMutation) {
      return;
    }

    await this._logoutLocally();

    const result = await this.$client
      .mutate({
        mutation: this.loginMutation,
        variables: variables
      })
      .then(({ data }) => {
        return data && data[this.loginDataKey];
      });

    if (result == null) {
      return;
    }

    const token = this.options.tokenType
      ? this.options.tokenType + ' ' + result.token
      : result.token;

    this.$auth.setToken(this.name, token);
    await this.$helpers.onLogin(result.token);

    return this.fetchUser();
  }

  async mounted() {
    const token = this.$auth.syncToken(this.name);

    // Token should have format of "prefix token_type token", so here we split the string
    // and get the token from the end.
    const tokenParts = token.split(' ');
    await this.$helpers.onLogin(tokenParts[tokenParts.length - 1]);

    return this.$auth.fetchUserOnce();
  }

  async setUserToken(tokenValue) {
    // Ensure no client side logins exist
    await this._logoutLocally();

    const token = this.options.tokenType
      ? this.options.tokenType + ' ' + tokenValue
      : tokenValue;

    this.$auth.setToken(this.name, token);
    await this.$helpers.onLogin(tokenValue);

    return this.fetchUser();
  }

  async fetchUser() {
    if (!this.$auth.getToken(this.name)) {
      return;
    }

    if (!this.userMutation) {
      this.$auth.setUser({});
      return;
    }

    const result = await this.$client
      .mutate({ mutation: this.userMutation })
      .then(({ data }) => data && data[this.fetchUserDataKey]);

    this.$auth.setUser(result);
  }

  async logout() {
    if (this.logoutMutation) {
      await this.$client
        .mutate({
          mutation: this.logoutMutation
        })
        .catch(() => {});
    }

    // Always logout locally
    return this._logoutLocally();
  }

  async _logoutLocally() {
    await this.$helpers.onLogout();

    return this.$auth.reset();
  }
}

const DEFAULTS = {
  tokenType: 'Bearer',
  tokenName: 'Authorization',
  mutations: {},
  fetchUserDataKey: 'tokenLogin',
  loginDataKey: 'login',
  clientName: 'defaultClient'
};
