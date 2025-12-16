import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Position extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "real", nullable: true })
  lat: number;

  @Column({ type: "real", nullable: true })
  lng: number;

  @Column({ nullable: true })
  imagePath: string;

  @Column({ nullable: true })
  imageUri: string;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  tag: string[];

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
