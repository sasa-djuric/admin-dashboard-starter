import { Spin, SpinProps } from 'antd';

interface SpinnerProps extends SpinProps {}

const Spinner: React.FunctionComponent<SpinnerProps> = props => {
	return (
		<div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Spin {...props} />
		</div>
	);
};

export default Spinner;
