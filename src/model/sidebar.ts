import type {Program, ProgramCourse, ProgramPeriod } from "./course";

export enum SidebarActionType {
	ADD_COURSE,
	EXISTING_COURSE,
	SELECT_MASTER
}

export type SidebarAction =
	SA<SidebarActionType.ADD_COURSE, AddCourseAction>
	| SA<SidebarActionType.EXISTING_COURSE, ExistingCourseAction>
	| SA<SidebarActionType.SELECT_MASTER, SelectMasterAction>;

export interface AddCourseAction {
	period: ProgramPeriod;
	onCourseSelected: (c: ProgramCourse) => void;
}

export interface ExistingCourseAction {
	period: ProgramPeriod;
	course: ProgramCourse;
	onCourseDeleted: () => void;
}


export interface SelectMasterAction {
	programs: Program[];
	onProgramSelected: (program: Program) => void;
}

export interface SA<T extends SidebarActionType, V> {
	type: T;
	value: V;
}
