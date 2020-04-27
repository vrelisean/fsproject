import React from 'react';

const Header = ({title}) => <h1>{title}</h1>

const Content = (props) => {
  const { parts } = props

  return (
    <div>
      {parts.map(part => <Part id={part.id} name={part.name} exercises={part.exercises} key={part.id} />)}
    </div>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>    
  )
}

const Total = (props) => {
  const { parts } = props
  let total = parts.reduce((sum, part) => (sum + part.exercises), 0)
  
  return(
      <p><b>total of {total} exercises</b></p>
  ) 
}

const Course = ({course}) => {
  return(
    <div>
      <Header title={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course