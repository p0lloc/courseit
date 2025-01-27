export interface SavedProgramPlan {
    id: string;
    name: string;
    mainProgram: SavedProgram;
    master: SavedProgram | null;
}

export interface SavedProgram {
    id: string;
    years: SavedProgramYear[]
}

export interface SavedProgramYear {
    year: number;
    periods: SavedProgramPeriod[];
}

export interface SavedProgramPeriod {
    id: string;
    courses: string[];
}
