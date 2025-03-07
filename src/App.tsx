import Footer from './ui/components/footer/Footer';
import Header from './ui/components/header/Header';
import Canvas from './ui/Canvas';
import Overlay from './ui/Overlay';
import { Box } from '@radix-ui/themes';
import { NodeAttributes } from './ui/components/node/NodeAttributes';

function App() {



  return (
    <>
      <Header />
      <div id="app-container">
        <Canvas />
        <Overlay />
        <Box
          asChild
          style={{
            position: "fixed",
            flexShrink: 0,
            display: "var(--quick-nav-display)",
            top: "var(--header-height)",
            width: 250,
            zIndex: 1,
            right: 0,
            bottom: 0,
          }}
        >
          <aside>
            <Box
              asChild
              px="5"
              aria-labelledby="site-quick-nav-heading"
              style={{
                paddingBlock: 68,
              }}
            >
              <NodeAttributes />
            </Box>
          </aside>
        </Box>
      </div>
      <Footer />
    </>
  );
}

export default App;
