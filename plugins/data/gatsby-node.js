/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
// You can delete this file if you're not using it

/**
 * You can uncomment the following line to verify that
 * your plugin is being loaded in your site.
 *
 * See: https://www.gatsbyjs.org/docs/creating-a-local-plugin/#developing-a-local-plugin-that-is-outside-your-project
 */
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)
const fetch = require('node-fetch')
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type HNPost implements Node {
      title: String
      creater: CreaterPost @link(by: "name")
      commentsLen: Float
      score: Float
      linkForAticle: String
      imgHN: File @link
    }
    type CreaterPost implements Node {
      name: String
      karma: Float
      lenPosts: Float
      about: String
      url: String
      created: Float
    }`)
}
exports.onPreInit = () => console.log("Loaded gatsby-starter-plugin")
exports.sourceNodes = async ({actions: {createNode}, createContentDigest, createNodeId, getCache}) => {
  const postsId = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
    .then((data) => data.json());
  const allPosts = [];
  const allUsers = [];
  const allPromisePosts = [];
  await (() => {
    return new Promise((res,req) => {
      for (let t=0; t<postsId.length && t<20; t++) {
        allPromisePosts.push(fetch(`https://hacker-news.firebaseio.com/v0/item/${postsId[t]}.json?print=pretty`)
          .then(data => data.json())
          .then(post => new Promise((reS, req) => {
            fetch(`https://hacker-news.firebaseio.com/v0/user/${post.by}.json?print=pretty`)
              .then(userData => userData.json())
              .then(user => {
                allPosts.push(post);
                allUsers.push(user);
                reS()
              })
          }))
          .catch(err => {
          /*console.log(err);*/
        }))
      }
      Promise.all(allPromisePosts).then(() => res())
    })
  })();
  /*
  {
    by: 'bbx',
    descendants: 56,
    id: 23203347,
    kids: [
      23204385, 23204628, 23204394,
      23204128, 23204345, 23205993,
      23207779, 23204163, 23205269,
      23204487, 23206430, 23204038,
      23205794, 23205083, 23205716,
      23204392, 23204305, 23204956,
      23204801, 23204365, 23204136,
      23204404, 23204991, 23204961,
      23206519, 23204885, 23206494,
      23206089, 23205113, 23205109
    ],
    score: 118,
    time: 1589637009,
    title: 'Show HN: Hacker News Dark Mode',
    type: 'story',
    url: 'https://jgthms.com/hacker-news-dark-mode/'
  }
  */
  //console.log(allPosts, 'all posts');
  allPosts.forEach(post => {
    console.log(post.by);
    createNode({
      id: createNodeId(`HNPost-${post.id}`),
      title: post.title,
      creater: post.by,
      commentsLen: +post.descendants,
      score: post.score,
      linkForAticle: post.url,
      internal: {
        type: 'HNPost',
        contentDigest: createContentDigest(post)
      }
    })
  });
  allUsers.forEach(user => {
    console.log(user.id);
    createNode({
      id: createNodeId(`HNCreater-${user.id}`),
      name: user.id,
      karma: user.karma,
      lenPosts: user.submitted.length,
      about: user.about,
      url: `user/${user.id}`,
      created: +user.created,
      internal: {
        type: 'CreaterPost',
        contentDigest: createContentDigest(user)
      }
    })
  })
  //console.log(allPosts,allUsers)
}
exports.onCreateNode = async ({node, createNodeId, actions: { createNode }, getCache}) => {
  if (node.internal.type === 'HNPost') {
    const fileNode = await createRemoteFileNode({
      url: 'https://media.rbcdn.ru/media/news/hackernews_A01O2t7.png',
      parentNodeId: '1',
      createNode,
      createNodeId,
      getCache,
    });
    if (fileNode) {
      node.imgHN = fileNode.id;
    }
  };
}