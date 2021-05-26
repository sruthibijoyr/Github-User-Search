import './App.css';
import {useState, useEffect} from 'react';
import { FaGithubAlt, FaSearch } from "react-icons/fa";
import { getSearchUsersURL, getUserReposURL} from './api';
function App() {
  const [text,setText] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);
  const [repodata,setRepoData]=useState([])
  const [showRepo,setShowRepo]=useState()

  async function changeRepoVisibility(idx){
        const values=[...showRepo];
        values[idx]=true;
        const url=await getUserReposURL(foundUsers[idx].login);
        console.log(url)
        fetch(url)
        .then((response)=>response.json())
        .then((data)=>{
           console.log(data)
           const values=[...repodata];
           values[idx]=data;
           setRepoData(values);
        })
        setShowRepo(values);
    }

  useEffect(()=>{
    if(text==='') return
    const url=getSearchUsersURL(text);
    fetch(url)
      .then(res => res.json())
      .then(
        data => {
          if(data.message)
          {
            console.log(data.message);
          }
          else{
            if(data.items){
              data.items = data.items.slice(0,5);
              setFoundUsers(data.items)
              setShowRepo(Array(data.items.length).fill(false));
              console.log(data);
            }
          }

        }
      );
  },[text]);

  useEffect(() => {
        setRepoData([]);
    },[text]);

  const Repositories=({id})=>{
        return(
            <ul>
                {repodata[id]?
                repodata[id].map((repo,idx)=>{
                    var k = id+idx;
                    return(
                        <li key={k} className="repo-data" >{repo.name}</li>
                    )
                })
            :null
            }
            </ul>
        )
    }

  return (
    <div className="App">
      <header className="App-header">
        <h1><FaGithubAlt className="App-logo" />Github User Search</h1>
        <form>
            <FaSearch className="search" />
            <input className="input" placeholder="Enter username" type="text" id="name" value={text} onChange={(event)=>setText(event.target.value)}/>
            <button className="clear-btn" onClick={()=>{setText("")}}>CLEAR</button>
        </form>
      </header>
      <section className="users">
        {
          foundUsers?
          <table className="user-table">
            <tbody>
              {
                foundUsers.map((user,idx)=>{
                  return(
                    <tr key={idx}>
                      <td>
                      <div className="card">
                        <img src={user.avatar_url} alt="Avatar" style={{width:"100%"}} onClick={()=>changeRepoVisibility(idx)}></img>
                        <div className="container">
                          <a href={user.html_url}> {user.login}</a>
                          <Repositories id={idx} />
                        </div>
                      </div>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          :null
        }
      </section>
    </div>
  );
}

export default App;
