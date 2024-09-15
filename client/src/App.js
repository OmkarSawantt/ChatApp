import './App.css';
import { Outlet } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <main>
        <Outlet/>
      </main>
      <Toaster position="bottom-center" reverseOrder={false}/>
    </>
  );
}

export default App;
