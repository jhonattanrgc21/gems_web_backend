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
import Board from './board.entity';

// ======================================
//		Circuit Entity - SQL
// ======================================
@Entity('circuitrs')
export default class Circuit extends BaseEntity {
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

	// Muchos circuitos son contenidos por un tablero
	@ManyToOne(() => Board, (board_padre: Board) => board_padre.circuits)
	@JoinColumn({ name: 'board_padre_id' })
	public board_padre!: Board;

	// Un circuito puede ser un tablero
	@OneToOne(() => Board)
	@JoinColumn({ name: 'board_hijo_id' })
	public board_hijo?: Board;

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
