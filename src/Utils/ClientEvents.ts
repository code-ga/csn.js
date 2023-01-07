import AccountLoginInfo from "../Typings/Interfaces/AccountLoginInfo";

export default interface ClientEvents {
    login: [data: AccountLoginInfo];
}