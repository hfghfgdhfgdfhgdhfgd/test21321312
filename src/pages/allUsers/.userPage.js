import React from 'react'
import {graphql, Link} from 'gatsby'
import {navigate} from '@reach/router'
import styled from 'styled-components'

const Block = styled.div`
  display: flex;
`

export default function user({data: {createrPost}}) {
  return (
    <div>
      <Block>
        <span>
          name: {createrPost.name}
        </span>
      </Block>
      {
        createrPost.about &&
        <Block>
          <div>
            about:
          </div>
          <div dangerouslySetInnerHTML={{__html: createrPost.about}}></div>
        </Block>
      }
      <Block>
        <span>
          karma: {createrPost.karma}
        </span>
      </Block>
      <Block>
        <span>
          lenPosts: {createrPost.lenPosts}
        </span>
      </Block>
      <br/>
      <div>
        <Link to="/allUsers">
          <button>
            all user
          </button>
        </Link>
      </div>
      <br/>
      <div>
        <button onClick={() => navigate(-1)}>
          back page
        </button>
      </div>
    </div>
  )
}
export const query = graphql`
  query($url: String) {
    createrPost(url: {eq: $url}) {
      about
      karma
      lenPosts
      name
    }
  }
`