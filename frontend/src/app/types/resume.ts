export interface Experience{
    company: string;
    position: string;
    start_date: string;
    end_date: string | null;
    description: string | string[];
}

export interface Education{
    institution: string
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string | null;
}

export interface Certificates{
    title: string;
    institution: string
    date_of_receive: string;
    id: number | null;
    link: string | null;
}

export interface Resume{
    full_name: string;
    email: string;
    phone: string | null;
    summary: string | null;
    certificates: Certificates[]
    experiences: Experience[];
    education: Education[];
}
