// Components
import { Card, Col, Divider, Row, Statistic } from 'antd';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';

const data = [
	{
		name: 'Page A',
		uv: 4000,
		pv: 2400,
		amt: 2400
	},
	{
		name: 'Page B',
		uv: 3000,
		pv: 1398,
		amt: 2210
	},
	{
		name: 'Page C',
		uv: 5000,
		pv: 9800,
		amt: 2290
	},
	{
		name: 'Page D',
		uv: 2780,
		pv: 3908,
		amt: 2000
	},
	{
		name: 'Page E',
		uv: 1890,
		pv: 4800,
		amt: 2181
	},
	{
		name: 'Page F',
		uv: 7390,
		pv: 3800,
		amt: 2500
	},
	{
		name: 'Page G',
		uv: 3490,
		pv: 4300,
		amt: 2100
	},
	{
		name: 'Page H',
		uv: 2490,
		pv: 8300,
		amt: 2100
	},
	{
		name: 'Page I',
		uv: 6490,
		pv: 5300,
		amt: 2100
	},
	{
		name: 'Page J',
		uv: 3490,
		pv: 3300,
		amt: 2100
	},
	{
		name: 'Page K',
		uv: 2490,
		pv: 6300,
		amt: 2100
	},
	{
		name: 'Page I',
		uv: 6490,
		pv: 4300,
		amt: 2100
	}
];

const DashboardView = () => {
	return (
		<div className='dashboard'>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} md={8} lg={8} xl={6}>
					<Card>
						<Statistic title='Total Sales' value={'126,560'} />
						<ResponsiveContainer width='100%' height={40}>
							<AreaChart
								width={200}
								height={60}
								data={data}
								margin={{
									top: 5,
									right: 0,
									left: 0,
									bottom: 5
								}}
							>
								<Area
									type='monotone'
									dataKey='uv'
									stroke='#975FE4'
									fill='#975FE4'
								/>
							</AreaChart>
						</ResponsiveContainer>
						<Divider style={{ margin: '9px 0px' }} />
						<span>Daily sales 12,423</span>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={8} lg={8} xl={6}>
					<Card>
						<Statistic title='Visits' value={'8,846'} />
						<ResponsiveContainer width='100%' height={40}>
							<BarChart width={150} height={40} data={data}>
								<Bar dataKey='uv' fill='#3AA0FF' />
							</BarChart>
						</ResponsiveContainer>
						<Divider style={{ margin: '9px 0px' }} />
						<span>Daily visits 1,234</span>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={8} lg={8} xl={6}>
					<Card>
						<Statistic title='Payments' value={'6,560'} />
						<ResponsiveContainer width='100%' height={40}>
							<LineChart width={300} height={100} data={data}>
								<Line
									type='monotone'
									dataKey='pv'
									stroke='#37ed00'
									strokeWidth={2}
								/>
							</LineChart>
						</ResponsiveContainer>
						<Divider style={{ margin: '9px 0px' }} />
						<span>Conversion Rate 60%</span>
					</Card>
				</Col>
				<Col xs={24} sm={12} md={8} lg={8} xl={6}>
					<Card>
						<Statistic title='Operational Effect' value={'78%'} />
						<div style={{ width: '100%', height: '40px', padding: '16px 0px' }}>
							<div
								style={{ width: '78%', height: '100%', background: '#13C2C2' }}
							></div>
						</div>
						<Divider style={{ margin: '9px 0px' }} />
						<span>WoW Change 12%</span>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default DashboardView;
