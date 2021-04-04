export const paginate = (data: Array<any>, offset: number, limit: number) => data.slice(offset, offset + limit);
