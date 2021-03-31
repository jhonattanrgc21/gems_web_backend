import Board from "../../database/entities/boards.entity";
import Project from "../../database/entities/projects.entity";

export interface BoardInterface{
	name?: string,
	project: Project;
	board_padre?: Board;
}
