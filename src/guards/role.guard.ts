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
import {ExceptionMessageEnum} from "../utils/exception-message.enum";

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

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const graphQlContext = GqlExecutionContext.create(context);
        const { req } = graphQlContext.getContext();
        const tokenParams = req.headers.authorization;

        try {
            const roles = this.reflector.get<Array<RoleEnum>>(ROLES_KEY, context.getHandler());
            if (!roles) {
                return true;
            }

            const [bearer, token] = tokenParams.split(" ");

            console.log("bearer and token ", [bearer, token]);

            if (bearer !== "Bearer" || !token) {
                throw new UnauthorizedException(ExceptionMessageEnum.UNAUTHORIZED_USER);
            }

            const userFromToken = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET_KEY || "secret"
            })

            console.log("USER FROM TOKEN, ROLE GUARD: ", userFromToken);

            const user = await this.userRepository
                .createQueryBuilder("user")
                .leftJoinAndSelect("user.role", "role")
                .where("user.id = :userId", { userId: userFromToken.id })
                .getOne();

            console.log("USER: ", user);

            const userRole = await this.roleRepository
                .createQueryBuilder("role")
                .where("role.id = :roleId", { roleId: user.role.id })
                .getOne();

            console.log("USER ROLE:", user.role);
            console.log("USERROLE:",userRole);

            if (!roles.includes(userRole.role)) {
                throw new ForbiddenException("This action is forbidden for this user");
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