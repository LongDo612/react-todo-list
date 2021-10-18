import Header from "./components/Header";
import Tasks from "./components/Tasks";
import { useState, useEffect } from "react";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  const [showAddTask, setShowAddTask] = useState(false);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTask = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    }

    getTask();
  }, [])

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks');
    const data = await res.json();

    return data;
  }

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();

    return data;
  }

  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json();

    setTasks([...tasks, data]);
    // const id = tasks.length +1;
    // const newTask = {id, ...task};
    // setTasks([...tasks, newTask]);
  }

  const deleteTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })

    res.status === 200 ? setTasks(tasks.filter((task) => task.id !== id))
    : alert('Error deleting this task');
  }

  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updateTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updateTask)
    })

    const data = await res.json();

    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, reminder: data.reminder } : task))
  }

  return (
    <Router>
      <div className="container">
        <Header 
        onAdd={() => setShowAddTask(!showAddTask)} 
        showAdd={showAddTask} />

        <Route 
        path='/' 
        exact 
        render={(props) => (
          <>
            {showAddTask && <AddTask onAdd={addTask} />}

            {tasks.length > 0 ? (
              <Tasks 
              tasks={tasks} 
              onDelete={deleteTask} 
              onToggle={toggleReminder} />
            ) : ('Hooray! Nothing else left.')}
          </>
        )} />
        <Route path='/about' component={About} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
