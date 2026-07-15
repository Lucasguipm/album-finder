import React from 'react'
import './WelcomeScreen.css'
import lastFm from '../../assets/lastfm-logo.png'

function WelcomeScreen() {
  return (
    <div className="welcome-screen">
        <h1>Busque os álbuns do seu artista favorito!</h1>
        <a href="https://www.last.fm/music/Heart" target='_blank' rel='noopener noreferrer'>
            <img src={lastFm} alt="API owner logo, Last.fm" />  
        </a>
    </div>
  )
}

export default WelcomeScreen