import { readFile } from 'fs';

export default (file: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		readFile(file, 'utf-8', (err, data) => {
			if (err) {
				if (err.code === 'ENOENT') resolve(null);
				else reject();
			} else resolve(data);
		});
	});
};
