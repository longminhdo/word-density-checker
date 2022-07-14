import { Layout } from 'antd';
import './App.scss';
import DensityWordChecker from './components/DensityWordChecker/DensityWordChecker';

const { Header, Content } = Layout;

function App() {
  return (
    <div className='App'>
      <Layout className='app-layout'>
        <Header>Header</Header>
        <Content>
          <DensityWordChecker />
        </Content>
      </Layout>
    </div>
  );
}

export default App;
