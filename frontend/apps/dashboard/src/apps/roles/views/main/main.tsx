// Libs
import { FunctionComponent, useState } from 'react';
import { useQuery } from 'react-query-service';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import { Button, Card, Divider, Modal, PageHeader, Row, Select, Space, Table } from 'antd';
import Search from 'antd/lib/input/Search';
import Protected from '../../../../components/protected/protected';
import confirm from '../../../../components/confirm';

// Assets
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

// Types
import { ColumnsType } from 'antd/lib/table';

// Services
import rolesService, { Role } from '@app/services/roles';
import usersService from '@app/services/users';

// Interfaces
import { ID } from '@app/services';
import { TableRow } from '../../interfaces';

// Enums
import { RolesPermissions } from '@app/services/roles/enums';

// Utils
import { debounce } from '../../../../utils';

// Config
import settings from '../../';

// Hooks
import useAuth from '../../../authentication/hooks/use-auth';

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
					<Protected permissions={[RolesPermissions.Update]}>
						<Button icon={<EditOutlined onClick={() => onEdit(row, index)} />} />
					</Protected>
					<Protected permissions={[RolesPermissions.Delete]}>
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

interface MapDataOptions {
	search: string;
}

const mapData = (data: Array<Role>, options?: MapDataOptions): Array<TableRow> => {
	const mapped: Array<TableRow> = data.map((item: Role) => ({
		...item,
		key: item.id,
		status: item.isActive ? 'Active' : 'Inactive'
	}));

	if (options?.search) {
		return mapped.filter(item => new RegExp(options.search, 'gi').test(item.name));
	}

	return mapped;
};

interface RolesMainViewProps {}

const RolesMainView: FunctionComponent<RolesMainViewProps> = () => {
	const navigate = useNavigate();
	const params = useParams();
	const id = params.id ? +params.id : undefined;
	const isMaster = typeof id !== 'number';
	const [search, setSearch] = useState('');
	const { authState, refreshToken } = useAuth();
	const { data: roles, isLoading } = useQuery(rolesService.queries.getAll());

	function onNew() {
		navigate(`/${settings.name}${!isMaster ? `/${id}` : ''}/new`);
	}

	function onEdit(row: TableRow, index: number) {
		navigate(`/${settings.name}/${row.id}/edit`);
	}

	function onDeleteConflict(id: ID) {
		let replacement: ID;

		Modal.confirm({
			title: 'Role that you want to delete is used by some users. Please select replacement.',
			content: (
				<Select
					style={{ width: '100%' }}
					options={roles
						?.filter(role => role.id !== id)
						.map(role => ({ label: role.name, value: role.id }))}
					onChange={value => (replacement = value as ID)}
				/>
			),
			onOk() {
				if (!replacement) {
					return Promise.reject();
				}

				return usersService
					.swithRole({ id, roleId: replacement })
					.then(() => {
						return rolesService.remove(id);
					})
					.then(() => {
						if (id === authState.user?.roleId) {
							return refreshToken();
						}
					});
			}
		});
	}

	function onDelete(row: TableRow, index: number) {
		confirm.delete({
			title: 'Do you want to delete this item?',
			onOk() {
				return rolesService.remove(row.id).catch(err => {
					if (err.statusCode === 409) {
						return onDeleteConflict(row.id);
					}
				});
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
				title='Roles'
				subTitle='List of roles'
				extra={[
					<Protected permissions={[RolesPermissions.Create]}>
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
						style={{
							display: 'flex',
							width: '250px',
							marginLeft: 'auto'
						}}
						placeholder='Search'
						onChange={debounce(onSearchChange, 300)}
					/>
				</Row>
				<Divider />
				<Table
					columns={columns({ onEdit, onDelete })}
					dataSource={roles ? mapData(roles, { search }) : []}
					style={{ overflowX: 'auto' }}
					loading={isLoading}
				/>
			</Card>
		</div>
	);
};

export default RolesMainView;
