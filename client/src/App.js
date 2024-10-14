import './App.css';
import { Outlet } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import { SocketProvider } from './redux/SocketContext';
function App() {
  return (
    <SocketProvider>
      <main>
        <Outlet/>
      </main>
      <Toaster position="bottom-center" reverseOrder={false}/>
    </SocketProvider>
  );
}

export default App;
