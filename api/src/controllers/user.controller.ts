import {Get, Post} from "../decorators/route.decorator";
import {Controller} from "../decorators/controller.decorator";
import {Service} from "typedi";
import {Logger} from "../lib/logger";
import winston from "winston";
import {LoginDto} from "../dto/login.dto";
import {DtoFactory} from "../dto/dto.factory";
import {UserService} from "../services/user.service";
import {RefreshTokenDto} from "../dto/refresh.token.dto";
import {Response} from "express";

@Service()
@Controller()
export class UserController {

    private readonly logger: winston.Logger;

    constructor(private readonly userService: UserService) {
        this.logger = Logger.getLogger();
    }

    @Post('/auth')
    public async auth(req: Request, res: Response) {
        const dto = await DtoFactory.create(LoginDto, req.body as Partial<LoginDto>);
        const response = await this.userService.login(dto);
        return res
            .json(response)
            .status(200);
    }

    @Post('/refresh_token')
    public async refreshToken(req: Request, res: Response) {
        const dto = await DtoFactory.create(RefreshTokenDto, req.body as Partial<RefreshTokenDto>);
        const response = await this.userService.refreshToken(dto);
        return res
            .json(response)
            .status(200);
    }


}