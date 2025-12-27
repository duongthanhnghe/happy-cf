import 'mongoose'

declare module 'mongoose' {
  interface AggregatePaginateModel<T> extends Model<T> {
    aggregatePaginate(
      aggregate: any,
      options: {
        page?: number
        limit?: number
        sort?: any
      }
    ): Promise<any>
  }
}
