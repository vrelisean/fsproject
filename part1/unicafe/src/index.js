import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Display = ({text}) => (
  <div>
    <h1>{text}</h1>
  </div>
)

const Statistics = (props) => {
  if (props.total === 0)
    return <div>No feedback given</div>

  return(
    <table>
      <tbody>
        <Statistic text="good " value={props.good} />
        <Statistic text="neutral " value={props.neutral} />
        <Statistic text="bad " value={props.bad} />
        <Statistic text="all " value={props.total} />
        <Statistic text="average " value={props.average} />
        <Statistic text="positive" value={props.positive} />
      </tbody>
    </table>
  )
}

const Statistic = ({text, value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const updateGoodState = () => {
    setGood(good + 1)
    setTotal(total + 1)
  }
  const updateNeutralState = () => {
    setNeutral(neutral + 1)
    setTotal(total + 1)
  }
  const updateBadState = () => {
    setBad(bad + 1)
    setTotal(total + 1)
  }

  let average = (good/total - bad/total) || 0
  let positive = (((good/total)*100) || 0) + " %"

  return (
    <div>
      <Display text="give feedback" />
      <Button handleClick={updateGoodState} text="good" />
      <Button handleClick={updateNeutralState} text="neutral" />
      <Button handleClick={updateBadState} text="bad" />

      <Display text="statistics" />
      
      <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} positive={positive} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)