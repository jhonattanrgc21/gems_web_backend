import {
	Entity,
	Column,
	ManyToOne,
	JoinColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';
import Circuit from './circuits.entity';
import UuidEntity from './uuid.entity';

// ======================================
//		Report Entity - SQL
// ======================================
@Entity('reports')
export default class Report extends UuidEntity {
	@Column({
		type: 'bigint',
		unsigned: true,
		default: 0,
	})
	public current?: number;

	@Column({
		type: 'bigint',
		unsigned: true,
		comment: 'Anchura del cable.',
		default: 0,
	})
	public cable_width?: number;

	@Column({
		type: 'bigint',
		unsigned: true,
		comment: 'Diametro de la tuberia.',
		default: 0,
	})
	public pipe_diameter?: number;

	@Column({
		type: 'bigint',
		unsigned: true,
		comment: 'Dispositivo de proteccion.',
		default: 0,
	})
	public protection_device?: number;

	@Column({
		type: 'bigint',
		unsigned: true,
		comment: 'Caida de voltaje.',
		default: 0,
	})
	public voltaje_drop?: number;

	// ======================================
	//			RelationShips
	// ======================================

	// Muchos reportes son generados por un circuito
	@ManyToOne(() => Circuit, (circuit: Circuit) => circuit.reports)
	@JoinColumn({ name: 'circuit_id' })
	public circuit!: Circuit;
}
