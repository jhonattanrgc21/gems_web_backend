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

// ======================================
//		User Entity - SQL
// ======================================
@Entity('users')
export default class User extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
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
		nullable: true,
	})
	public profesionalID?: number;

	@Column({
		type: 'text',
		comment: 'Reseteo de token.',
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
