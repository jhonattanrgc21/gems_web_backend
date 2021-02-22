import Board from '../../database/entities/board.entity';

export interface CircuitInterface {
	current?: number;
	cable_width?: number;
	pipe_diameter?: number;
	protection_device?: number;
	voltaje_drop?: number;
	board_padre?: Board;
	board_hijo?: Board;
}
