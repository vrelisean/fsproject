import React, { useState, useEffect } from 'react'
import personsServices from './services/persons'

const Filter = ({value, eventHandler}) => (
  <div>
    filter shown with <input
      value={value}
      onChange={eventHandler} />
  </div>
)

const PersonForm = (props) => (
  <form onSubmit={props.submitEvent}>
    <div>
      name: <input
        value={props.nameValue}
        onChange={props.nameEvent}/>
    </div>
    <div>
      number: <input
        value={props.numberValue}
        onChange={props.numberEvent}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({personsToShow, deletePerson}) => (
  <>
  {personsToShow.map(person =>
    <div key={person.name}>
      {person.name} {person.number}
      <button onClick={() => {
        if (window.confirm(`Delete ${person.name}?`))
          return deletePerson(person)
      }}>
        delete
      </button>
    </div>)}
  </>
)

const ShowNotification = ({notification}) => {
  if (notification.message===null) {
    return null
  }
  
  return (
    <div className={notification.type}>
      {notification.message}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newPhoneNumber, setNewPhoneNumber ] = useState('')
  const [ filterValue, setFilterValue ] = useState('')
  const [ personsToShow, setPersonsToShow ] = useState(persons)
  const [ notification, setNotification ] = useState({
    message: null,
    type: null
  })

  useEffect(() => {
    loadAllPersons()
  }, [])
  
  const loadAllPersons = () => {
    personsServices
      .getAll()
      .then(returnedPersons => {
        setPersons(returnedPersons)
        setPersonsToShow(returnedPersons)
      })
  }
  
  const displayNotification = (message, type) => {
    setNotification({
      message: message,
      type: type
    })
    setTimeout(() => {
      setNotification({
        message: null,
        type: null
      })
    }, 5000)
  }

  const addPerson = (e) => {
    e.preventDefault()

    const duplicates = persons.filter(person => person.name === newName)
    const personObject = {
      name: newName,
      number: newPhoneNumber
    }
    const updateDisplay = (newArray) => {
      setPersons(newArray)
      setPersonsToShow(newArray)
      setFilterValue('')
      setNewName('')
      setNewPhoneNumber('')
    }

    if (duplicates.length !== 0){
      if (window.confirm(`${personObject.name} is already added to phonebook, replace the old number with a new one?`)){
        personsServices
          .updatePerson(duplicates[0].id, personObject)
          .then(returnedPerson => {
            updateDisplay(persons.map(p => p.id !== duplicates[0].id ? p : returnedPerson))
            displayNotification(`Changed number for ${returnedPerson.name} from ${duplicates[0].number} to ${returnedPerson.number}`, 'success')
          })
          .catch(error => {
            displayNotification(`Information of ${personObject.name} has already been removed from the server`, 'error')
            loadAllPersons()
          })    
      }
    }
    else {
      personsServices
        .createPerson(personObject)
        .then(returnedPerson => {
          updateDisplay(persons.concat(returnedPerson))
          displayNotification(`Added ${returnedPerson.name}`, 'success')
        })
      }
  }

  const deletePerson = (person) => {
    personsServices
      .deletePerson(person.id)
      .then(returnedPerson => {
        const updatedPersons = persons.filter(n => n.id !== person.id)
        setPersons(updatedPersons)
        setPersonsToShow(updatedPersons)
      })
      .catch(error => {
        displayNotification(`Information of ${person.name} has already been removed from the server`, 'error')
        loadAllPersons()
      })
  }

  const newNameEvent = (e) => setNewName(e.target.value)
  const newPhoneNumberEvent = (e) => setNewPhoneNumber(e.target.value)

  const filterPersons = (e) => {
    setPersonsToShow(persons.filter(person => person.name
      .toLowerCase()
      .includes(e.target.value.toLowerCase()))
    )
    return setFilterValue(e.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <ShowNotification notification={notification} />
        <Filter value={filterValue} eventHandler={filterPersons} />
      <h3>Add a new</h3>
        <PersonForm
          nameValue={newName} 
          nameEvent={newNameEvent} 
          numberValue={newPhoneNumber} 
          numberEvent={newPhoneNumberEvent} 
          submitEvent={addPerson}
        />
      <h3>Numbers</h3>
        <Persons
          personsToShow={personsToShow}
          deletePerson={deletePerson}
        />
    </div>
  )
}

export default App