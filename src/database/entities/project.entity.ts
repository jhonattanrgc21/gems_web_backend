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
} from 'typeorm';
import User from './user.entity';

// ======================================
//		Project Entity - SQL
// ======================================
@Entity('project')
export default class Project extends BaseEntity{
	@PrimaryGeneratedColumn()
	public id!: string;

	@Index('project_name_unique', { unique: true })
	@Column({ type: 'varchar', length: 191, comment: 'Nombre del Proyecto' })
	public name!: string;

	@CreateDateColumn({ type: 'timestamp', nullable: true })
	public created_at?: string;

	@UpdateDateColumn({ type: 'timestamp', nullable: true })
	public updated_at?: string;


	// ======================================
	//			RelationShips
	// ======================================
	@ManyToOne(() => User, (user: User) => user.projects)
	@JoinColumn({ name: 'user_id' })
	public user?: User;
}
