import React from 'react';

const Spinner = () => {
  return (
    <div>
      <img
        src='/images/spinner.gif'
        style={{
          display: 'block',
          width: '200px',
          margin: '0 auto',
        }}
        alt='Loading'
      />
    </div>
  )
}

export default Spinner;
