interface ViewProps {}

export const View: React.FunctionComponent<ViewProps> = ({ children }) => {
	return <div style={{ padding: 36, minHeight: 360 }}>{children}</div>;
};
