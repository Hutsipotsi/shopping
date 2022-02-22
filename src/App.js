import './App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';

const URL = 'http://localhost/phpharjoituksia/shopping/';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskD, setTaskD] = useState('');
  const [taskA, setTaskA] = useState('');
  const [editTaskD, setEditTaskD] = useState(null);
  const [editTaskA, setEditTaskA] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');

  useEffect(() => {
    axios.get(URL)
    .then((response) => {
      setTasks(response.data)
    }).catch(error => {
      alert(error.response ? error.response.data.error : error);
    })
  }, [])

  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({description:taskD,amount:taskA})
    axios.post(URL + 'add.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      setTasks(tasks => [...tasks,response.data]);
      setTaskD('');
      setTaskA('');
    }).catch (error => {
      alert(error.response.data.error)
    });
  }  

  function remove(id) {
    const json = JSON.stringify({id:id})
    axios.post(URL + 'delete.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      const newListWithoutRemoved = tasks.filter((item) => item.id !== id);
      setTasks(newListWithoutRemoved);
    }).catch (error => {
      alert(error.response ? error.response.data.error : error);
    });
  }
  
  function setEditedTasks(taskD,taskA) {
    setEditTaskD(taskD);
    setEditTaskA(taskA);
    setEditDescription(taskD?.description);
    setEditAmount(taskA?.amount);
  }

  
  function update(e) {
    e.preventDefault();
    const json = JSON.stringify({id:editTaskD.id,description:editDescription,amount:editAmount})
    axios.post(URL + 'update.php',json,{
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      tasks[(tasks.findIndex(taskD => taskD.id === editTaskD.id))].description = editDescription;
      setTasks([...tasks]);
      setEditedTasks(null);
     // setEditedTaskA(null)
    }).catch (error => {
      alert(error.response ? error.response.data.error : error);
    });
  }


  return (
    <div className="container">
      <h3>Shopping list</h3>
      <form onSubmit={save}>
        <label>New item</label>&nbsp;
        <input placeholder="type description" value={taskD} onChange={e => setTaskD(e.target.value)} />&nbsp;
        <input placeholder="type amount" value={taskA} onChange={e => setTaskA(e.target.value)} />&nbsp;
        <button>Add</button>
      </form>
      <ol>
        {tasks?.map(taskD => (
          <li key={taskD.id}>
            {editTaskD?.id !== taskD.id && 
            taskD.description
            }&nbsp;{taskD.amount} 
            {editTaskD?.id === taskD.id &&
            <form onSubmit={update}>
              <input value={editDescription} onChange={e => setEditDescription(e.target. value)}/>&nbsp;
              <input value={editAmount} onChange={e => setEditAmount(e.target.value)}/>&nbsp;
              <button>Save</button>&nbsp;
              <button type="button" onClick={() => setEditedTasks(null)}> Cancel</button>
              </form>
            }
          &nbsp;<a className="delete" onClick={() => remove(taskD.id)} href="#">
            Delete
            </a>&nbsp;
            {editTaskD === null &&
            <a className="edit" onClick={() => setEditedTasks(taskD,taskA)} href="#">
              Edit
            </a>
            }
          </li>
        ))}
        </ol>
    </div>
  );

}

export default App;
