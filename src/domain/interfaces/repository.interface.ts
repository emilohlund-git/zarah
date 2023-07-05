export interface Repository<T> {
  create(createArgs: any): Promise<T>;
  update(updateArgs: any): Promise<T>;
  delete(deleteArgs: any): Promise<T>;
  findUnique(findUniqueArgs: any): Promise<T | undefined>;
  findMany(findManyArgs: any): Promise<T[]>;
}