export type UserT = {
    dni: string,
    name: string,
    lastName: string,
    fullName: string,
    userName: string,
    email: string,
    phone: string,
    address: string,
    password: string,
    roleID: string
};

export type UserSignUpT = Pick<UserT, 'email' | 'userName' | 'password'>;

export type CreateUserT = Omit<UserT, 'password'>;
export type UserLocalStorageT = Pick<UserT, 'fullName' | 'roleID'>;

export type amortizationT = {
    method:string,
    loanAmount: number,
    priceGoods?: number,
    paymentTime: number,
    interestRate: number,
}

export type tableAmortizationDataT={
    id:number,
    paymentDate: string,
    capital: number,
    interest: number,
    lifeInsurance: number, //Seguro de desgravamen o vida
    insurance: number,
    fee: number,
    balance: number,
};

export type bankT = {
    name: string,
    address: string,
    phone: string,
    email: string,
    slogan: string,
    logo?: string,
};

export type loanSettingsT = {
        interest: number;
        insurance: number;
        minAmount: number;
        maxAmount: number;
        maxCostGoods: number;
        minCostGoods: number;
}
































































