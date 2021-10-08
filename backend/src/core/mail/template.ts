import * as fs from 'fs';
import * as path from 'path';
import { compile } from 'handlebars';

export function emailTemplate(templateName: string, context: any) {
	const templateFile = fs.readFileSync(
		path.resolve(__dirname, `../../../core/mail/templates/${templateName}.hbs`)
	);
	const template = compile(templateFile.toString());
	return template(context);
}
