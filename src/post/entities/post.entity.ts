import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Base } from "../../utils/base.entity";

@Entity()
export class Post extends Base{

  @Column()
  title!: string;

  @Column('text')
  content!: string;

}