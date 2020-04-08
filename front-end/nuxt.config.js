import gql from 'graphql-tag';

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.12.0/css/all.css'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    ['nuxt-buefy', { materialDesignIcons: false, defaultIconPack: 'fas' }],
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/eslint-module',
    '@nuxtjs/auth',
    '@nuxtjs/proxy',
    '@nuxtjs/apollo'
  ],
  auth: {
    redirect: {
      logout: '/login'
    },
    strategies: {
      apollo: {
        _scheme: '~/apollo_strategy.js',
        mutations: {
          login: gql`
            mutation($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                token
              }
            }
          `,
          logout: gql`
            mutation {
              logout {
                result
              }
            }
          `,
          user: gql`
            mutation tokenLogin {
              tokenLogin {
                id
                email
                token
              }
            }
          `
        }
      }
    }
  },
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'http://rails:8080/graphql',
        browserHttpEndpoint: 'http://localhost:8080/graphql'
      }
    }
  },
  router: {
    middleware: ['auth']
  },
  watchers: {
    webpack: {
      poll: true
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: 'http://rails:8080/',
    browserBaseURL: 'http://localhost:8080/'
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
