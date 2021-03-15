// Components
import { Card, Col, Row, Statistic } from 'antd';

const DashboardView = () => {
	return (
		<div className='dashboard'>
			<Row gutter={[16, 16]}>
				<Col span={12}>
					<Card>
						<Statistic title='Total schools' value={8} />
					</Card>
				</Col>
				<Col span={12}>
					<Card>
						<Statistic title='Total programs' value={16} />
					</Card>
				</Col>
				<Col span={12}>
					<Card>
						<Statistic title='Total institutions' value={32} />
					</Card>
				</Col>
				<Col span={12}>
					<Card>
						<Statistic title='Total subscriptions' value={64} />
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default DashboardView;
