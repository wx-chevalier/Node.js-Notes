import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tag')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag: string;
}
