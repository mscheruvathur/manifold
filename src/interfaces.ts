export interface HttpEquivalentPrismaError {
    httpStatus?: number;
    message?: string;
    error?: {
        key: string;
        errorMessage: string;
    };
}
