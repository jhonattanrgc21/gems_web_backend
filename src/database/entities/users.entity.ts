import bcrypt from 'bcryptjs';
import Country from './countries.entity';
import Project from './projects.entity';
import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import UuidEntity from './uuid.entity';

// ======================================
//		User Entity - SQL
// ======================================
@Entity('users')
export default class User extends UuidEntity {
	@Index('user_username_unique', { unique: true })
	@Column({
		type: 'varchar',
		length: 20,
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
		nullable: true,
	})
	public profesionalID?: number;

	@Column({
		type: 'varchar',
		length: 191,
		comment: 'Nombre del lugar de trabajo..',
		nullable: true,
	})
	public company?: string;

	@Column({
		type: 'bool',
		comment: 'Estatus del registro.',
		default: 0,
		nullable: true,
	})
	public status?: boolean;

	@Column({
		type: 'text',
		comment: 'Token de confirmacion.',
		nullable: true,
	})
	public confirmToken?: string;

	@Column({
		type: 'text',
		comment: 'Token de recuperacion.',
		nullable: true,
	})
	public resetToken?: string;

	// ======================================
	//			RelationShips
	// ======================================

	// Un usuario realiza Muchos proyectos
	@OneToMany(() => Project, (project: Project) => project.user)
	public projects?: Project[];

	// Muchos usuarios viven en un pais
	@ManyToOne(() => Country, (country: Country) => country.users)
	@JoinColumn({ name: 'country_id' })
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
