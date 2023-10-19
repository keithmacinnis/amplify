import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { withAuthenticator, Button, Heading, View, TextField, Text } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsconfig from './aws-exports';
Amplify.configure(awsconfig);



function App({ signOut, user }) {
  const initialState = { name: '', description: '' }
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  const [count, setCount] = useState(0)

  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <View style={styles.container}>
  <Heading level={1}>Hello {user.username}</Heading>
  <Button style={styles.button}onClick={signOut}>Sign out</Button>
  <Heading level={2}>Amplify Todos</Heading>
  <TextField
    placeholder="Name"
    onChange={event => setInput('name', event.target.value)}
    style={styles.input}
    defaultValue={formState.name}
  />
  <TextField
    placeholder="Description"
    onChange={event => setInput('description', event.target.value)}
    style={styles.input}
    defaultValue={formState.description}
  />
  <Button style={styles.button} onClick={addTodo}>Create Todo</Button>
  {
    todos.map((todo, index) => (
      <View key={todo.id ? todo.id : index} style={styles.todo}>
        <Text style={styles.todoName}>{todo.name}</Text>
        <Text style={styles.todoDescription}>{todo.description}</Text>
      </View>
    ))
  }
</View>
    </>
  )
}


const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  todoDescription: { marginBottom: 0 },
  button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default withAuthenticator(App)
