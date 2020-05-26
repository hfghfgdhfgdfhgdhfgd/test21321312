import React from 'react'
import {graphql, Link} from 'gatsby'

export default function UserPage({data: {allCreaterPost: {edges}}}) {
  return (
    <div>
      {edges.map(({node: {karma, name}}) => (
        <div>
          <div>
            <Link to={`user/${name}`}>
              name: {name}
            </Link>
          </div>
          <div>
            karma: {karma}
          </div>
          <br/>
        </div>
      ))}
    </div>
  )
}
export const query = graphql`
  query {
    allCreaterPost {
      edges {
        node {
          karma
          name
        }
      }
    }
  }
`