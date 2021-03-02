import {
	Entity,
	Column,
	ManyToOne,
	JoinColumn,
	UpdateDateColumn,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	BaseEntity,
	OneToOne,
} from 'typeorm';
import Circuit from './circuit.entity';

// ======================================
//		Report Entity - SQL
// ======================================
@Entity('reports')
export default class Report extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
	public id!: string;

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

	@CreateDateColumn({
		type: 'timestamp',
		nullable: true,
		select: false,
	})
	public created_at?: string;

	@UpdateDateColumn({
		type: 'timestamp',
		nullable: true,
		select: false,
	})
	public updated_at?: string;
}
