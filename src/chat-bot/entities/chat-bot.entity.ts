import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class ChatData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  question_text: string;

  @Column('text')
  answer_text: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  question_category: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  question_language: string;

  @CreateDateColumn({ type: 'timestamp',  nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp',  nullable: true })
  updated_at: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  created_by: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  updated_by: string;

  @Column('text', { nullable: true })
  related_topics: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  difficulty_level: string;

  @Column('enum', { enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Low',  nullable: true })
  danger_level: string;
}
