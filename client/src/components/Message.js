import React from 'react'

const Message = ({ msg }) => {
  return (
    <div
      className='alert alert-warning alert-dismissible fade show'
      role='alert'>
      {msg}
      <button
        type='button'
        className='btn-close'
        aria-label='Close'
        data-bs-dismiss='alert'>
      </button>
    </div>
  )
}

export default Message;