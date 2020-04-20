import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Display = ({text}) => <div><h1>{text}</h1></div>
const Content = ({text}) => <div>{text}</div>
const Button = ({eventHandler, text}) => <button onClick={eventHandler}>{text}</button>

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [votecount, setVoteCount] = useState(new Uint8Array(6))
  const [mostvoted, setMostVoted] = useState(0)

  let votesOnSelected = "has " + votecount[selected] + " votes"
  let maxVotes = Math.max(...votecount)
  let votesOnBest = "has " + maxVotes + " votes"

  /* the reason for this array is due to 'votecount' array
    not being replaced by 'arrayCopy' (func castVoteEvent)
    before the function updateBestVoteCount executes */
  let arrHelper = votecount

  const voteEventHandler = () => {
    castVoteEvent()
    updateBestVoteCount()
  }

  const castVoteEvent = () => {
    const arrayCopy = [...votecount]
    arrayCopy[selected] += 1
    arrHelper = arrayCopy
    return setVoteCount(arrayCopy)
  }

  const updateBestVoteCount = () => {
    let index = mostvoted
    for (let i=0;i<arrHelper.length;i++){
      if ((maxVotes === 0 && arrHelper[i] > 0) || (maxVotes !== 0 && arrHelper[i] > maxVotes)){
        index = i
        break
      }
    }
    return setMostVoted(index)
  }

  const randomAnecdoteEvent = () => setSelected(Math.round(Math.random()*5))
  
  return (
    <div>
      <Display text="Anecdote of the day" />
      <Content text={props.anecdotes[selected]} />
      <Content text={votesOnSelected} />
      <Button eventHandler={voteEventHandler} text="vote" />
      <Button eventHandler={randomAnecdoteEvent} text="next anecdote" />

      <Display text="Anecdote with most votes" />
      <Content text={props.anecdotes[mostvoted]} />
      <Content text={votesOnBest} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)