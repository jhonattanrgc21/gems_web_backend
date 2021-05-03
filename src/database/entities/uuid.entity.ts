import {
	BaseEntity,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

export default class UuidEntity extends BaseEntity {
	@PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
	public id!: number;

	@CreateDateColumn({ type: 'timestamp', nullable: true, select: false })
	public created_at?: string;

	@UpdateDateColumn({ type: 'timestamp', nullable: true, select: false })
	public updated_at?: string;
}
