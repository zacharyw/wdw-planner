import gql from 'graphql-tag';

const routerBase =
  process.env.DEPLOY_ENV === 'GH_PAGES'
    ? {
        router: {
          base: '/wdw-planner/'
        }
      }
    : {};

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
    '@nuxtjs/apollo',
    'nuxt-clipboard2',
    'nuxt-feature-toggle'
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
        httpEndpoint: process.env.HTTP_ENDPOINT || 'http://rails:8080/graphql',
        browserHttpEndpoint:
          process.env.BROWSER_HTTP_ENDPOINT || 'http://localhost:8080/graphql'
      }
    }
  },
  featureToggle: {
    toggles: {
      'guides-menu': false
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
  },
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },
  ...routerBase
};
