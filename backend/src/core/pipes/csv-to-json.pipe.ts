import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as Papa from 'papaparse';

@Injectable()
export class CSVToJSONPipe implements PipeTransform {
	constructor(private field?: string) {}

	async transform(value: string | Record<any, any>, metadata: ArgumentMetadata) {
		let result = Papa.parse(this.field ? value[this.field] : value, { header: true, fastMode: true });

		if (this.field && typeof value === 'object') {
			return { ...value, [this.field]: result.data };
		}

		return result.data;
	}
}
