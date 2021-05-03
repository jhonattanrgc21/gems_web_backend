import Board from './boards.entity';
import Report from './reports.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import UuidEntity from './uuid.entity';

// ======================================
//		Circuit Entity - SQL
// ======================================
@Entity('circuitrs')
export default class Circuit extends UuidEntity {
	@Column({ type: 'varchar', length: 191, comment: 'Nombre del Circuito' })
	public name!: string;

	@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Tipo de carga',
	})
	public loadType?: number;

	@Column({
		type: 'int',
		unsigned: true,
		nullable: true,
		comment: 'Potencia del circuito',
	})
	public power?: number;

	@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Potencia del circuito',
	})
	public distance?: number;

	@Column({
		type: 'float',
		precision: 3,
		scale: 1,
		nullable: true,
		comment: 'Factor de potencia',
	})
	public powerFactor?: number;

	@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Caida de voltaje',
	})
	public voltageDrop?: number;

	@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Capacidad de aislamiento',
	})
	public aisolation?: number;

	@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Grados de temperatura',
	})
	public temperature?: number;

	@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Fases',
	})
	public loadPhases?: number;

	@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Conductores por fases',
	})
	public perPhase?: number;

	@Column({
		type: 'bool',
		nullable: true,
		comment: 'Alimentador por cable neutro',
	})
	public feeder_include_neutral_wire?: boolean;

	@Column({
		type: 'tinyint',
		unsigned: true,
		nullable: true,
		comment: 'Materia de tuberia',
	})
	public pipe_material?: number;

	@Column({
		type: 'smallint',
		unsigned: true,
		nullable: true,
		comment: 'Tension del sistema',
	})
	public system_voltage?: number;

	// ======================================
	//			RelationShips
	// ======================================
	// Muchos circuitos son contenidos por un tablero
	@ManyToOne(() => Board, (board_padre: Board) => board_padre.circuits, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'board_padre_id' })
	public board_padre!: Board;

	// Un circuito puede generar muchos reportes
	@OneToMany(() => Report, (reports: Report) => reports.circuit)
	public reports?: Report[];
}
