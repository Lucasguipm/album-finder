import React from 'react'
import './CardAlbum.css'
import lastFmLogo from '../../assets/lastfm-logo.png'
import soundWave from '../../assets/ondas-sonoras.png'

function CardAlbum({album, index}) {
  return (
     <div key={index} className="album-card">
          <img src={album.image || "https://via.placeholder.com/150"} alt={album.name} className='album-cover'/>
          <h1 className="album-name">{album.name}</h1>
          <a href={album.url} target="_blank" rel="noopener noreferrer" className="lastfm-btn">
            <img src={soundWave} alt="Sound waves" className='sound-img'/>
            <img src={lastFmLogo} alt="Last.fm logo" className='last-logo' />
          </a>
      </div>
  )
}

export default CardAlbum