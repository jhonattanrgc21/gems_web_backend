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
	OneToMany,
} from 'typeorm';
import Board from './board.entity';
import Report from './report.entity';

// ======================================
//		Circuit Entity - SQL
// ======================================
@Entity('circuitrs')
export default class Circuit extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
	public id!: string;

	@Column({ type: 'varchar', length: 191, comment: 'Nombre del Circuito' })
	public name!: string;

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

	// Un circuito puede generar muchos reportes
	@OneToMany(() => Report, (reports: Report) => reports.circuit)
	public reports?: Report[];

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
