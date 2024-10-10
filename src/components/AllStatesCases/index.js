import {useState, useEffect} from 'react'
import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'

import IndianState from '../IndianState'
import './index.css'

const AllStatesCases = props => {
  const {covidData, statesList} = props
  const [statesData, setStatesData] = useState([])

  useEffect(() => {
    const initialStatesData = statesList.map(eachState => {
      const stateData = covidData[eachState.state_code] || {}
      const totalData = stateData.total || {}
      const meta = stateData.meta || {}

      const confirmedCases = parseInt(totalData.confirmed) || 0
      const recoveredCases = parseInt(totalData.recovered) || 0
      const deceasedCases = parseInt(totalData.deceased) || 0

      const activeCases = confirmedCases - (recoveredCases + deceasedCases)

      return {
        stateName: eachState.state_name,
        stateCode: eachState.state_code,
        confirmed: confirmedCases !== 0 ? confirmedCases : 'NA',
        recovered: recoveredCases !== 0 ? recoveredCases : 'NA',
        deceased: deceasedCases !== 0 ? deceasedCases : 'NA',
        active: activeCases !== 0 ? activeCases : 'NA',
        population: meta.population || 'NA',
      }
    })

    setStatesData(initialStatesData)
  }, [covidData, statesList])

  const onClickSortingAsc = () => {
    const sortedData = [...statesData].sort((a, b) =>
      a.stateName.toUpperCase() > b.stateName.toUpperCase() ? 1 : -1,
    )
    setStatesData(sortedData)
  }

  const onClickSortingDesc = () => {
    const sortedData = [...statesData].sort((a, b) =>
      a.stateName.toUpperCase() < b.stateName.toUpperCase() ? 1 : -1,
    )
    setStatesData(sortedData)
  }

  return (
    <div className="stats-table" data-testid="stateWiseCovidDataTable">
      <div className="table-header">
        <div className="states-name-column">
          <p className="table-header-title">States/UT</p>
          <div className="icons-container">
            <button
              type="button"
              className="sorting-icon"
              onClick={onClickSortingAsc}
              data-testid="ascendingSort"
              aria-label="Sort ascending"
            >
              <FcGenericSortingAsc size="20" />
            </button>
            <button
              type="button"
              className="sorting-icon"
              onClick={onClickSortingDesc}
              data-testid="descendingSort"
              aria-label="Sort descending"
            >
              <FcGenericSortingDesc size="20" />
            </button>
          </div>
        </div>
        <div className="table-column">
          <p className="table-header-title">Confirmed</p>
        </div>
        <div className="table-column">
          <p className="table-header-title">Active</p>{' '}
        </div>
        <div className="table-column">
          <p className="table-header-title">Recovered</p>
        </div>
        <div className="table-column">
          <p className="table-header-title">Deceased</p>
        </div>
        <div className="table-column">
          <p className="table-header-title">Population</p>
        </div>
      </div>
      <hr className="line" />
      <ul className="state-stats-container">
        {statesData.map(state => (
          <IndianState key={state.stateCode} state={state} />
        ))}
      </ul>
    </div>
  )
}

export default AllStatesCases
