enum CompanyMemberRole {
    Owner = "OWNER", Member = "MEMBER"
}

class CompanyMember {
    id?: number;
    user?: number;
    company?: number;
    role?: CompanyMemberRole;
}

export { CompanyMember, CompanyMemberRole };