import React from 'react'
import './RightPanel.css'
import CardAlbum from '../CardAlbum/CardAlbum'

function RightPanel({dataAlbums}) {
  return (
    <>
        <h1>Álbuns</h1>
        <div className="albums-grid">
          {/* Faz o loop (.map) para criar cada Card de Álbum dinamicamente */}
          {dataAlbums.map((album, index) => (
            <CardAlbum 
                album={album}
                index={index}
            />
            ))}
        </div>
    </>
  )
}

export default RightPanel