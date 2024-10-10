import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BiChevronRightSquare} from 'react-icons/bi'
import {withRouter, Link} from 'react-router-dom'

import Header from '../Header'
import CovidSearchBar from '../CovidSearchBar'
import IndiaStats from '../IndiaStats'
import AllStatesCases from '../AllStatesCases'
import Footer from '../Footer'
import './index.css'

const statesList = [
  {
    state_code: 'AN',
    state_name: 'Andaman and Nicobar Islands',
  },
  {
    state_code: 'AP',
    state_name: 'Andhra Pradesh',
  },
  {
    state_code: 'AR',
    state_name: 'Arunachal Pradesh',
  },
  {
    state_code: 'AS',
    state_name: 'Assam',
  },
  {
    state_code: 'BR',
    state_name: 'Bihar',
  },
  {
    state_code: 'CH',
    state_name: 'Chandigarh',
  },
  {
    state_code: 'CT',
    state_name: 'Chhattisgarh',
  },
  {
    state_code: 'DN',
    state_name: 'Dadra and Nagar Haveli and Daman and Diu',
  },
  {
    state_code: 'DL',
    state_name: 'Delhi',
  },
  {
    state_code: 'GA',
    state_name: 'Goa',
  },
  {
    state_code: 'GJ',
    state_name: 'Gujarat',
  },
  {
    state_code: 'HR',
    state_name: 'Haryana',
  },
  {
    state_code: 'HP',
    state_name: 'Himachal Pradesh',
  },
  {
    state_code: 'JK',
    state_name: 'Jammu and Kashmir',
  },
  {
    state_code: 'JH',
    state_name: 'Jharkhand',
  },
  {
    state_code: 'KA',
    state_name: 'Karnataka',
  },
  {
    state_code: 'KL',
    state_name: 'Kerala',
  },
  {
    state_code: 'LA',
    state_name: 'Ladakh',
  },
  {
    state_code: 'LD',
    state_name: 'Lakshadweep',
  },
  {
    state_code: 'MH',
    state_name: 'Maharashtra',
  },
  {
    state_code: 'MP',
    state_name: 'Madhya Pradesh',
  },
  {
    state_code: 'MN',
    state_name: 'Manipur',
  },
  {
    state_code: 'ML',
    state_name: 'Meghalaya',
  },
  {
    state_code: 'MZ',
    state_name: 'Mizoram',
  },
  {
    state_code: 'NL',
    state_name: 'Nagaland',
  },
  {
    state_code: 'OR',
    state_name: 'Odisha',
  },
  {
    state_code: 'PY',
    state_name: 'Puducherry',
  },
  {
    state_code: 'PB',
    state_name: 'Punjab',
  },
  {
    state_code: 'RJ',
    state_name: 'Rajasthan',
  },
  {
    state_code: 'SK',
    state_name: 'Sikkim',
  },
  {
    state_code: 'TN',
    state_name: 'Tamil Nadu',
  },
  {
    state_code: 'TG',
    state_name: 'Telangana',
  },
  {
    state_code: 'TR',
    state_name: 'Tripura',
  },
  {
    state_code: 'UP',
    state_name: 'Uttar Pradesh',
  },
  {
    state_code: 'UT',
    state_name: 'Uttarakhand',
  },
  {
    state_code: 'WB',
    state_name: 'West Bengal',
  },
]

class Home extends Component {
  state = {
    covidData: {},
    isLoading: true,
    searchInput: '',
    isDropdownVisible: false,
    filteredStates: [],
    selectedStateCode: '',
  }

  componentDidMount() {
    this.getHomeData()
  }

  getHomeData = async () => {
    const url = 'https://apis.ccbp.in/covid19-state-wise-data'

    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()
    this.setState({covidData: data, isLoading: false})
  }

  onChangeSearchInput = event => {
    const {value} = event.target
    this.setState({
      searchInput: value,
      isDropdownVisible: true,
      filteredStates: statesList.filter(state =>
        state.state_name.toLowerCase().includes(value.toLowerCase()),
      ),
    })
  }

  onSelectState = stateCode => {
    const selectedState = statesList.find(
      state => state.state_code === stateCode,
    )
    this.setState({
      searchInput: selectedState.state_name,
      selectedStateCode: stateCode,
      isDropdownVisible: false,
    })

    const {history} = this.props
    history.push(`/state/${stateCode}`)
  }

  handleKeyDown = event => {
    const {selectedStateCode} = this.state
    const {history} = this.props

    if (event.key === 'Enter' && selectedStateCode) {
      history.push(`/state/${selectedStateCode}`)
    }
  }

  renderDropdown = () => {
    const {filteredStates, selectedStateCode} = this.state

    return (
      <ul
        className="dropdown-list"
        data-testid="searchResultsUnorderedList"
        role="listbox"
      >
        {filteredStates.map(state => (
          <li
            key={state.state_code}
            className="dropdown-item"
            role="option"
            tabIndex="0"
            aria-selected={state.state_code === selectedStateCode}
            onKeyDown={this.handleKeyDown}
          >
            <Link
              to={`/state/${state.state_code}`}
              className="dropdown-link"
              aria-label={`Navigate to ${state.state_name}`}
              onClick={() => this.onSelectState(state.state_code)}
            >
              <div className="stateName">{state.state_name}</div>
              <div className="statecode">
                {state.state_code} <BiChevronRightSquare />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  renderHome = () => {
    const {searchInput, covidData, isDropdownVisible} = this.state

    return (
      <>
        <CovidSearchBar
          onChangeSearchInput={this.onChangeSearchInput}
          searchInput={searchInput}
          onKeyDown={this.handleKeyDown}
        />
        {isDropdownVisible && this.renderDropdown()}
        {searchInput === '' && (
          <>
            <IndiaStats covidData={covidData} statesList={statesList} />
            <AllStatesCases covidData={covidData} statesList={statesList} />
          </>
        )}
        <Footer />
      </>
    )
  }

  render() {
    const {isLoading} = this.state
    return (
      <>
        <Header />
        <main className="home-container">
          {isLoading ? (
            <div data-testid="homeRouteLoader">
              <div className="loader-container">
                <Loader
                  type="TailSpin"
                  color="#00BFFF"
                  height={50}
                  width={50}
                />
              </div>
            </div>
          ) : (
            this.renderHome()
          )}
        </main>
      </>
    )
  }
}

export default withRouter(Home)
