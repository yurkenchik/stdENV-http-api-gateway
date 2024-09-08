import {
    CanActivate,
    ExecutionContext,
    HttpException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import {GqlExecutionContext} from "@nestjs/graphql";
import {JwtService} from "@nestjs/jwt";
import * as process from "node:process";
import * as dotenv from 'dotenv';
import { User } from "@studENV/shared/dist/entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ExceptionMessageEnum} from "../utils/exception-message.enum";
dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const graphQlContext = GqlExecutionContext.create(context);
        const { req } = graphQlContext.getContext();
        const tokenParams = req.headers.authorization;

        try {
            const [bearer, token] = tokenParams.split(" ");

            if (bearer !== "Bearer" || !token) {
                throw new UnauthorizedException(ExceptionMessageEnum.UNAUTHORIZED_USER);
            }

            const userFromToken = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET_KEY || "secret"
            })

            const userFromDB = await this.userRepository
                .createQueryBuilder()
                .where("id = :userId", { userId: userFromToken.id })
                .select(["id"])
                .getOne();

            if (!userFromDB) {
                throw new UnauthorizedException(ExceptionMessageEnum.UNAUTHORIZED_USER)
            }
            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

}