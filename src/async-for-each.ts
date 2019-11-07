async function asyncForEach(
	array: any[],
	callback: (val?: any, index?: number, array?: any[]) => Promise<any>
): Promise<void> {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

export default asyncForEach;
