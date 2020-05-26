import React, {useState, useEffect} from 'react'
import Seo from '../../components/Seo';
import Post from '../post/.post';
import styled from 'styled-components';

const PostContiner = styled.div`
  margin-bottom: 10px;
`

const formatPostObj = (post) => {
  return {
    id: post.id,
    title: post.title,
    creater: {
      name: post.by
    },
    commentsLen: +post.descendants || '0',
    score: post.score,
    linkForAticle: post.url,
  }
}

const requestOfPosts = (lenPosts, allRequest, bigInterval, 
                        continerFunc, setGetIndex, setAllPost,
                        setIsLoading, allPost) => {
  let lenRequest = 0;
  let ForIsOff = false;
  const For = setInterval(() => {
    fetch(`https://hacker-news.firebaseio.com/v0/item/${continerFunc.t}.json?print=pretty`)
        .then(data => data.json())
        .then(post => {
          if (post && post.type === 'story' && !post.deleted && !ForIsOff ) {
            continerFunc.newPosts.push(formatPostObj(post));
            console.log(continerFunc);
            if(lenPosts === continerFunc.newPosts.length) {
              setGetIndex(continerFunc.t);
              setAllPost([...allPost,...continerFunc.newPosts]);
              ForIsOff = true;
              setIsLoading(false);
              clearInterval(bigInterval);
              clearInterval(For);
            }
          }
        })
    if (lenRequest === allRequest) {
      clearInterval(For)
    }
    lenRequest++;
    continerFunc.t--;
  })
}

const usePost = (_maxIndex, lenPosts=10) => {
  const [maxIndex, setMaxIndex] = useState('&&&&&&');
  const [getIndex, setGetIndex] = useState(_maxIndex);
  const [isLoading, setIsLoading] = useState(false);
  const [allPost, setAllPost] = useState([]);
  const getPosts = (itemInfo) => {
    console.log(getIndex, 'GETINDEX');
    setIsLoading(true);
    const continerFunc = {
      t: getIndex || itemInfo,
      newPosts: []
    }
    const bigInterval = setInterval(() => {
      requestOfPosts(15, 100, bigInterval, continerFunc, setGetIndex, setAllPost, setIsLoading, allPost)
      if (continerFunc.t===0) {
        clearInterval(bigInterval);
      }
    }, 4000)
    requestOfPosts(15, 100, bigInterval, continerFunc, setGetIndex, setAllPost, setIsLoading, allPost)
  }
  const updatePosts = (lastMaxIndex,newMaxIndex) => {
    return new Promise((res,rej) => {
      const allFetchInfo = [];
      const allNewPost = [];
      for (let t=newMaxIndex; t>lastMaxIndex; t--) {
        allFetchInfo.push(fetch(`https://hacker-news.firebaseio.com/v0/item/${newMaxIndex}.json?print=pretty`)
                            .then(data => data.json())
                            .then(post => {
                              if (post && !post.deleted && post.type === 'story') {
                                allNewPost.push(formatPostObj(post))
                              }
                            }))
      }
      Promise.all(allFetchInfo).then(() => {
        console.log(allNewPost);
        setAllPost(allPost => [...allNewPost, ...allPost]);
        res()})
    })
  }
  return [allPost, maxIndex,isLoading, getPosts, updatePosts, setGetIndex, setMaxIndex];
}

export default function () {
  const [allPost, maxItem, isLoading, getPosts, updatePosts, _setGetIndex, setMaxItem] = usePost(null, 10)
  
  useEffect(() => {
    const updateMaxItem = () => {
      return fetch('https://hacker-news.firebaseio.com/v0/maxitem.json?print=pretty')
      .then(data => data.json())
      .then(newItemInfo => {
        setMaxItem(lastItemInfo => {
          if (newItemInfo > lastItemInfo && lastItemInfo !== '&&&&&&') {
            updatePosts(lastItemInfo,newItemInfo);
          }
          return newItemInfo;
        });
        return newItemInfo;
      });
    }

    updateMaxItem().then(itemInfo => {
      _setGetIndex(itemInfo);
      getPosts(itemInfo);
    });
    setInterval(() => {
      updateMaxItem();  
    }, 10000)
  }, []);
  


  return (
    <div>
      <Seo title="live stories"/>
      <center>
        <h2>
          {maxItem} - items site
        </h2>
      </center>
      {
        allPost.map(post => {
          return (<PostContiner key={post.id}>
            <Post post={post}/>
          </PostContiner>)
        })
      }
      <center>
        <button disabled={isLoading} onClick={() => getPosts()}>
          get posts
        </button>
      </center>
    </div>
  )
}
