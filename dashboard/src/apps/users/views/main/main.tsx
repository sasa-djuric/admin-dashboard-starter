// Libs
import { FunctionComponent, useState } from 'react';
import { useQuery } from 'react-query-service';
import { Link, RouteComponentProps } from 'react-router-dom';

// Components
import { Button, Card, Divider, PageHeader, Row, Space, Table } from 'antd';
import Search from 'antd/lib/input/Search';
import confirm from '@components/confirm';

// Assets
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Types
import { ColumnsType } from 'antd/lib/table';

// Services
import usersService, { User } from '@startup/services/users';

// Interfaces
import { Sorting } from '@startup/services';
import { TableRow } from '../../interfaces';

// Utils
import { handleTableChangeSort, debounce } from '../../../../utils';

// Config
import settings from '../../';
import { paginationConfig } from 'src/config/pagination';

const columns = ({ onEdit, onDelete }: any): ColumnsType<TableRow> => [
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
		sorter: (a, b) => 0
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		sorter: (a, b) => 0
	},
	{
		title: 'Action',
		key: 'action',
		render(text, row, index) {
			return (
				<Space size='middle'>
					<Button icon={<EditOutlined onClick={() => onEdit(row, index)} />} />
					<Button icon={<DeleteOutlined />} danger={true} onClick={() => onDelete(row, index)} />
				</Space>
			);
		}
	}
];

const mapData = (data: Array<User>): Array<TableRow> =>
	data.map((item: User) => ({
		...item,
		key: item.id,
		status: item.isActive ? 'Active' : 'Inactive'
	}));

interface UsersMainViewProps extends RouteComponentProps<{ id?: string }> {}

const UsersMainView: FunctionComponent<UsersMainViewProps> = ({ history, match }) => {
	const id = match.params.id ? +match.params.id : undefined;
	const isMaster = typeof id !== 'number';
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [sort, setSort] = useState<Sorting>();
	const { data: users, isLoading } = useQuery(
		usersService.queries.getAllPaginated({
			id,
			search,
			offset: (page - 1) * 5,
			limit: paginationConfig.limit,
			...sort
		})
	);

	function onNew() {
		history.push(`/${settings.name}${!isMaster ? `/${id}` : ''}/new`);
	}

	function onEdit(row: TableRow, index: number) {
		history.push(`/${settings.name}/${row.id}/edit`);
	}

	function onDelete(row: TableRow, index: number) {
		confirm.delete({
			title: 'Do you want to delete this item?',
			onOk() {
				return usersService.remove(row.id);
			}
		});
	}

	function onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
		setSearch(e.target.value);
	}

	return (
		<div>
			<PageHeader
				ghost={false}
				title='Users'
				subTitle='List of users'
				extra={[
					<Button key='new' onClick={onNew}>
						Add New
					</Button>
				]}
				style={{ marginBottom: '24px' }}
				onBack={id ? () => history.goBack() : undefined}
			/>

			<Card>
				<Row align='middle'>
					<Search
						style={{ display: 'flex', width: '250px', marginLeft: 'auto' }}
						placeholder='Search'
						onChange={debounce(onSearchChange, 500)}
					/>
				</Row>
				<Divider />
				<Table
					columns={columns({ onEdit, onDelete })}
					dataSource={users?.data ? mapData(users.data) : []}
					style={{ overflowX: 'auto' }}
					loading={isLoading}
					pagination={{
						defaultPageSize: 5,
						total: users?.metadata?.total,
						current: page,
						onChange: setPage
					}}
					onChange={handleTableChangeSort(setSort)}
				/>
			</Card>
		</div>
	);
};

export default UsersMainView;
