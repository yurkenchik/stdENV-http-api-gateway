import {CanActivate, ExecutionContext, ForbiddenException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {Role} from "@studENV/shared/dist/entities/role.entity"
import {Repository} from "typeorm";
import * as process from "node:process";
import {RoleEnum} from "@studENV/shared/dist/utils/role.enum";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "../decorators/role.decorator";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const graphQlContext = GqlExecutionContext.create(context);
        const { req } = graphQlContext.getContext();
        const tokenParams = req.headers.authorization;

        try {
            const roles = this.reflector.get<Array<RoleEnum>>(ROLES_KEY, context.getHandler());
            if (!roles) {
                return true;
            }

            const [bearer, token] = tokenParams.split(" ");

            if (bearer !== "Bearer" || !token) {
                throw new UnauthorizedException("User is not authorized");
            }

            const userFromToken = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET_KEY || "secret"
            })

            const user = await this.userRepository
                .createQueryBuilder()
                .where("id = :userId", { userId: userFromToken.id })
                .getOne();

            const userRole = await this.roleRepository
                .createQueryBuilder()
                .where("role = :role", { role: user.role })
                .getOne();

            if (!roles.includes(userRole.role)) {
                throw new ForbiddenException("This action is only allowed for administrator");
            }

            req["user"] = user;
            return roles.includes(userRole.role);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

}