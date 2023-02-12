import {Get, Post} from "../decorators/route.decorator";
import {Controller} from "../decorators/controller.decorator";
import {Service} from "typedi";
import {Logger} from "../lib/logger";
import winston from "winston";
import {LoginDto} from "../dto/login.dto";
import {DtoFactory} from "../dto/dto.factory";
import {HttpExceptions} from "../exceptions/exceptions";
import {User} from "../models/user.model";
import * as bcrypt from "bcrypt";
import {config} from "../config/config";
import * as fs from "fs";
import * as jwt from 'jsonwebtoken';
import {UserService} from "../services/user.service";
import {RefreshTokenDto} from "../dto/refresh.token.dto";

@Service()
@Controller('')
export class UserController {

    private readonly logger: winston.Logger;

    constructor(private readonly userService: UserService) {
        this.logger = Logger.getLogger();
    }

    @Post('/auth')
    public async auth(req: Request, res: Response) {

        const dto = await DtoFactory.create(LoginDto, req.body as Partial<LoginDto>);

       const response = await this.userService.login(dto);

      // @ts-ignore
        return res.json({data: response});
    }

    @Post('/refresh_token')
    public async refreshToken(req: Request, res: Response){

        const dto = await DtoFactory.create(RefreshTokenDto, req.body as Partial<RefreshTokenDto>);


        const response = await this.userService.refreshToken(dto);

        // @ts-ignore
        return res.json({data: response});
    }


}