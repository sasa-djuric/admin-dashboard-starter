// Libs
import { FunctionComponent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import { Button, Card, Divider, PageHeader, Row, Space, Table } from 'antd';
import Search from 'antd/lib/input/Search';
import Protected from '../../../../components/protected/protected';
import confirm from '../../../../components/confirm';

// Assets
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Types
import { ColumnsType } from 'antd/lib/table';

// Services
import usersService, { User, useUsersPaginated } from '@app/services/users';

// Interfaces
import { Sorting } from '@app/services';
import { TableRow } from '../../interfaces';

// Enums
import { UsersPermissions } from '@app/services/users/enums';

// Utils
import { handleTableChangeSort, debounce } from '../../../../utils';

// Config
import { paginationConfig } from '../../../../config/pagination';

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
					<Protected permissions={[UsersPermissions.Update]}>
						<Button icon={<EditOutlined onClick={() => onEdit(row, index)} />} />
					</Protected>
					<Protected permissions={[UsersPermissions.Delete]}>
						<Button
							icon={<DeleteOutlined />}
							danger={true}
							onClick={() => onDelete(row, index)}
						/>
					</Protected>
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

interface UsersMainViewProps {}

const UsersMainView: FunctionComponent<UsersMainViewProps> = () => {
	const navigate = useNavigate();
	const params = useParams();
	const id = params.id ? +params.id : undefined;
	const isMaster = typeof id !== 'number';
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [sort, setSort] = useState<Sorting>();
	const { users, isLoading } = useUsersPaginated({
		id,
		search,
		offset: (page - 1) * 5,
		limit: paginationConfig.limit,
		...sort
	});

	function onNew() {
		navigate(`/users${!isMaster ? `/${id}` : ''}/new`);
	}

	function onEdit(row: TableRow, index: number) {
		navigate(`/users/${row.id}/edit`);
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
					<Protected permissions={[UsersPermissions.Create]}>
						<Button key='new' onClick={onNew}>
							Add New
						</Button>
					</Protected>
				]}
				style={{ marginBottom: '24px' }}
				onBack={id ? () => navigate(-1) : undefined}
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
