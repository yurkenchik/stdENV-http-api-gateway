import {Catch, ArgumentsHost, HttpException, ExceptionFilter} from '@nestjs/common';
import {GqlArgumentsHost, GqlExceptionFilter as IGqlExceptionFilter} from '@nestjs/graphql';
import { graphql, GraphQLError } from 'graphql';
// @ts-ignore
import { Response } from 'express';

@Catch()
export class GraphqlExceptionFilter implements ExceptionFilter {
    
    catch(exception: HttpException, host: ArgumentsHost) 
    {
        const gqlHost = GqlArgumentsHost.create(host);
        const ctx = gqlHost.getContext();
        const response = ctx.response;

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const message = exception.message;

            let code: string;
            switch (status) {
                case 400:
                    code = 'BAD_REQUEST';
                    break;
                case 401:
                    code = 'UNAUTHORIZED';
                    break;
                case 403:
                    code = 'FORBIDDEN';
                    break;
                case 404:
                    code = 'NOT_FOUND';
                    break;
                case 500:
                default:
                    code = 'INTERNAL_SERVER_ERROR';
                    break;
            }

            console.log(`EXCEPTION MESSAGE: ${message}, EXCEPTION STATUS: ${status}`);
            throw new GraphQLError(message, {
                extensions: {
                    code: code,
                    statusCode: status,
                },
            });
        } else {
            throw new GraphQLError('Internal server error', {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR',
                    statusCode: 500,
                },
            });
        }
    }

}
// @Catch()
// export class GraphqlExceptionFilter implements ExceptionFilter {

//     catch(exception: HttpException["response"], host: ArgumentsHost)
//     {
//         const response = host.switchToHttp().getResponse<Response>();

//         if (exception?.status && typeof exception?.status === "number") {
//             response.status(exception.status).send(exception);
//         } else {
//             response.status(400).send(exception);
//         }
//     }
// }
