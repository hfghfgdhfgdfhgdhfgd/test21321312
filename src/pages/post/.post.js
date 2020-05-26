import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column-reverse;
`
const Post = styled.div`
  text-align: center;
  &+div {
    margin-top: 10px;
  }
`
export default function ({post}) {
  return (
    <div>
      <Post>
        <a href={post.linkForAticle}>{post.title}</a>
        <div>
          by: {` `}
          <Link to={`/user/${post.creater.name}`}>
              {post.creater.name} 
          </Link>
        </div>
        <InfoBlock>
          <div>
            score: {post.score}
          </div>
          <div>
            comments {post.commentsLen}
          </div>
        </InfoBlock>
      </Post>
    </div>
  )
}
