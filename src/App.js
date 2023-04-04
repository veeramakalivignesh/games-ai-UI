import Cannon from "./modules/cannon/Cannon"
import Header from "./core/Header";

export default function App() {
  return (
    <>
      <Header />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '40px'
      }}>
        <Cannon />
      </div>
    </>
  );
}
