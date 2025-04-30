export type UserT = {
    dni: string,
    name: string,
    last_name: string,
    full_name: string,
    user_name: string,
    email: string,
    phone: string,
    address: string,
    password: string,
    role_id: string
    cooperative_id: string
};

export type UserSignUpT = Pick<UserT, 'email' | 'user_name' | 'password'>;


export type UserLocalStorageT = Pick<UserT, 'full_name' | 'role_id' | 'cooperative_id'>;

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
}


































































