import Circuit from "../../database/entities/circuit.entity";
import Project from "../../database/entities/project.entity";

export interface BoardInterface{
	name?: string,
	project: Project;
}
