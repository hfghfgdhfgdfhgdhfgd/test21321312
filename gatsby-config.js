/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, (process.env.NODE_ENV === 'production') ? 
    '.env.production'
    :
    '.env.development'
  )
})

module.exports = {
  /* Your site config here */
  siteMetadata: {
    siteUrl: process.env.GATSBY_SITE_URL,
  },
  plugins: [
    `gatsby-plugin-sharp`,
    `gatsby-remark-images`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1035,
              linkImagesToOriginal: false,
              withWebp: true
            },
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages'
      }
    },
    `babel-plugin-styled-components`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: process.env.GATSBY_SITE_URL,
        sitemap: `${process.env.GATSBY_SITE_URL}/sitemap.xml`,
        policy: [{
          userAgent: '*',
          allow: '/'
        }]
      }
    }, {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `GatsbyJSStarterPWA`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#6b37bf`,
        theme_color: `#6b37bf`,
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: `standalone`,
        icon: `src/images/icon.png`, // This path is relative to the root of the site.
      },
    }, {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'mdx',
        path: './md'
      }
    },
    require.resolve('./plugins/data'),
    `gatsby-plugin-offline`,
  ],
}
