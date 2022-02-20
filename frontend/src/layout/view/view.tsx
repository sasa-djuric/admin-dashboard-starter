interface ViewProps {}

export const View: React.FunctionComponent<ViewProps> = ({ children }) => {
	return <div style={{ padding: 36, width: '100%', height: '100%' }}>{children}</div>;
};
