import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { memo, useEffect, useState } from 'react';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';

interface ImageInputProps {
	image?: string | File | null;
	onChange: (image: RcFile) => void;
}

function getBase64(img: File | Blob | undefined, callback: (image: string) => void) {
	const reader = new FileReader();
	// @ts-ignore
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img!);
}

function validate(file: RcFile) {
	const isJpgOrPng =
		file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml';
	const isLt2M = file.size / 1024 / 1024 < 2;

	if (!isJpgOrPng) {
		message.error('You can only upload JPG/PNG/SVG file!');
	}

	if (!isLt2M) {
		message.error('Image must smaller than 2MB!');
	}

	return isJpgOrPng && isLt2M;
}

const UploadButton = ({ isLoading }: { isLoading: boolean }) => (
	<div>
		{isLoading ? <LoadingOutlined /> : <PlusOutlined />}
		<div style={{ marginTop: '8px' }}>Upload</div>
	</div>
);

const ImageInput: React.FunctionComponent<ImageInputProps> = memo(
	({ image, onChange }) => {
		const [isLoading, setIsLoading] = useState(false);
		const [imageSrc, setImageB64] = useState<any>();

		function handleChange(info: UploadChangeParam<UploadFile<any>>) {
			if (info.file.status === 'uploading') {
				setIsLoading(true);
				return;
			}

			if (info.file.status === 'done') {
				// getBase64(info.file.originFileObj, (imageUrl: string) => {
				// 	onChange(imageUrl);
				// 	setIsLoading(false);
				// });

				if (info.file.originFileObj) {
					onChange(info.file.originFileObj);
				}

				setIsLoading(false);
			}
		}

		useEffect(() => {
			if (image) {
				if (image instanceof File) {
					getBase64(image as any, setImageB64);
				} else {
					setImageB64(image);
				}
			}
		}, [image]);

		return (
			<Upload
				name='avatar'
				listType='picture-card'
				showUploadList={false}
				beforeUpload={validate}
				// @ts-ignore
				customRequest={({ onSuccess }) => onSuccess('ok', Promise.resolve())}
				onChange={handleChange}
			>
				{imageSrc ? (
					<img src={imageSrc} alt='avatar' style={{ width: '100%' }} />
				) : (
					<UploadButton isLoading={isLoading} />
				)}
			</Upload>
		);
	},
	(prevProps, nextProps) => prevProps.image === nextProps.image
);

export default ImageInput;
