import React from 'react'
import { graphql } from 'gatsby'
import { MDXProvider } from '@mdx-js/react'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import styled from 'styled-components'

const Post = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const P = styled.p`
  width: 100%;
`

export default function test({data: {mdx}}) {
  return (
    <Post>
      <h1>{mdx.frontmatter.title}</h1>
      <MDXProvider components={{p: P}}>
        <MDXRenderer {...mdx.frontmatter}>
          {mdx.body}
        </MDXRenderer>
      </MDXProvider>
    </Post>
  )
}

export const query = graphql`
  query($slug: String!) {
    mdx(fields: {slug: {eq: $slug}}) {
      id
      body
      frontmatter {
        title
      }
    }
  }
`
