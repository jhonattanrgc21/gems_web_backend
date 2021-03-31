import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

import Circuit from './circuits.entity';
import Project from './projects.entity';
import UuidEntity from './uuid.entity';

// ======================================
//		Board Entity - SQL
// ======================================
@Entity('boards')
export default class Board extends UuidEntity {
	@Column({ type: 'varchar', length: 191, comment: 'Nombre del Tablero' })
	public name!: string;

	// ======================================
	//			RelationShips
	// ======================================
	// Muchos tableros son de un proyecto
	@ManyToOne(() => Project, (project: Project) => project.boards, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'project_id' })
	public project!: Project;

	// Un tablero contiene muchos cirtuitos
	@OneToMany(() => Circuit, (circuits: Circuit) => circuits.board_padre)
	public circuits?: Circuit[];

	// Un tablero contiene muchos subtableros
	@OneToMany(() => Board, (board_hijos: Board) => board_hijos.board_padre)
	public board_hijos?: Board[];

	// Muchos Subtableros pertenecen a un tablero
	@ManyToOne(() => Board, (board_padre: Board) => board_padre.board_hijos, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'board_padre_id' })
	public board_padre?: Board;
}
