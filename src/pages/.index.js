import React from "react"
import styled from 'styled-components';
import Seo from "../components/Seo";
import { Link } from 'gatsby';
import Post from './post/.post.js';

const Header = styled.header`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  text-align: center;
  margin-bottom: 25px;
  & > h1 {
    margin-bottom: 0;
  }
  & > h6 {
    margin-top: 0px;
    margin-bottom: 15px;
  }
`
const ButtonsBlock = styled.div`
  margin: 0 auto;
  & > a + a {
    margin-left: 15px;
  }
`
const AllPost = styled.div`
  text-align: center;
`


export default ({pageContext: {data, allPagesIndexs}, ...lastProps}) => {
  console.log(data, 'data', lastProps);
  const searchNumUrl = lastProps.path.match(/\d+?$/);
  const indexPage =  searchNumUrl ? +searchNumUrl[0] : 0;
  return (
    <div>
      <Header>
        <Seo title="HN Posts"/>
        <h1>Top stories</h1>
        <h6>
          <Link to="/liveStories">
            > live stories
          </Link>
        </h6>
      </Header>
      
      <AllPost>
        {data.map(({node}) => <Post post={node} key={node.id}/>)}
        <ButtonsBlock>
          {
            (indexPage > 0) && 
            <Link to={`/${(indexPage-1 !== 1) ? indexPage-1 : ''}`}>
              <button>
                last
              </button>
            </Link>
          }
          {
            (indexPage < allPagesIndexs-1) &&
            <Link to={`/${(indexPage === 0) ? 2 : indexPage+1}`}>
              <button>
                next
              </button> 
            </Link>
          }
        </ButtonsBlock>
      </AllPost>
    </div>
  )
}


/*export const query = graphql`
  query {
    allHnPost {
      edges {
        node {
          id
          title
          linkForAticle
          score
          creater {
            name
          }
          commentsLen
        }
      }
    }
  }
`*/