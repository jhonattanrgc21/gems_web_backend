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
//		Report Entity - SQL
// ======================================
@Entity('report')
export default class Report extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id!: string;

	@Column({
		type: 'bigint',
		unsigned: true,
		default: 0
	})
	public current!: string;

	@Column({
		type: 'bigint',
		unsigned: true,
		comment: 'Anchura del cable.',
		default: 0
	})
	public cable_width!: string;

	@Column({
		type: 'bigint',
		unsigned: true,
		comment: 'Diametro de la tuberia.',
		default: 0
	})
	public pipe_diameter!: string;

	@Column({
		type: 'bigint',
		unsigned: true,
		comment: 'Dispositivo de proteccion.',
		default: 0
	})
	public protection_device!: string;

	@Column({
		type: 'bigint',
		unsigned: true,
		comment: 'Caida de voltaje.',
		default: 0
	})
	public voltaje_drop!: string;

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
