import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './DensityWordCheckerTable.scss';

interface DensityWordCheckerTableProps {
  data: any;
}

interface DataType {
  key: string;
  keyword: string;
  density: number;
  frequency: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Keyword',
    dataIndex: 'keyword',
  },
  {
    title: 'Density',
    dataIndex: 'density',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.density - b.density,
    render: (v) => {
      return `${v.toFixed(2)}%`;
    },
  },
  {
    title: 'Frequency',
    dataIndex: 'frequency',
    sorter: (a, b) => a.frequency - b.frequency,
  },
];

const DensityWordCheckerTable = ({ data }: DensityWordCheckerTableProps) => {
  return (
    <div className='density-word-checker-table'>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default DensityWordCheckerTable;
