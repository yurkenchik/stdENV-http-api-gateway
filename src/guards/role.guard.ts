import {CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {Repository} from "typeorm";
import * as process from "node:process";
import {RoleEnum} from "@studENV/shared/dist/utils/role.enum";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLE_KEY} from "../decorators/role.decorator";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const request = context.switchToHttp().getRequest();
        const tokenParams = request.headers.authorization;

        try {
            const role = this.reflector.get<RoleEnum>(ROLE_KEY, context.getHandler());
            if (!role) {
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
                .where("id =: userId", { userId: userFromToken.id })
                .getOne();

            if (user.role !== role) {
                throw new ForbiddenException("This action is only allowed for administrator");
            }

            request["user"] = user;
            return true;
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }

}