import {Provider, useSelector} from 'react-redux'
import './App.css';
import Header from "./components/Header";
import ListTasks from "./components/ListTasks";
import WelcomePage from "./components/WelcomePage";

function App() {
    const user = useSelector((state) => state.user)
  return (
    <>
      <Header/>
        {user._id === null ? <WelcomePage/> : <ListTasks/>}
    </>
  );
}

export default App;
