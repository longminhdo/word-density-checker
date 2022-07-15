import { Button, Form, Input, InputNumber } from 'antd';
import { useState } from 'react';
import DensityWordCheckerTable from '../DensityWordCheckerTable/DensityWordCheckerTable';
import './DensityWordChecker.scss';

const { Item } = Form;

interface DensityWordCheckerProps {}

interface DataType {
  key: any;
  keyword: any;
  frequency: any;
  density: number;
}

const DensityWordChecker = (props: DensityWordCheckerProps) => {
  const [result, setResult] = useState<DataType[]>();

  const onFinish = (values: any) => {
    const numberOfWordPhrases = values.numberWordPhrases;
    const termFrequencyMap = new Map();
    const processedInput = values.input
      .trim()
      .replace(/[\r|\n|,|.|-|\u2026]/gm, '');
    const data: DataType[] = [];
    const processedArray = processedInput.split(' ');
    let documentArray = [];
    if (numberOfWordPhrases === 1) {
      documentArray = processedArray.filter(
        (el: any) => el.trim() !== '' && el.length > 1
      );
    } else {
      documentArray = processedArray.filter((el: any) => el.trim() !== '');
    }
    const totalOccurrenceTerm = documentArray.length - numberOfWordPhrases + 1;

    console.log(documentArray);
    for (let i = 0; i < totalOccurrenceTerm; i++) {
      var term = '';
      for (let j = i; j < i + numberOfWordPhrases; j++) {
        term = `${term} ${documentArray[j]}`;
      }

      let finalTerm = term.trim();

      if (termFrequencyMap.get(finalTerm)) {
        termFrequencyMap.set(finalTerm, termFrequencyMap.get(finalTerm) + 1);
      } else {
        termFrequencyMap.set(finalTerm, 1);
      }
    }

    termFrequencyMap.forEach((value, key) => {
      data.push({
        key: key,
        keyword: key,
        frequency: value,
        density: (value * 100) / totalOccurrenceTerm,
      });
    });

    setResult(data);
  };

  return (
    <div className='density-word-checker'>
      <Form
        style={{ width: '100%' }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout={'vertical'}
        onFinish={onFinish}
      >
        <Item label='Input' name={'input'} required>
          <Input.TextArea autoSize />
        </Item>
        <Item
          label='Number of word phrases'
          style={{ width: '100%' }}
          name={'numberWordPhrases'}
          required
        >
          <InputNumber />
        </Item>

        <Item>
          <Button type='primary' htmlType='submit'>
            Check
          </Button>
        </Item>
      </Form>

      {result ? <DensityWordCheckerTable data={result} /> : null}
    </div>
  );
};

export default DensityWordChecker;
