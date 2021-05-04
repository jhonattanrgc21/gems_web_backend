import Circuit from '../../database/entities/circuits.entity';

// ======================================
//			Report Interface
// ======================================
export interface CreateReportInterface {
	loadType: number;
	power: number;
	distance: number;
	powerFactor: number;
	voltageDrop: number;
	aisolation: number;
	temperature: number;
	loadPhases: number;
	perPhase: number;
	feeder_include_neutral_wire: boolean;
	pipe_material: number;
	system_voltage: number;
	current: number;
	cable_width: string;
	pipe_diameter: string;
	protection_device: number;
	voltage_drop: number;
	circuit: Circuit;
}

export interface UpdateReportInterface {
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
	current?: number;
	cable_width?: string;
	pipe_diameter?: string;
	protection_device?: number;
	voltage_drop?: number;
	circuit: Circuit;
}
