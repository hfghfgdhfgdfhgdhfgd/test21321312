import React from 'react'
import { Helmet } from 'react-helmet'

export default function Seo(props) {
  return (
    <Helmet title={props.title}
      htmlAttributes={{
        lang: props.lang || 'en'
      }}
      meta={[{
        name: 'description',
        content: props.description || 'test page'
      }]}
    />
  )
}
