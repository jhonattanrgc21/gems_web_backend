import Circuit from "../../database/entities/circuit.entity";
import Project from "../../database/entities/project.entity";

export interface CreateBoardInterface{
	name: string,
	project: Project;
}

export interface UpdateBoardInterface{
	name?: string;
}
