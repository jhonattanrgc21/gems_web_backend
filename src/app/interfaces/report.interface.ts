import Circuit from '../../database/entities/circuits.entity';

// ======================================
//			Report Interface
// ======================================
export interface CreateReportInterface {
	current: number;
	cable_width: string;
	pipe_diameter: string;
	protection_device: number;
	voltage_drop: number;
	circuit: Circuit;
}

export interface UpdateReportInterface {
	current?: number;
	cable_width?: string;
	pipe_diameter?: string;
	protection_device?: number;
	voltage_drop?: number;
	circuit: Circuit;
}
