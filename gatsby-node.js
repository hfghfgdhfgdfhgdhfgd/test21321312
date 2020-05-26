const { createFilePath } = require('gatsby-source-filesystem');
const path = require('path');

exports.onCreateNode = ({actions, node, getNode}) => {
  const {createNodeField} = actions;
  if (node.internal.type === 'Mdx') {
    const path = createFilePath({node, getNode});
    createNodeField({
      name: 'slug',
      value: `/mdx${path}`,
      node,
    })
  }
}
exports.createPages = async ({actions, node, getNode, graphql}) => {
  const {createPage} = actions;
  const {data} = await graphql(`
    query {
      allMdx {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
      allCreaterPost {
        edges {
          node {
            url
          }
        }
      }
      allHnPost {
        edges {
          node {
            id
            title
            score
            commentsLen
            linkForAticle
            creater {
              name
            }
          }
        }
      }
    }
  `)
  data.allMdx.edges.forEach(({ node: { fields: { slug } } }) => {
    createPage({
      path: slug,
      component: path.resolve('./src/components/Test.js'),
      context: { 
        slug
      }
      //////////////
      //path: slug,
      //component: path.resolve(`./src/components/Test.js`),
      //context: {
      //  slug: slug,
      //},
    })
  })
  data.allCreaterPost.edges.forEach(({node: {url}}) => {
    console.log(url);
    createPage({
      path: url,
      component: path.resolve('./src/pages/allUsers/.userPage.js'),
      context: {
        url
      }
    })
  })
  //data.allHnPost.edges.forEach(({node}) => {
  //  createPage
  //})
  for (let t=0; t<data.allHnPost.edges.length; t+=10) {
    console.log(t,(t+10 < data.allCreaterPost.edges.length) ?
    t+10 : data.allCreaterPost.edges.lenght, 'test');
    createPage({
      path: `/${((t/10^0) ? (t/10^0)+1 : '')}`,
      component: path.resolve('./src/pages/.index.js'),
      context: {
        data: data.allHnPost.edges.slice(t, ((t+10 < data.allCreaterPost.edges.length) ?
                                                    t+10 : data.allCreaterPost.edges.length
        )),
        allPagesIndexs: data.allCreaterPost.edges.length/10^0,
      }
    })
  }
}
