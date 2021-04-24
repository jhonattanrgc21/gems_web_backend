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
		type: 'double',
		unsigned: true,
		default: 0,
	})
	public current?: number;

	@Column({
		type: 'varchar',
		length: 5,
		comment: 'Anchura del cable.',
		nullable: true,
	})
	public cable_width?: string;

	@Column({
		type: 'varchar',
		length: 5,
		comment: 'Diametro de la tuberia.',
		nullable: true,
	})
	public pipe_diameter?: string;

	@Column({
		type: 'double',
		unsigned: true,
		comment: 'Dispositivo de proteccion.',
		default: 0,
	})
	public protection_device?: number;

	@Column({
		type: 'double',
		unsigned: true,
		comment: 'Caida de voltaje.',
		default: 0,
	})
	public voltaje_drop?: number;

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
