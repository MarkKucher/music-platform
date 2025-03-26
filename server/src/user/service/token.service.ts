import {Injectable} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import {InjectModel} from "@nestjs/mongoose";
import {Token, TokenDocument} from "../schema/token.schema";
import {Model} from "mongoose";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'randomstr'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'strrandom'

@Injectable()
export class TokenService{
    constructor(@InjectModel(Token.name) private tokenModel: Model<TokenDocument>) {
    }
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {expiresIn: '1d'})
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: '7d'})
        return {accessToken, refreshToken};
    }
    async saveToken(userId, refreshToken) {
        const tokenData = await this.tokenModel.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await this.tokenModel.create({user: userId, refreshToken})
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await this.tokenModel.deleteOne({refreshToken})
        return tokenData;
    }

    validateAccessToken(token) {
        try{
            const userData = jwt.verify(token, JWT_ACCESS_SECRET)
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try{
            const userData = jwt.verify(token, JWT_REFRESH_SECRET)
            return userData;
        } catch (e) {
            return null;
        }
    }

    async findToken(refreshToken) {
        const tokenData = await this.tokenModel.findOne({refreshToken})
        return tokenData;
    }
}