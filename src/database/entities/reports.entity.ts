import Circuit from './circuits.entity';
import {
	Entity,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import UuidEntity from './uuid.entity';

// ======================================
//		Report Entity - SQL
// ======================================
@Entity('reports')
export default class Report extends UuidEntity {
		@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Tipo de carga',
	})
	public loadType?: number;

	@Column({
		type: 'int',
		unsigned: true,
		nullable: true,
		comment: 'Potencia del circuito',
	})
	public power?: number;

	@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Potencia del circuito',
	})
	public distance?: number;

	@Column({
		type: 'float',
		precision: 3,
		scale: 1,
		nullable: true,
		comment: 'Factor de potencia',
	})
	public powerFactor?: number;

	@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Caida de voltaje',
	})
	public voltageDrop?: number;

	@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Capacidad de aislamiento',
	})
	public aisolation?: number;

	@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Grados de temperatura',
	})
	public temperature?: number;

	@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Fases',
	})
	public loadPhases?: number;

	@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Conductores por fases',
	})
	public perPhase?: number;

	@Column({
		type: 'bool',
		nullable: true,
		comment: 'Alimentador por cable neutro',
	})
	public feeder_include_neutral_wire?: boolean;

	@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Materia de tuberia',
	})
	public pipe_material?: number;

	@Column({
		type: 'smallint',
		unsigned: true,
		nullable: true,
		comment: 'Tension del sistema',
	})
	public system_voltage?: number;

	@Column({
		type: 'float',
		precision: 10,
		scale: 2,
		unsigned: true,
		default: 0,
	})
	public current: number;

	@Column({
		type: 'varchar',
		length: 5,
		comment: 'Anchura del cable.',
	})
	public cable_width: string;

	@Column({
		type: 'varchar',
		length: 5,
		comment: 'Diametro de la tuberia.'
	})
	public pipe_diameter: string;

	@Column({
		type: 'float',
		precision: 10,
		scale: 2,
		unsigned: true,
		comment: 'Dispositivo de proteccion.',
		default: 0,
	})
	public protection_device: number;

	@Column({
		type: 'float',
		precision: 10,
		scale: 2,
		unsigned: true,
		comment: 'Caida de voltaje.',
		default: 0,
	})
	public voltaje_drop: number;

	// ======================================
	//			RelationShips
	// ======================================

	// Muchos reportes son generados por un circuito
	@ManyToOne(() => Circuit, (circuit: Circuit) => circuit.report, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'circuit_id' })
	public circuit!: Circuit;
}
