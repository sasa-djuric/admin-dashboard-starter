import { Modal, ModalFuncProps } from 'antd';

import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

function _delete(args: ModalFuncProps) {
	confirm({
		title: 'Do you want to delete this item?',
		icon: <ExclamationCircleOutlined />,
		okType: 'danger',
		okText: 'Yes',
		...args
	});
}

export default {
	delete: _delete
};
