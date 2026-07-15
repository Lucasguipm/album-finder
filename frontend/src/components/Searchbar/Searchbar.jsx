import React from 'react'
import './Searchbar.css'
import { IoSearchSharp } from "react-icons/io5";
import lastfmIcon from '../../assets/lastfm-icon.png'

function Searchbar({onSearch, searchQuery, setSearchQuery}) {
  return (
    <header className="search-bar-container">
        <a href="https://www.last.fm/api" target='_blank' rel='noopener noreferrer'>
          <img src={lastfmIcon} alt="Last.fm icon" />
        </a>
        <form onSubmit={onSearch}>
            <input
                type="text"
                placeholder="Digite um artista ou banda"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit"><IoSearchSharp size={20}/></button>
        </form>
    </header>
  )
}

export default Searchbar