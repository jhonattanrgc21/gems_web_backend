import Board from '../../database/entities/boards.entity';

// ======================================
//			Circuit Interface
// ======================================
export interface CircuitInterface {
	name: string
	board_padre: Board;
}
