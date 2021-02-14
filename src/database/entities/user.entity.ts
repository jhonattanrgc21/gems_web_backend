import {
	Index,
	Entity,
	Column,
	UpdateDateColumn,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToOne,
	JoinColumn,
	BaseEntity,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import Project from './project.entity';
import Country from './country.entity';
import Report from './report.entity';

// ======================================
//		User Entity - SQL
// ======================================
@Entity('user')
export default class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	public id!: string;

	@Index('user_username_unique', { unique: true })
	@Column({
		type: 'varchar',
		length: 15,
	})
	public username!: string;

	@Index('user_email_unique', { unique: true })
	@Column({
		type: 'varchar',
		length: 191,
	})
	public email!: string;

	@Column({
		type: 'varchar',
		length: 191,
	})
	public password!: string;

	@Column({
		type: 'varchar',
		length: 191,
		comment: 'Nombres.',
	})
	public first_name!: string;

	@Column({
		type: 'varchar',
		length: 191,
		comment: 'Apellidos.',
	})
	public last_name!: string;

	@Column({
		type: 'varchar',
		length: 20,
		comment: 'Teléfono.',
		nullable: true,
	})
	public phone?: string;

	@Column({
		type: 'text',
		comment: 'Direccion.',
		nullable: true,
	})
	public address?: string;

	@Index('user_profesionalID_unique', { unique: true })
	@Column({
		type: 'bigint',
		unsigned: true,
	})
	public profesionalID!: number;

	@CreateDateColumn({ type: 'timestamp', nullable: true })
	public created_at?: string;

	@UpdateDateColumn({ type: 'timestamp', nullable: true })
	public updated_at?: string;


	// ======================================
	//			RelationShips
	// ======================================

	// Un usuario puede publicar Muchos proyectos
	@OneToMany(() => Project, (project: Project) => project.user)
	public projects?: Project[];

	// Un usuario puede generar Muchos reportes
	@OneToMany(() => Report, (report: Report) => report.user)
	public reports?: Report[];

	// Muchos usuarios pertenecen a un pais
	@ManyToOne(() => Country, (country: Country) => country.users)
	@JoinColumn({ name: 'country' })
	public country?: Country;

	// ======================================
	//			Encrypt Password
	// ======================================
	public encryptPassword() {
		const salt = bcrypt.genSaltSync(10);
		this.password = bcrypt.hashSync(this.password, salt);
	}

	// ======================================
	//			Match Password
	// ======================================
	public matchPassword(receivedPassword: string) {
		return bcrypt.compareSync(receivedPassword, this.password);
	}
}
