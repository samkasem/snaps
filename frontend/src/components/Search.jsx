import React, { useEffect, useState } from 'react'

import MasonryLayout from './MasonryLayout'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import Spinner from './Spinner'

const Search = ({ searchTerm }) => {
  const [snaps, setSnaps] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchTerm !== '') {
      setLoading(true)
      const query = searchQuery(searchTerm.toLowerCase())
      client.fetch(query).then((data) => {
        setSnaps(data)
        setLoading(false)
      })
    } else {
      client.fetch(feedQuery).then((data) => {
        setSnaps(data)
        setLoading(false)
      })
    }
  }, [searchTerm])

  return (
    <div>
      {loading && <Spinner message='Searching Snaps' />}
      {snaps?.length !== 0 && <MasonryLayout snaps={snaps} />}
      {snaps?.length === 0 && searchTerm !== '' && !loading && (
        <div className='mt-10 text-center text-xl '>No Snap Found!</div>
      )}
    </div>
  )
}

export default Search
