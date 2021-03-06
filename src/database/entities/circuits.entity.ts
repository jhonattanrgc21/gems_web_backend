import Board from './boards.entity';
import Report from './reports.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
} from 'typeorm';
import UuidEntity from './uuid.entity';

// ======================================
//		Circuit Entity - SQL
// ======================================
@Entity('circuitrs')
export default class Circuit extends UuidEntity {
	@Column({ type: 'varchar', length: 191, comment: 'Nombre del Circuito' })
	public name!: string;

	// ======================================
	//			RelationShips
	// ======================================
	// Muchos circuitos son contenidos por un tablero
	@ManyToOne(() => Board, (board_padre: Board) => board_padre.circuits, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'board_padre_id' })
	public board_padre!: Board;

	// Un circuito puede generar muchos reportes
	@OneToOne(() => Report, (report: Report) => report.circuit)
	public report?: Report;
}
