import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateArticleCategoriesTables1728137912130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'article_categories',
        columns: [
          {
            name: 'article_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'category_id',
            type: 'int',
            isPrimary: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'article_categories',
      new TableForeignKey({
        columnNames: ['article_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'articles',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'article_categories',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('article_categories');

    const articleForeignKey = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('article_id') !== -1,
    );
    await queryRunner.dropForeignKey('article_categories', articleForeignKey!);

    const categoryForeignKey = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('category_id') !== -1,
    );
    await queryRunner.dropForeignKey('article_categories', categoryForeignKey!);
    await queryRunner.dropTable('article_categories');
  }
}
