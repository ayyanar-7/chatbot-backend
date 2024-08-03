import { Injectable } from '@nestjs/common';
import { CreateChatBotDto } from './dto/create-chat-bot.dto';
import { UpdateChatBotDto } from './dto/update-chat-bot.dto';
import { ChatData } from './entities/chat-bot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ChatBotService {
  constructor(
    @InjectRepository(ChatData)
    private chatDataRepository: Repository<ChatData>,
    private readonly entityManager: EntityManager,
  ) {}
  
  async getAllChatData(){
    return this.chatDataRepository.find();
  }
  async getPieData(){
    return this.entityManager.query(`SELECT question_category AS name, ROUND((COUNT(*) / total_count.total) * 100) AS value
FROM chat_data, (SELECT COUNT(*) AS total FROM chat_data) AS total_count
GROUP BY question_category, total_count.total`);
  }

  async getTableInner(){
    return this.entityManager.query(`SELECT
  question_category AS category,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'question', question_text,
      'answer', answer_text,
      'difficulty_level', difficulty_level,
      'danger_level', danger_level
    )
  ) AS questions
FROM
  chat_data
GROUP BY
  question_category
LIMIT 10000;
`);
  }
  async getTableOuter(){
    return this.entityManager.query(`WITH LanguageCount AS (
    SELECT 
        question_category AS name,
        question_language AS language,
        COUNT(*) AS language_count
    FROM 
        chat_data
    GROUP BY 
        question_category, question_language
),
MostLanguage AS (
    SELECT 
        name,
        language AS mostLanguage
    FROM (
        SELECT 
            name,
            language,
            ROW_NUMBER() OVER (PARTITION BY name ORDER BY language_count DESC) AS rn
        FROM 
            LanguageCount
    ) ranked
    WHERE rn = 1
),
QuizCounts AS (
    SELECT 
        question_category AS name,
        COUNT(*) AS quesCount
    FROM 
        chat_data
    GROUP BY 
        question_category
),
DangerLevelSummary AS (
    SELECT 
        question_category AS name,
        danger_level,
        COUNT(*) AS count
    FROM 
        chat_data
    GROUP BY 
        question_category, danger_level
),
DifficultyLevelSummary AS (
    SELECT 
        question_category AS name,
        difficulty_level,
        COUNT(*) AS count
    FROM 
        chat_data
    GROUP BY 
        question_category, difficulty_level
)
SELECT 
    q.name AS Category,
    q.quesCount AS QuizCount,
    l.mostLanguage AS mostLanguage,
    MIN(c.created_by) AS User,
    MIN(c.created_at) AS Date,
    GROUP_CONCAT(DISTINCT CONCAT(d.danger_level, ': ', d.count) SEPARATOR ', ') AS DangerLevels,
    GROUP_CONCAT(DISTINCT CONCAT(dl.difficulty_level, ': ', dl.count) SEPARATOR ', ') AS DifficultyLevels
FROM 
    QuizCounts q
LEFT JOIN 
    MostLanguage l ON q.name = l.name
LEFT JOIN 
    chat_data c ON q.name = c.question_category
LEFT JOIN 
    DangerLevelSummary d ON q.name = d.name
LEFT JOIN 
    DifficultyLevelSummary dl ON q.name = dl.name
GROUP BY 
    q.name, q.quesCount, l.mostLanguage;
`);
  }
  // async createChatData(data) {
  //   console.log('dddddddddddddddddddddddd',data);
    
  //   const chatData = this.chatDataRepository.create({
  //     question_text : data.question_simplified,
  //     answer_text : data.answer_simplified,
  //     question_category: data.question_category,
  //     question_language  : data.question_language,
  //     related_topics: data.related_topics,
  //     difficulty_level: data.difficulty_level,
  //     danger_level: data.danger_level,
  //   });

  //   return this.chatDataRepository.save(chatData);
  // }
  async createChatData(string: any){
    try{
      var data =  JSON.parse(string)
      console.log(data['question_simplified'],'dddddddddddddddddddddddd',data);
      
      let param = [data['question_simplified'], data['answer_simplified'], data['question_category'],
        data['question_language'], 'comman', 1, 1 ]
        console.log('pppppppppppppppppppp', param);
        
          return this.entityManager.query(`INSERT INTO chat_data (
        question_text,
        answer_text,
        question_category,
        question_language,
        related_topics,
        difficulty_level,
        danger_level
      ) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      );
      `, param);
      }catch(err){
      console.log('errrrrrrrrrrrrrrrrror',err);
      return true;
    }
    
  }
}
