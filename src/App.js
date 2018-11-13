import React, { Component } from 'react'
import uid from 'uid'
import Heading from './Heading.js'
import Counter from './Counter.js'
import Welcome from './Welcome.js'
import Input from './Input.js'
import Todo from './Todo.js'
import Separator from './Separator'

import styled from 'styled-components'

const Wrapper = styled.section`
  background-color: deeppink;
`
const List = styled.ul`
  text-align: center;
  margin: 0;
  padding: 0;
`
const TextBox = styled.div`
  display: grid;
`

class App extends Component {
  state = {
    todos: this.load()
  }

  render() {
    this.save()
    return (
      <React.Fragment>
        <Wrapper>
          <Heading />
          {this.state.todos.length > 0 ? (
            <Counter number={this.getDoneNumber()} />
          ) : null}
          <Separator text={'to-do'} />
          {this.state.todos.length > 0 ? (
            <List>{this.renderOpenTodos()}</List>
          ) : (
            <Welcome />
          )}
          <TextBox>
            <Input onEnter={this.handleKeyPress} />
          </TextBox>
          <Separator text={'done'} />
          <List>{this.renderDoneTodos()}</List>
        </Wrapper>
        <footer />
      </React.Fragment>
    )
  }

  renderOpenTodos() {
    return this.state.todos.filter(t => !t.isDone).map(this.renderSingleTodo)
  }

  renderDoneTodos() {
    return this.state.todos.filter(t => t.isDone).map(this.renderSingleTodo)
  }

  renderSingleTodo = item => (
    <Todo
      key={item.id}
      text={item.text}
      isDone={item.isDone}
      onClick={() => this.toggleDone(item.id)}
      onDelete={() => this.deleteTodo(item.id)}
    />
  )

  deleteTodo = id => {
    const { todos } = this.state
    const index = todos.findIndex(t => t.id === id)

    const updatedTodos = [...todos.slice(0, index), ...todos.slice(index + 1)]

    this.setState({
      todos: updatedTodos
    })
  }

  toggleDone = id => {
    const { todos } = this.state
    const index = todos.findIndex(t => t.id === id)
    const todo = todos[index]
    const updatedTodos = [
      ...todos.slice(0, index),
      { ...todo, isDone: !todo.isDone },
      ...todos.slice(index + 1)
    ]

    this.setState({
      todos: updatedTodos
    })
  }

  handleKeyPress = event => {
    const { todos } = this.state
    const input = event.target
    if (event.key === 'Enter') {
      const updatedTodos = [
        { text: input.value, isDone: false, id: uid() },
        ...todos
      ]

      this.setState({
        todos: updatedTodos
      })

      input.value = ''
    }
  }

  getDoneNumber() {
    return this.state.todos.filter(t => t.isDone).length
  }

  save() {
    localStorage.setItem('todo-app--todos', JSON.stringify(this.state.todos))
  }

  load() {
    try {
      return JSON.parse(localStorage.getItem('todo-app--todos')) || []
    } catch (err) {
      return []
    }
  }
}

export default App
