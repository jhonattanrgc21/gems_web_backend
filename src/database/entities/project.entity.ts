import {
	Index,
	Entity,
	Column,
	ManyToOne,
	JoinColumn,
	UpdateDateColumn,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	BaseEntity,
	OneToMany,
} from 'typeorm';
import User from './user.entity';
import Board from './board.entity';

// ======================================
//		Project Entity - SQL
// ======================================
@Entity('projects')
export default class Project extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
	public id!: string;

	@Index('project_name_unique', { unique: true })
	@Column({ type: 'varchar', length: 191, comment: 'Nombre del Proyecto' })
	public name!: string;

	
	// ======================================
	//			RelationShips
	// ======================================
	// Muchos proyectos son realizados por un usuario
	@ManyToOne(() => User, (user: User) => user.projects)
	@JoinColumn({ name: 'user_id' })
	public user?: User;
	
	// Un proyecto tiene muchos tableros
	@OneToMany(() => Board, (boards: Board) => boards.project)
	public boards?: Board[];

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
