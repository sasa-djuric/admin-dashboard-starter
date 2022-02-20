import { Spin, SpinProps } from 'antd';

interface SpinnerProps extends SpinProps {}

const Spinner: React.FunctionComponent<SpinnerProps> = props => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				height: '100%'
			}}
		>
			<Spin {...props} />
		</div>
	);
};

export default Spinner;
