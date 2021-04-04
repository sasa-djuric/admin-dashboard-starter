import { TablePaginationConfig } from 'antd';
import { SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface';
import { Sorting } from '@app/services';

export const handleTableChangeSort = <TableRow>(
  callback: (data: Sorting) => void
) => <Row = any>(
  pagination: TablePaginationConfig,
  filter: Record<string, (string | number | boolean)[] | null>,
  sorter: SorterResult<TableRow> | SorterResult<TableRow>[],
  extra: TableCurrentDataSource<Row>
) => {
  if (!Array.isArray(sorter)) {
    callback({
      orderBy: sorter.field?.toString() ?? '',
      order: sorter.order === 'ascend' ? 'asc' : 'desc',
    });
  }
};
