import type { ProgramCourse, ProgramPeriod } from "./course";

export enum SidebarActionType {
	ADD_COURSE,
	EXISTING_COURSE
}

export type SidebarAction =
	SA<SidebarActionType.ADD_COURSE, AddCourseAction> | SA<SidebarActionType.EXISTING_COURSE, ExistingCourseAction>;

export interface AddCourseAction {
	period: ProgramPeriod;
	onCourseSelected: (c: ProgramCourse) => void;
}

export interface ExistingCourseAction {
	period: ProgramPeriod;
	course: ProgramCourse;
	onCourseDeleted: () => void;
}

export interface SA<T extends SidebarActionType, V> {
	type: T;
	value: V;
}
