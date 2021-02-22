import {
	Entity,
	Column,
	OneToMany,
	BaseEntity,
	CreateDateColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';

// ======================================
//		Country Entity - SQL/GraphQL
// ======================================
@Entity('countries')
export default class Country extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
	public id!: string;

	@Column({
		type: 'varchar',
		length: 6,
		comment: 'Código del país.'
	})
	public code!: string;

	@Column({
		type: 'varchar',
		length: 6,
		comment: 'Prefijo del país.'
	})
	public prefix!: string;

	@Column({
		type: 'varchar',
		length: 100,
		comment: 'Nombre del país.'
	})
	public name!: string;

	
	// ======================================
	//			RelationShips
	// ======================================1

	// En una ciudad viven muchos usuarios
	@OneToMany(() => User, (user: User) => user.country)
	public users?: User[];
	
	@CreateDateColumn({
		type: 'timestamp',
		nullable: true,
	})
	public created_at?: Date;
}
