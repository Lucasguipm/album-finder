import React from 'react'
import './LeftPanel.css'
import noImage from '../../assets/no-image.jpg'

function LeftPanel({artistImage, artistName, artistBio}) {
  return (
    <>
        <div className="artist-image-container">
            {/* Se o scraping achar uma imagem, mostra. Se não, exibe o nome */}
            {artistImage ? (
                <img src={artistImage} alt={artistName} />
            ) : (
                <div className="no-image"><img src={noImage}/></div>
            )}
        </div>

        <div className="artist-bio-container">
            <h1>Biografia</h1>
            <hr />
            <p>{artistBio}</p>
        </div>
    </>
  )
}

export default LeftPanel