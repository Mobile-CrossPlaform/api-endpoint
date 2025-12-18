import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Tag extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    isOrgin: boolean;

    @Column()
    isLevel: boolean;

    @Column()
    isPrice: boolean;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}