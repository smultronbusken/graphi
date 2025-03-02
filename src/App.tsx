import Footer from './ui/components/footer/Footer';
import Header from './ui/components/header/Header';
import Canvas from './ui/Canvas';
import Overlay from './ui/Overlay';

function App() {
  return (
    <>
      <Header />
      <div id="app-container">
        <Canvas />
        <Overlay />
      </div>
      <Footer />
    </>
  );
}

export default App;
