import { CSSProperties, useState } from 'react';
import { SketchPicker, ColorResult, HSLColor, RGBColor } from 'react-color';

interface ColorPickerProps {
	name?: string;
	value?: string | null;
	unit?: 'hex' | 'hsl' | 'rgb';
	onChange: (event: { target: { name?: string; value: string | HSLColor | RGBColor } }) => void;
	onClose?: () => void;
}

const ColorPicker: React.FunctionComponent<ColorPickerProps> = ({
	name,
	value,
	unit = 'hex',
	onChange: onChangeProps,
	onClose: onCloseProps
}) => {
	const [isShown, setIsShown] = useState(false);
	const [color, setColor] = useState(value);

	const styles: Record<any, CSSProperties> = {
		color: {
			width: '36px',
			height: '14px',
			borderRadius: '2px',
			background: color!
		},
		swatch: {
			padding: '5px',
			background: '#fff',
			borderRadius: '1px',
			boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
			display: 'inline-block',
			cursor: 'pointer'
		},
		popover: {
			position: 'absolute',
			zIndex: 2
		},
		cover: {
			position: 'fixed',
			top: '0px',
			right: '0px',
			bottom: '0px',
			left: '0px'
		}
	};

	function onChange(color: ColorResult) {
		setColor(color.hex);
	}

	function onChangeEnd(color: ColorResult) {
		if (onChangeProps) {
			onChangeProps({ target: { name, value: color[unit] } });
		}
	}

	function onClick() {
		setIsShown(true);
	}

	function onClose() {
		if (onCloseProps) {
			onCloseProps();
		}

		setIsShown(false);
	}

	return (
		<div>
			<div style={styles.swatch} onClick={onClick}>
				<div style={styles.color} />
			</div>
			{isShown ? (
				<div style={styles.popover}>
					<div style={styles.cover} onClick={onClose} />
					<SketchPicker
						color={color!}
						onChange={onChange}
						onChangeComplete={onChangeEnd}
					/>
				</div>
			) : null}
		</div>
	);
};

export default ColorPicker;
