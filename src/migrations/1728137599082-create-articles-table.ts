// import {
//   MigrationInterface,
//   QueryRunner,
//   Table,
//   TableForeignKey,
// } from 'typeorm';

// export class CreateArticlesTable1728137599082 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.createTable(
//       new Table({
//         name: 'articles',
//         columns: [
//           {
//             name: 'id',
//             type: 'int',
//             isPrimary: true,
//             isGenerated: true,
//             generationStrategy: 'increment',
//           },
//           {
//             name: 'title',
//             type: 'varchar',
//             length: '255',
//             isNullable: false,
//           },
//           {
//             name: 'slug',
//             type: 'varchar',
//             length: '255',
//             isUnique: true,
//             isNullable: false,
//           },
//           {
//             name: 'content',
//             type: 'text',
//             isNullable: true,
//           },
//           {
//             name: 'author_id',
//             type: 'int',
//             isNullable: true,
//           },
//           {
//             name: 'status',
//             type: 'enum',
//             enum: ['draft', 'published', 'archived'],
//             default: "'draft'",
//           },
//           {
//             name: 'view_count',
//             type: 'int',
//             default: 0,
//           },
//           {
//             name: 'created_at',
//             type: 'timestamp',
//             default: 'CURRENT_TIMESTAMP',
//           },
//           {
//             name: 'updated_at',
//             type: 'timestamp',
//             default: 'CURRENT_TIMESTAMP',
//             onUpdate: 'CURRENT_TIMESTAMP',
//           },
//           {
//             name: 'published_at',
//             type: 'timestamp',
//             isNullable: true,
//           },
//         ],
//       }),
//     );

//     await queryRunner.createForeignKey(
//       'articles',
//       new TableForeignKey({
//         columnNames: ['author_id'],
//         referencedColumnNames: ['id'],
//         referencedTableName: 'users',
//         onDelete: 'SET NULL',
//       }),
//     );

//     await queryRunner.query(
//       `ALTER TABLE articles ADD FULLTEXT(title, content)`,
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     const table = await queryRunner.getTable('articles');
//     const foreignKey = table!.foreignKeys.find(
//       (fk) => fk.columnNames.indexOf('author_id') !== -1,
//     );
//     await queryRunner.dropForeignKey('articles', foreignKey!);
//     await queryRunner.dropTable('articles');
//   }
// }
