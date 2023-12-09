import Home from "./pages/Home";
import Customizer from "./pages/Customizer";
import Canavas from "./canavas";

function App() {
  return (
    <main className="app transition-all ease-in">
      <Home />
      <Customizer />
      <Canavas />
    </main>
  );
}

export default App;
