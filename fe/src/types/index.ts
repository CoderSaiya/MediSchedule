export interface Response<T> {
    data: T;
    message: number;
    statusCode: number;
    isSuccess: boolean;
}