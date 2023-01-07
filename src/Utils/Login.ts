import axios from "axios";
import AccountLoginData from "../Typings/Interfaces/AccountLoginData";
import { LoginAPIData } from "../Typings/Interfaces/LoginAPIData";
import { LOGIN_ENDPOINT } from "./Constants";

export async function LoginByAccount(accountInfo: AccountLoginData): Promise<LoginAPIData<200> | LoginAPIData<400>>  {
    const request = await axios({
        url: encodeURI(LOGIN_ENDPOINT),
        method: "POST",
        data: {
            email: accountInfo.email,
            password: accountInfo.password,
        }
    });

    if (request.data.code = 200) {
        const response: LoginAPIData<200> = request.data;
        return response;
    }

    if (request.data.code = 400) {
        const response: LoginAPIData<400> = request.data;
        return response;
    }
}