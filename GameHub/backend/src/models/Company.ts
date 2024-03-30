enum CompanyState {
    NotReady = 0, Active = 1, Blocked = 2
}

class Company {
    id?: number;
    name?: string; 
    descrition: string = "";
    state?: CompanyState;
}

export { Company, CompanyState };