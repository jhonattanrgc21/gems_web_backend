import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

import Circuit from './circuit.entity';
import Project from './project.entity';

// ======================================
//		Board Entity - SQL
// ======================================
@Entity('boards')
export default class Board extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
	public id!: string;

	@Column({ type: 'varchar', length: 191, comment: 'Nombre del Tablero' })
	public name!: string;

	// ======================================
	//			RelationShips
	// ======================================

	// Muchos tableros son de un proyecto
	@ManyToOne(() => Project, (project: Project) => project.boards)
	@JoinColumn({ name: 'project_id' })
	public project?: Project;
	
	// Un tablero contiene muchos cirtuitos
	@OneToMany(() => Circuit, (circuits: Circuit) => circuits.board_padre)
	public circuits?: Circuit[];

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
