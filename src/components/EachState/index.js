import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import Header from '../Header'
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
const cardColors = {
  confirmed: '#ff073a',
  active: '#007bff',
  recovered: '#28a745',
  deceased: '#6c757d',
}

const EachState = () => {
  const {stateCode} = useParams()
  const [stateData, setStateData] = useState({})
  const [topDistricts, setTopDistricts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [activeCard, setActiveCard] = useState('confirmed')
  const [timelineData, setTimelineData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          'https://apis.ccbp.in/covid19-state-wise-data',
        )
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        const stateSpecificData = data[stateCode]

        if (stateSpecificData) {
          const {total, districts, meta} = stateSpecificData

          const activeCases =
            total.confirmed - (total.recovered + total.deceased)

          const sortedDistricts = Object.entries(districts)
            .map(([name, districtData]) => ({
              name,
              ...districtData.total,
            }))
            .sort((a, b) => b.confirmed - a.confirmed)

          setStateData({
            confirmed: total.confirmed,
            active: activeCases,
            recovered: total.recovered,
            deceased: total.deceased,
            tested: total.tested,
            lastUpdated: meta.last_updated,
          })
          setTopDistricts(sortedDistricts)
        } else {
          setErrorMessage('State data not available')
        }
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [stateCode])

  useEffect(() => {
    const fetchTimelineData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `https://apis.ccbp.in/covid19-timelines-data/${stateCode}`,
        )
        if (!response.ok) {
          throw new Error('Failed to fetch timeline data')
        }
        const data = await response.json()
        const stateTimelineData = data[stateCode].dates
        const formattedData = Object.keys(stateTimelineData).map(date => ({
          date,
          confirmed: stateTimelineData[date].total.confirmed || 0,
          active:
            (stateTimelineData[date].total.confirmed || 0) -
            ((stateTimelineData[date].total.recovered || 0) +
              (stateTimelineData[date].total.deceased || 0)),
          recovered: stateTimelineData[date].total.recovered || 0,
          deceased: stateTimelineData[date].total.deceased || 0,
        }))
        setTimelineData(formattedData)
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTimelineData()
  }, [stateCode])

  const handleCardClick = cardType => {
    setActiveCard(cardType)
  }

  if (isLoading) {
    return (
      <div className="loader-container" data-testid="timelinesDataLoader">
        <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
      </div>
    )
  }

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>
  }

  const state = statesList.find(eachState => eachState.state_code === stateCode)

  return (
    <>
      <Header />
      <div className="each-state-container">
        <div className="state-details">
          <div className="state-name">
            <h1 className="stateName">{state.state_name}</h1>
            <p>
              Last Updated on{' '}
              {new Date(stateData.lastUpdated).toLocaleDateString()}
            </p>
          </div>
          <div className="tested">
            <p>Tested</p>
            <p>{stateData.tested}</p>
          </div>
        </div>

        <div className="stats-container">
          <button
            type="button"
            className={`card confirmed ${
              activeCard === 'confirmed' ? 'active-card' : ''
            }`}
            onClick={() => handleCardClick('confirmed')}
          >
            <p className="stats-type confirmed-cases">Confirmed</p>
            <img
              src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1654438432/Covid19%20Dashboard/check-mark_1_odg0vn.png"
              alt="state specific confirmed cases pic"
            />
            <p className="confirmed-cases cases">{stateData.confirmed}</p>
          </button>

          <button
            type="button"
            className={`card active ${
              activeCard === 'active' ? 'active-card' : ''
            }`}
            onClick={() => handleCardClick('active')}
          >
            <p className="stats-type active-cases">Active</p>
            <img
              src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1654438417/Covid19%20Dashboard/protection_1_zjqmhw.png"
              alt="state specific active cases pic"
            />
            <p className="active-cases cases">{stateData.active}</p>
          </button>

          <button
            type="button"
            className={`card recovered ${
              activeCard === 'recovered' ? 'active-card' : ''
            }`}
            onClick={() => handleCardClick('recovered')}
          >
            <p className="stats-type recovered-cases">Recovered</p>
            <img
              src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1654438418/Covid19%20Dashboard/recovered_1_qmgv0f.png"
              alt="state specific recovered cases pic"
            />
            <p className="recovered-cases cases">{stateData.recovered}</p>
          </button>

          <button
            type="button"
            className={`card deceased ${
              activeCard === 'deceased' ? 'active-card' : ''
            }`}
            onClick={() => handleCardClick('deceased')}
          >
            <p className="stats-type deceased-cases">Deceased</p>
            <img
              src="https://res.cloudinary.com/dvmp5vgbm/image/upload/v1654438420/Covid19%20Dashboard/breathing_1_ctu4mw.png"
              alt="state specific deceased cases pic"
            />
            <p className="deceased-cases cases">{stateData.deceased}</p>
          </button>
        </div>

        <div>
          <h1 className={`top-districts-heading ${activeCard}`}>
            Top Districts
          </h1>
          <ul className="district-list">
            {topDistricts.map(district => (
              <li key={district.name}>
                <p className="count">{district[activeCard]}</p>
                <p className="district-name"> {district.name}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Bar Chart for state-specific data */}
        <div className="chart-container" data-testid="barChartsContainer">
          <ResponsiveContainer width="60%" height={300}>
            <BarChart data={timelineData.slice(-10)}>
              {' '}
              {/* Slicing the last 10 entries */}
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={activeCard} fill={cardColors[activeCard]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h1>Spread trends</h1>

        {/* Line Charts for state-specific data */}
        <div className="chart-container" data-testid="lineChartsContainer">
          {['confirmed', 'active', 'recovered', 'deceased'].map(cardType => (
            <div key={cardType} style={{marginBottom: '20px'}}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={cardType}
                    stroke={cardColors[cardType]}
                    activeDot={{r: 8}}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default EachState
