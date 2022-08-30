import { Divider, Layout } from 'antd';
import './App.scss';
import DensityWordChecker from './components/DensityWordChecker/DensityWordChecker';
import HtmlAnalysis from './components/HtmlAnalysis/HtmlAnalysis';

const { Header, Content } = Layout;

function App() {
  return (
    <div className='App'>
      <Layout className='app-layout'>
        <Header>Header</Header>
        <Content>
          <DensityWordChecker />
          <Divider />
          <HtmlAnalysis />
        </Content>
      </Layout>
    </div>
  );
}

export default App;
