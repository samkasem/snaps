import React from 'react'
import Masonry from 'react-masonry-css'
import Snap from './Snap'

const breakpointColumnsObj = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
}

const MasonryLayout = ({ snaps }) => (
  <Masonry
    className='flex animate-slide-fwd'
    breakpointCols={breakpointColumnsObj}
  >
    {snaps?.map((snap) => (
      <Snap key={snap._id} snap={snap} className='w-max' />
    ))}
  </Masonry>
)

export default MasonryLayout
