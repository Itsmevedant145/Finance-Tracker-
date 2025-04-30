import React from 'react'
import './CharAvatar.css'; // Make sure the path is correct

export const CharAvatar = ({ fullname }) => {
  return (
    <div className="avatar-container">
        <div className="avatar">
            {fullname
            .split(" ")
            .map((name) => name.charAt(0).toUpperCase())
            .join("")}
        </div>
        <h5 className="username">{fullname}</h5>
      
    </div>
  )
}

export default CharAvatar
