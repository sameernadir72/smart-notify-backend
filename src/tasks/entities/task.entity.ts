import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Creates the Foreign Key relation to the User table
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  title: string;

  @Column()
  mood: string;

  @Column({ type: 'text', nullable: true })
  ai_suggestion: string;

  @Column({ type: 'datetime' })
  due_date: Date;

  @Column({ default: false })
  is_completed: boolean;

  @Column({ default: false })
  is_notified: boolean;

  @CreateDateColumn()
  created_at: Date;


}