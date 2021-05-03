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
	@ManyToOne(() => Circuit, (circuit: Circuit) => circuit.reports, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'circuit_id' })
	public circuit!: Circuit;
}
