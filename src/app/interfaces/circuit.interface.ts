import Board from '../../database/entities/boards.entity';

// ======================================
//			Circuit Interface
// ======================================
export interface CreateCircuitInterface {
	name: string;
	board_padre: Board;
}

export interface UpdateCircuitInterface {
	name?: string;
	loadType?: number;
	power?: number;
	distance?: number;
	powerFactor?: number;
	voltageDrop?: number;
	aisolation?: number;
	temperature?: number;
	loadPhases?: number;
	perPhase?: number;
	feeder_include_neutral_wire?: boolean;
	pipe_material?: number;
	system_voltage?: number;
	board_padre: Board;
}
