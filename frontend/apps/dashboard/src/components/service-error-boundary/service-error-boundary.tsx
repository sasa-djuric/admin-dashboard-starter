import { Button, Result } from 'antd';
import { Component } from 'react';
import { QueryErrorResetBoundary } from 'react-query-service';

interface ErrorBoundaryProps {}

interface ErrorBoundaryState {
	error: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state = {
		error: null
	};

	static getDerivedStateFromError(error: any) {
		return { error: true };
	}

	componentDidCatch(error: any, errorInfo: any) {}

	onReset() {
		this.setState(state => ({
			...state,
			error: null
		}));
	}

	render() {
		return (
			<QueryErrorResetBoundary>
				{({ reset }: any) =>
					this.state.error ? (
						<Result
							status='error'
							title='Submission Failed'
							subTitle='Please check and modify the following information before resubmitting.'
							extra={[
								<Button
									key='error-boundary-reset'
									onClick={() => {
										reset();
										this.onReset();
									}}
								>
									Try Again
								</Button>
							]}
						/>
					) : (
						this.props.children
					)
				}
			</QueryErrorResetBoundary>
		);
	}
}

export default ErrorBoundary;
