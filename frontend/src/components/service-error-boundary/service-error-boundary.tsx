import { Button, Result } from 'antd';
import { Component } from 'react';
import { QueryErrorResetBoundary } from 'react-query';

interface ErrorBoundaryProps {}

interface ErrorBoundaryState {
	error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state = {
		error: null
	};

	static getDerivedStateFromError(error: Error) {
		return { error: true };
	}

	componentDidCatch(error: Error, errorInfo: unknown) {
		console.log(error);
	}

	onReset() {
		this.setState(state => ({
			...state,
			error: null
		}));
	}

	render() {
		return (
			<QueryErrorResetBoundary>
				{({ reset }) =>
					this.state.error ? (
						<Result
							status='error'
							title='Error Happen'
							subTitle='Please try again.'
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
