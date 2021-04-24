import Circuit from '../../database/entities/circuits.entity';

// ======================================
//			Report Interface
// ======================================
export interface ReportInterface {
	current?: number;
	cable_width?: string;
	pipe_diameter?: string;
	protection_device?: number;
	voltaje_drop?: number;
	circuit: Circuit;
}
