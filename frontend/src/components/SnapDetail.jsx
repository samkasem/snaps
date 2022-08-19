import React, { useEffect, useState } from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import { AiOutlineSend } from 'react-icons/ai'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { client, urlfor } from '../client'
import MasonryLayout from './MasonryLayout'
import { snapDetailMoreSnapQuery, snapDetailQuery } from '../utils/data'
import Spinner from './Spinner'

const SnapDetail = ({ user }) => {
  const { snapId } = useParams()
  const [snaps, setSnaps] = useState()
  const [snapDetail, setSnapDetail] = useState()
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)

  const fetchSnapDetails = () => {
    const query = snapDetailQuery(snapId)

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setSnapDetail(data[0])
        console.log(data)
        if (data[0]) {
          const query1 = snapDetailMoreSnapQuery(data[0])
          client.fetch(query1).then((res) => {
            setSnaps(res)
          })
        }
      })
    }
  }

  useEffect(() => {
    fetchSnapDetails()
  }, [snapId])

  const addComment = () => {
    if (comment) {
      setAddingComment(true)

      client
        .patch(snapId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: 'postedBy', _ref: user._id },
          },
        ])
        .commit()
        .then(() => {
          fetchSnapDetails()
          setComment('')
          setAddingComment(false)
        })
    }
  }

  if (!snapDetail) {
    return <Spinner message='Showing snap' />
  }

  return (
    <>
      {snapDetail && (
        <div
          className='flex xl:flex-row flex-col m-auto bg-white'
          style={{ maxWidth: '1500px', borderRadius: '32px' }}
        >
          <div className='flex justify-center items-center md:items-start flex-initial'>
            <img
              className='rounded-t-3xl rounded-b-lg'
              src={snapDetail?.image && urlfor(snapDetail?.image).url()}
              alt='user-post'
            />
          </div>
          <div className='w-full p-5 flex-1 xl:min-w-620'>
            <div className='flex items-center justify-between'>
              <div className='flex gap-2 items-center'>
                <a
                  href={`${snapDetail.image.asset.url}?dl=`}
                  download
                  className='bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100'
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              <a
                className='bg-secondaryColor p-2 text-md rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100'
                href={snapDetail.destination}
                target='_blank'
                rel='noreferrer'
              >
                <FaExternalLinkAlt />
              </a>
            </div>
            <div>
              <h1 className='text-4xl font-bold break-words mt-3'>
                {snapDetail.title}
              </h1>
              <p className='mt-3'>{snapDetail.about}</p>
            </div>
            <Link
              to={`/user-profile/${snapDetail?.postedBy._id}`}
              className='flex gap-2 mt-5 items-center bg-white rounded-lg '
            >
              <img
                src={snapDetail?.postedBy.image}
                className='w-10 h-10 rounded-full'
                alt='user-profile'
              />
              <p className='font-bold'>{snapDetail?.postedBy.userName}</p>
            </Link>
            <h2 className='mt-5 text-2xl'>Comments</h2>
            <div className='max-h-370 overflow-y-auto'>
              {snapDetail?.comments?.map((item) => (
                <div
                  className='flex gap-2 mt-5 items-center bg-white rounded-lg'
                  key={item.comment}
                >
                  <img
                    src={item.postedBy?.image}
                    className='w-10 h-10 rounded-full cursor-pointer'
                    alt='user-profile'
                  />
                  <div className='flex flex-col'>
                    <p className='font-bold'>{item.postedBy?.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex flex-wrap mt-6 gap-3'>
              <Link to={`/user-profile/${user._id}`}>
                <img
                  src={user.image}
                  className='w-10 h-10 rounded-full cursor-pointer'
                  alt='user-profile'
                />
              </Link>
              <input
                className=' flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                type='text'
                placeholder='Add a comment'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type='button'
                className='bg-yellow-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
                onClick={addComment}
              >
                {addingComment ? 'Adding...' : <AiOutlineSend />}
              </button>
            </div>
          </div>
        </div>
      )}
      {snaps?.length > 0 && (
        <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
          More like this
        </h2>
      )}
      {snaps ? (
        <MasonryLayout snaps={snaps} />
      ) : (
        <Spinner message='Loading more snaps' />
      )}
    </>
  )
}

export default SnapDetail
