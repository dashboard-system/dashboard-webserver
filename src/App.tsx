import './App.css'
import SideBar from './components/sidebar/SideBar'
import TopPane from './components/toppane/TopPane'
import ResponsiveDrawer from './demo'
import MainContent from './pages/MainContent'

function App() {
  return (
    <>
      {/* <ResponsiveDrawer /> */}
      <SideBar />
      <TopPane />
      <MainContent />
    </>
  )
}

export default App
