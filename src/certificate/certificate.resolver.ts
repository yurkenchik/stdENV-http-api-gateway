import {Args, Mutation, Resolver} from "@nestjs/graphql";
import {FileInterceptor} from "@nestjs/platform-express";
import {UserId} from "../decorators/user-id.decorator";
import {HttpException, Inject, UseInterceptors} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {firstValueFrom} from "rxjs";
import {UploadCertificateOutput} from "@studENV/shared/dist/outputs/certificates/upload-certificate.output";
// @ts-ignore
import {GraphQLUpload, FileUpload} from "graphql-upload";

@Resolver()
export class CertificateResolver {

    constructor(
        @Inject("NATS_SERVICE")
        private readonly natsClient: ClientProxy
    ) {}

    @Mutation(() => UploadCertificateOutput)
    @UseInterceptors(FileInterceptor("file"))
    async uploadCertificate(
        @UserId() userId: string,
        @Args({ name: "file", type: () => GraphQLUpload }) file: FileUpload
    ): Promise<Record<string, string>> {
        try {
            const result = await firstValueFrom(
                this.natsClient.send({ cmd: "uploadCertificate" }, { userId, file })
            );
            console.log(result);
            return result;
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

}