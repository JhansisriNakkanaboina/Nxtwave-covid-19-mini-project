import {BsSearch} from 'react-icons/bs'
import './index.css'

const CovidSearchBar = props => {
  const {onChangeSearchInput, searchInput, onKeyDown} = props

  const onChangeSearch = event => {
    onChangeSearchInput(event)
  }

  return (
    <div className="search-input-container">
      <BsSearch className="search-icon" />
      <input
        type="search"
        placeholder="Search the state"
        value={searchInput}
        onChange={onChangeSearch}
        onKeyDown={onKeyDown} // Attach the onKeyDown handler to input
        className="search-input"
      />
    </div>
  )
}

export default CovidSearchBar
