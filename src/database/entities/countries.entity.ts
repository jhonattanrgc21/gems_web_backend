import {
	Entity,
	Column,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import User from './users.entity';
import UuidEntity from './uuid.entity';

// ======================================
//		Country Entity - SQL
// ======================================
@Entity('countries')
export default class Country extends UuidEntity {
	@Column({
		type: 'varchar',
		length: 6,
		comment: 'Código del país.',
	})
	public code!: string;

	@Column({
		type: 'varchar',
		length: 6,
		comment: 'Prefijo del país.',
	})
	public prefix!: string;

	@Column({
		type: 'varchar',
		length: 100,
		comment: 'Nombre del país.',
	})
	public name!: string;

	// ======================================
	//			RelationShips
	// ======================================1

	// En una ciudad viven muchos usuarios
	@OneToMany(() => User, (user: User) => user.country)
	public users?: User[];
}
