import Circuit from '../../database/entities/circuit.entity';

// ======================================
//			Report Interface
// ======================================
export interface ReportInterface {
	current?: number;
	cable_width?: number;
	pipe_diameter?: number;
	protection_device?: number;
	voltaje_drop?: number;
	circuit: Circuit;
}