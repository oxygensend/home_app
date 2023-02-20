import { Service } from 'typedi';
import { Logger } from '../lib/logger';
import winston from 'winston';
import { UserService } from '../services';
import { Response } from 'express';
import { DtoFactory } from '../factories';
import {Controller, Get, Post} from "../decorators/routing";
import {AuthMiddleware, ObjectIDMiddleware} from "../middlewares";
import {LoginDto, RefreshTokenDto} from "../dto";

@Service()
@Controller()
export default class UserController {
    private readonly logger: winston.Logger;

    constructor(private readonly userService: UserService) {
        this.logger = Logger.getLogger();
    }

    @Post('/auth')
    public async auth(req: Request, res: Response) {
        const dto = await DtoFactory.create<LoginDto>(
            LoginDto,
            req.body as Partial<LoginDto>
        );
        const response = await this.userService.login(dto);
        return res.json(response).status(200);
    }

    @Post('/refresh_token')
    public async refreshToken(req: Request, res: Response) {
        const dto = await DtoFactory.create<RefreshTokenDto>(
            RefreshTokenDto,
            req.body as Partial<RefreshTokenDto>
        );
        const response = await this.userService.refreshToken(dto);
        return res.json(response).status(200);
    }

    @Get('/users/:id', [AuthMiddleware, ObjectIDMiddleware])
    public async getUser(req: Request, res: Response) {
        console.log(req);
    }
}
