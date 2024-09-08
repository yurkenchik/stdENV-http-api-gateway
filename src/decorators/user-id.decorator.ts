import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {GqlExecutionContext} from "@nestjs/graphql";

export const UserId = createParamDecorator((data: any, context: ExecutionContext) => {
    const graphQlContext = GqlExecutionContext.create(context);
    const { req } = graphQlContext.getContext();
    return req.user?.id;
});