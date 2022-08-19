import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar, Feed, SnapDetail, CreateSnap, Search } from '../components'

const Snaps = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <div className='px-2 md:px-5'>
      <div className='bg-gray-50'>
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user && user}
        />
      </div>
      <div className='h-full'>
        <Routes>
          <Route path='/' element={<Feed />} />
          <Route path='/category/:categoryId' element={<Feed />} />
          <Route
            path='/snap-detail/:snapId'
            element={<SnapDetail user={user && user} />}
          />
          <Route
            path='/create-snap'
            element={<CreateSnap user={user && user} />}
          />
          <Route
            path='/search'
            element={
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            }
          />
        </Routes>
      </div>
    </div>
  )
}

export default Snaps
