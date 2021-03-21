import Board from '../../database/entities/board.entity';

// ======================================
//			Circuit Interface
// ======================================
export interface CircuitInterface {
	name: string
	board_padre: Board;
	board_hijo?: Board;
}
