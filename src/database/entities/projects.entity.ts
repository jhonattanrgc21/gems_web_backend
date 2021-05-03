import Board from './boards.entity';
import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany
} from 'typeorm';
import User from './users.entity';
import UuidEntity from './uuid.entity';

// ======================================
//		Project Entity - SQL
// ======================================
@Entity('projects')
export default class Project extends UuidEntity {
	@Index('project_name_unique', { unique: true })
	@Column({ type: 'varchar', length: 191, comment: 'Nombre del Proyecto' })
	public name!: string;

	// ======================================
	//			RelationShips
	// ======================================
	// Muchos proyectos son realizados por un usuario
	@ManyToOne(() => User, (user: User) => user.projects, { onUpdate: 'CASCADE', onDelete: 'CASCADE'})
	@JoinColumn({ name: 'user_id' })
	public user!: User;

	// Un proyecto tiene muchos tableros
	@OneToMany(() => Board, (boards: Board) => boards.project)
	public boards?: Board[];
}
